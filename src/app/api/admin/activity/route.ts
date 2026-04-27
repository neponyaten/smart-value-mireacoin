import { getCurrentUserFromRequest } from "@/lib/api/auth-user";
import { isAdminRequest, resolveActorUserId } from "@/lib/auth/admin-guard";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const fullAccessRoles = new Set(["admin", "superadmin"]);

export async function GET(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const currentUser = getCurrentUserFromRequest(request) as { userType?: string; role?: string } | null;
    const currentUserType = currentUser?.userType ?? "user";
    const actorUserId = await resolveActorUserId(request);

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
    const pageSize = Math.min(100, Math.max(5, Number(searchParams.get("pageSize") ?? "20") || 20));
    const search = (searchParams.get("search") ?? "").trim();
    const role = (searchParams.get("role") ?? "").trim();
    const action = (searchParams.get("action") ?? "").trim();
    const targetType = (searchParams.get("targetType") ?? "").trim();
    const targetUser = (searchParams.get("targetUser") ?? "").trim();
    const staffUserId = Number(searchParams.get("staffUserId") ?? "0") || undefined;
    const dateFrom = (searchParams.get("dateFrom") ?? "").trim();
    const dateTo = (searchParams.get("dateTo") ?? "").trim();

    if (!fullAccessRoles.has(currentUserType) && currentUserType !== "moderator") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const where: {
      userId?: number;
      actorRole?: string;
      action?: string;
      targetType?: string;
      targetUserId?: number | { in: number[] };
      createdAt?: { gte?: Date; lte?: Date };
      OR?: Array<{
        summary?: { contains: string };
        user?: { fullName?: { contains: string }; email?: { contains: string } };
        targetId?: number;
      }>;
    } = {};

    if (currentUserType === "moderator") {
      if (!actorUserId) {
        return NextResponse.json({ error: "Actor user not found" }, { status: 401 });
      }
      where.userId = actorUserId;
    }

    if (fullAccessRoles.has(currentUserType) && staffUserId) {
      where.userId = staffUserId;
    }

    if (role) {
      where.actorRole = role;
    }
    if (action) {
      where.action = action;
    }
    if (targetType) {
      where.targetType = targetType;
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

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    if (search) {
      const numericSearch = Number(search);
      where.OR = [
        { summary: { contains: search } },
        { user: { fullName: { contains: search } } },
        { user: { email: { contains: search } } },
      ];
      if (Number.isFinite(numericSearch)) {
        where.OR.push({ targetId: numericSearch });
      }
    }

    const [items, total, staff] = await Promise.all([
      prisma.adminAuditLog.findMany({
        where,
        include: {
          user: { select: { id: true, fullName: true, email: true, userType: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.adminAuditLog.count({ where }),
      fullAccessRoles.has(currentUserType)
        ? prisma.user.findMany({
            where: { userType: { in: ["moderator", "admin", "superadmin", "helper"] } },
            select: { id: true, fullName: true, email: true, userType: true },
            orderBy: { fullName: "asc" },
          })
        : Promise.resolve([]),
    ]);

    const targetUserIds = Array.from(new Set(items.map((item) => item.targetUserId).filter((id): id is number => Boolean(id))));
    const targetUsers = targetUserIds.length
      ? await prisma.user.findMany({
          where: { id: { in: targetUserIds } },
          select: { id: true, fullName: true, email: true, userType: true },
        })
      : [];
    const targetUserMap = new Map(targetUsers.map((user) => [user.id, user]));

    return NextResponse.json({
      items: items.map((item) => ({
        ...item,
        detailsParsed: item.details ? safeJsonParse(item.details) : null,
        targetUser: item.targetUserId ? targetUserMap.get(item.targetUserId) ?? null : null,
      })),
      total,
      page,
      pageSize,
      staff,
    });
  } catch (error) {
    console.error("Admin activity GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function safeJsonParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
