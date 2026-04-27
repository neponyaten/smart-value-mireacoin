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
    const userType = (searchParams.get("userType") ?? "").trim();
    const role = (searchParams.get("role") ?? "").trim();
    const blocked = (searchParams.get("blocked") ?? "").trim();
    const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
    const pageSize = Math.min(100, Math.max(5, Number(searchParams.get("pageSize") ?? "10") || 10));
    const sortBy = (searchParams.get("sortBy") ?? "createdAt").trim();
    const sortOrder = (searchParams.get("sortOrder") ?? "desc").trim() === "asc" ? "asc" : "desc";

    const where: {
      userType?: string;
      role?: string;
      isBlocked?: boolean;
      OR?: Array<{
        fullName?: { contains: string };
        email?: { contains: string };
        group?: { contains: string };
      }>;
    } = {};

    if (userType) {
      where.userType = userType;
    }
    if (role) {
      where.role = role;
    }
    if (blocked === "true") {
      where.isBlocked = true;
    }
    if (blocked === "false") {
      where.isBlocked = false;
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { email: { contains: search } },
        { group: { contains: search } },
      ];
    }

    const orderByMap: Record<string, { [key: string]: "asc" | "desc" }> = {
      createdAt: { createdAt: sortOrder },
      role: { role: sortOrder },
      coins: { coins: sortOrder },
      lastSeenAt: { lastSeenAt: sortOrder },
      updatedAt: { updatedAt: sortOrder },
    };
    const orderBy = orderByMap[sortBy] ?? { createdAt: "desc" };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          userAchievements: { select: { id: true } },
          userVfxGrants: { select: { id: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      items: users.map((user) => ({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        group: user.group,
        role: user.role,
        userType: user.userType,
        coins: user.coins,
        isBlocked: user.isBlocked,
        blockedAt: user.blockedAt,
        blockedReason: user.blockedReason,
        lastSeenAt: user.lastSeenAt,
        updatedAt: user.updatedAt,
        achievementsCount: user.userAchievements.length,
        vfxCount: user.userVfxGrants.length,
        createdAt: user.createdAt,
      })),
      page,
      pageSize,
      total,
      sortBy,
      sortOrder,
    });
  } catch (error) {
    console.error("Admin users GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

type UserAction =
  | "set_user_type"
  | "set_role"
  | "block"
  | "unblock"
  | "grant_coins"
  | "grant_achievement"
  | "grant_vfx";

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
      action?: UserAction;
      userId?: number;
      userType?: string;
      role?: string;
      reason?: string;
      amount?: number;
      achievementId?: number;
      vfxItemId?: number;
    };

    if (!body.userId || !body.action) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: body.userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (body.action === "set_user_type") {
      if (!body.userType || !["user", "moderator", "admin", "superadmin"].includes(body.userType)) {
        return NextResponse.json({ error: "Invalid user type" }, { status: 400 });
      }

      const updated = await prisma.user.update({
        where: { id: user.id },
        data: { userType: body.userType },
      });

      await writeAdminAuditLog(request, prisma, {
        action: "user_set_user_type",
        targetType: "User",
        targetId: user.id,
        targetUserId: user.id,
        summary: `Changed user type to ${body.userType}`,
        details: { from: user.userType, to: body.userType },
      });

      return NextResponse.json({ ok: true, user: updated });
    }

    if (body.action === "set_role") {
      if (!body.role) {
        return NextResponse.json({ error: "Role is required" }, { status: 400 });
      }

      const updated = await prisma.user.update({
        where: { id: user.id },
        data: { role: body.role },
      });

      await writeAdminAuditLog(request, prisma, {
        action: "user_set_role",
        targetType: "User",
        targetId: user.id,
        targetUserId: user.id,
        summary: `Changed role to ${body.role}`,
        details: { from: user.role, to: body.role },
      });

      return NextResponse.json({ ok: true, user: updated });
    }

    if (body.action === "block") {
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: {
          isBlocked: true,
          blockedAt: new Date(),
          blockedReason: body.reason?.trim() || "Blocked by admin",
        },
      });

      await writeAdminAuditLog(request, prisma, {
        action: "user_block",
        targetType: "User",
        targetId: user.id,
        targetUserId: user.id,
        summary: "Blocked user",
        details: { reason: updated.blockedReason },
      });

      return NextResponse.json({ ok: true, user: updated });
    }

    if (body.action === "unblock") {
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: {
          isBlocked: false,
          blockedAt: null,
          blockedReason: null,
        },
      });

      await writeAdminAuditLog(request, prisma, {
        action: "user_unblock",
        targetType: "User",
        targetId: user.id,
        targetUserId: user.id,
        summary: "Unblocked user",
      });

      return NextResponse.json({ ok: true, user: updated });
    }

    if (body.action === "grant_coins") {
      const amount = Number(body.amount ?? 0);
      if (!Number.isFinite(amount) || amount === 0) {
        return NextResponse.json({ error: "Amount must be non-zero" }, { status: 400 });
      }

      const updated = await prisma.user.update({
        where: { id: user.id },
        data: { coins: { increment: Math.floor(amount) } },
      });

      await writeAdminAuditLog(request, prisma, {
        action: "user_grant_coins",
        targetType: "User",
        targetId: user.id,
        targetUserId: user.id,
        summary: `Granted ${Math.floor(amount)} coins`,
        details: { amount: Math.floor(amount) },
      });

      return NextResponse.json({ ok: true, user: updated });
    }

    if (body.action === "grant_achievement") {
      if (!body.achievementId) {
        return NextResponse.json({ error: "achievementId is required" }, { status: 400 });
      }

      const achievement = await prisma.achievement.findUnique({ where: { id: body.achievementId } });
      if (!achievement) {
        return NextResponse.json({ error: "Achievement not found" }, { status: 404 });
      }

      await prisma.userAchievement.upsert({
        where: {
          userId_achievementId: {
            userId: user.id,
            achievementId: achievement.id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          achievementId: achievement.id,
        },
      });

      await writeAdminAuditLog(request, prisma, {
        action: "user_grant_achievement",
        targetType: "User",
        targetId: user.id,
        targetUserId: user.id,
        summary: `Granted achievement #${achievement.id}`,
        details: { achievementId: achievement.id },
      });

      return NextResponse.json({ ok: true });
    }

    if (body.action === "grant_vfx") {
      if (!body.vfxItemId) {
        return NextResponse.json({ error: "vfxItemId is required" }, { status: 400 });
      }

      const vfx = await prisma.vfxCatalogItem.findUnique({ where: { id: body.vfxItemId } });
      if (!vfx) {
        return NextResponse.json({ error: "VFX item not found" }, { status: 404 });
      }

      await prisma.userVfxGrant.upsert({
        where: {
          userId_vfxItemId: {
            userId: user.id,
            vfxItemId: vfx.id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          vfxItemId: vfx.id,
        },
      });

      await writeAdminAuditLog(request, prisma, {
        action: "user_grant_vfx",
        targetType: "User",
        targetId: user.id,
        targetUserId: user.id,
        summary: `Granted VFX #${vfx.id}`,
        details: { vfxItemId: vfx.id },
      });

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  } catch (error) {
    console.error("Admin users PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
