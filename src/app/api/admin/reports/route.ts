import { writeAdminAuditLog } from "@/lib/auth/admin-audit";
import { isAdminRequest, resolveActorUserId } from "@/lib/auth/admin-guard";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = (searchParams.get("search") ?? "").trim();
    const targetType = (searchParams.get("targetType") ?? "").trim();
    const status = (searchParams.get("status") ?? "").trim();
    const targetUser = (searchParams.get("targetUser") ?? "").trim();
    const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
    const pageSize = Math.min(100, Math.max(5, Number(searchParams.get("pageSize") ?? "10") || 10));
    const sortBy = (searchParams.get("sortBy") ?? "createdAt").trim();
    const sortOrder = (searchParams.get("sortOrder") ?? "desc").trim() === "asc" ? "asc" : "desc";

    const where: {
      targetType?: string;
      status?: string;
      targetUserId?: number | { in: number[] };
      OR?: Array<{
        reason?: { contains: string };
        reporter?: { fullName?: { contains: string }; email?: { contains: string } };
      }>;
    } = {};
    if (targetType) {
      where.targetType = targetType;
    }
    if (status) {
      where.status = status;
    }

    if (targetUser) {
      const numericTargetUserId = Number(targetUser);
      if (Number.isFinite(numericTargetUserId)) {
        where.targetUserId = numericTargetUserId;
      } else {
        const matchingUsers = await prisma.user.findMany({
          where: {
            OR: [
              { fullName: { contains: targetUser } },
              { email: { contains: targetUser } },
            ],
          },
          select: { id: true },
          take: 100,
        });
        where.targetUserId = { in: matchingUsers.map((user) => user.id) };
      }
    }
    if (search) {
      where.OR = [
        { reason: { contains: search } },
        { reporter: { fullName: { contains: search } } },
        { reporter: { email: { contains: search } } },
      ];
    }

    const orderByMap: Record<string, { [key: string]: "asc" | "desc" }> = {
      createdAt: { createdAt: sortOrder },
      status: { status: sortOrder },
      targetType: { targetType: sortOrder },
    };
    const orderBy = orderByMap[sortBy] ?? { createdAt: "desc" };

    const [items, total] = await Promise.all([
      prisma.contentReport.findMany({
        where,
        include: {
          reporter: { select: { id: true, fullName: true, email: true } },
          targetUser: { select: { id: true, fullName: true, email: true, isBlocked: true } },
          targetStatus: { select: { id: true, text: true, userId: true, updatedAt: true } },
          reviewedBy: { select: { id: true, fullName: true } },
        },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.contentReport.count({ where }),
    ]);

    return NextResponse.json({ items, page, pageSize, total, sortBy, sortOrder });
  } catch (error) {
    console.error("Admin reports GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const actorUserId = await resolveActorUserId(request);
    if (!actorUserId) {
      return NextResponse.json({ error: "Actor user not found" }, { status: 401 });
    }

    const body = (await request.json()) as {
      reportId?: number;
      action?: "resolve" | "reject" | "hide_status" | "restrict_user";
      comment?: string;
    };

    if (!body.reportId || !body.action) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const report = await prisma.contentReport.findUnique({ where: { id: body.reportId } });
    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    if (body.action === "hide_status") {
      if (!report.targetStatusId) {
        return NextResponse.json({ error: "Report has no target status" }, { status: 400 });
      }

      await prisma.userStatus.update({
        where: { id: report.targetStatusId },
        data: { text: "[Скрыто модератором]" },
      });
    }

    if (body.action === "restrict_user") {
      if (!report.targetUserId) {
        return NextResponse.json({ error: "Report has no target user" }, { status: 400 });
      }

      await prisma.user.update({
        where: { id: report.targetUserId },
        data: {
          isBlocked: true,
          blockedAt: new Date(),
          blockedReason: body.comment?.trim() || "Restricted by moderation report",
        },
      });
    }

    const nextStatus = body.action === "reject" ? "rejected" : "resolved";

    const updated = await prisma.contentReport.update({
      where: { id: report.id },
      data: {
        status: nextStatus,
        reviewedByUserId: actorUserId,
        reviewedAt: new Date(),
        reviewComment: body.comment?.trim() || null,
      },
    });

    await writeAdminAuditLog(request, prisma, {
      action: `report_${body.action}`,
      targetType: "ContentReport",
      targetId: report.id,
      targetUserId: report.targetUserId,
      summary: `Report #${report.id} -> ${nextStatus}`,
      details: { status: nextStatus, comment: body.comment ?? null, targetType: report.targetType },
    });

    return NextResponse.json({ ok: true, item: updated });
  } catch (error) {
    console.error("Admin reports PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
