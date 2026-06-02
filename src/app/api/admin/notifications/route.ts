import { writeAdminAuditLog } from "@/lib/auth/admin-audit";
import { isAdminRequest, resolveActorUserId } from "@/lib/auth/admin-guard";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const batches = await prisma.systemNotificationBatch.findMany({
      include: {
        sentByUser: { select: { id: true, fullName: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ items: batches });
  } catch (error) {
    console.error("Admin notifications GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const actorUserId = await resolveActorUserId(request);
    if (!actorUserId) {
      return NextResponse.json({ error: "Actor user not found" }, { status: 401 });
    }

    const body = (await request.json()) as {
      title?: string;
      message?: string;
      targetType?: "all" | "user" | "role";
      targetValue?: string;
    };

    const title = body.title?.trim() ?? "";
    const message = body.message?.trim() ?? "";
    const targetType = body.targetType ?? "all";

    if (!title || !message) {
      return NextResponse.json({ error: "title and message are required" }, { status: 400 });
    }

    let users: Array<{ id: number }> = [];

    if (targetType === "all") {
      users = await prisma.user.findMany({ select: { id: true } });
    } else if (targetType === "user") {
      const userId = Number(body.targetValue);
      if (!Number.isFinite(userId)) {
        return NextResponse.json({ error: "targetValue user id is invalid" }, { status: 400 });
      }
      users = await prisma.user.findMany({ where: { id: userId }, select: { id: true } });
    } else if (targetType === "role") {
      const role = (body.targetValue ?? "").trim();
      if (!role) {
        return NextResponse.json({ error: "targetValue role is required" }, { status: 400 });
      }
      users = await prisma.user.findMany({ where: { userType: role }, select: { id: true } });
    }

    if (users.length === 0) {
      return NextResponse.json({ error: "No target users found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.notification.createMany({
        data: users.map((user) => ({
          userId: user.id,
          type: "system",
          title,
          description: message,
          isRead: false,
        })),
      });

      await tx.systemNotificationBatch.create({
        data: {
          sentByUserId: actorUserId,
          targetType,
          targetValue: body.targetValue ?? null,
          title,
          message,
          recipientsCount: users.length,
        },
      });

      await writeAdminAuditLog(request, tx as typeof prisma, {
        action: "notification_send",
        targetType: "SystemNotificationBatch",
        summary: `Sent ${targetType} notification` ,
        details: { targetType, targetValue: body.targetValue ?? null, recipients: users.length },
      });
    });

    return NextResponse.json({ ok: true, recipients: users.length });
  } catch (error) {
    console.error("Admin notifications POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
