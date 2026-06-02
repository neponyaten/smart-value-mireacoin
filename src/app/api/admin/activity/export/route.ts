import { getCurrentUserFromRequest } from "@/lib/api/auth-user";
import { isAdminRequest, resolveActorUserId } from "@/lib/auth/admin-guard";
import { getAdminActionLabel, getAdminActionMeta } from "@/lib/constants/adminActionLabels";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const fullAccessRoles = new Set(["admin", "superadmin"]);

export async function GET(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const currentUser = getCurrentUserFromRequest(request) as { userType?: string } | null;
    const currentUserType = currentUser?.userType ?? "user";
    const actorUserId = await resolveActorUserId(request);

    if (!fullAccessRoles.has(currentUserType) && currentUserType !== "moderator") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = (searchParams.get("search") ?? "").trim();
    const role = (searchParams.get("role") ?? "").trim();
    const action = (searchParams.get("action") ?? "").trim();
    const targetType = (searchParams.get("targetType") ?? "").trim();
    const targetUser = (searchParams.get("targetUser") ?? "").trim();
    const staffUserId = Number(searchParams.get("staffUserId") ?? "0") || undefined;
    const dateFrom = (searchParams.get("dateFrom") ?? "").trim();
    const dateTo = (searchParams.get("dateTo") ?? "").trim();

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

    if (role) where.actorRole = role;
    if (action) where.action = action;
    if (targetType) where.targetType = targetType;

    if (targetUser) {
      const numericTargetUserId = Number(targetUser);
      if (Number.isFinite(numericTargetUserId)) {
        where.targetUserId = numericTargetUserId;
      } else {
        const matchingUsers = await prisma.user.findMany({
          where: {
            OR: [{ fullName: { contains: targetUser } }, { email: { contains: targetUser } }],
          },
          select: { id: true },
          take: 100,
        });
        where.targetUserId = { in: matchingUsers.map((user) => user.id) };
      }
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
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

    const items = await prisma.adminAuditLog.findMany({
      where,
      include: {
        user: { select: { id: true, fullName: true, email: true, userType: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5000,
    });

    const targetUserIds = Array.from(new Set(items.map((item) => item.targetUserId).filter((id): id is number => Boolean(id))));
    const targetUsers = targetUserIds.length
      ? await prisma.user.findMany({
          where: { id: { in: targetUserIds } },
          select: { id: true, fullName: true, email: true },
        })
      : [];
    const targetUserMap = new Map(targetUsers.map((user) => [user.id, user]));

    const rows = [
      ["date_time", "actor", "actor_role", "action_type", "action_label", "entity_type", "entity_id", "target_user", "summary"],
      ...items.map((item) => {
        const targetUserEntity = item.targetUserId ? targetUserMap.get(item.targetUserId) : null;
        const actionMeta = getAdminActionMeta(item.action);
        const safeSummary = item.summary || actionMeta.shortDescription;

        return [
          new Date(item.createdAt).toISOString(),
          `${item.user.fullName} (${item.user.email})`,
          item.actorRole || item.user.userType || "",
          item.action,
          getAdminActionLabel(item.action),
          item.targetType || "",
          item.targetId ? String(item.targetId) : "",
          targetUserEntity ? `${targetUserEntity.fullName} (${targetUserEntity.email})` : "",
          safeSummary,
        ];
      }),
    ];

    const csv = "\uFEFF" + rows.map((row) => row.map(escapeCsvCell).join(",")).join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename=activity-log-${new Date().toISOString().slice(0, 10)}.csv`,
      },
    });
  } catch (error) {
    console.error("Admin activity export error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function escapeCsvCell(value: string) {
  const safe = value.replace(/"/g, '""');
  return `"${safe}"`;
}
