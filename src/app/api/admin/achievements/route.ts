import { writeAdminAuditLog } from "@/lib/auth/admin-audit";
import { isAdminRequest, resolveActorUserId } from "@/lib/auth/admin-guard";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const items = await prisma.achievement.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Admin achievements GET error:", error);
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
      description?: string;
      reward?: number;
      rarity?: string;
      category?: string;
      icon?: string;
      isActive?: boolean;
    };

    const title = body.title?.trim() ?? "";
    const description = body.description?.trim() ?? "";
    const reward = Math.max(0, Math.floor(Number(body.reward ?? 0)));
    const rarity = (body.rarity ?? "common").trim();
    const category = (body.category ?? "activity").trim();
    const icon = (body.icon ?? "🏅").trim();

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const created = await prisma.achievement.create({
      data: {
        title,
        description,
        reward,
        rarity,
        category,
        icon,
        isActive: body.isActive ?? true,
      },
    });

    await writeAdminAuditLog(request, prisma, {
      action: "achievement_create",
      targetType: "Achievement",
      targetId: created.id,
      summary: `Created achievement #${created.id}`,
      details: { title: created.title, rarity: created.rarity },
    });

    return NextResponse.json({ ok: true, item: created });
  } catch (error) {
    console.error("Admin achievements POST error:", error);
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
      id?: number;
      title?: string;
      description?: string;
      reward?: number;
      rarity?: string;
      category?: string;
      icon?: string;
      isActive?: boolean;
    };

    if (!body.id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const existing = await prisma.achievement.findUnique({ where: { id: body.id } });
    if (!existing) {
      return NextResponse.json({ error: "Achievement not found" }, { status: 404 });
    }

    const updated = await prisma.achievement.update({
      where: { id: existing.id },
      data: {
        title: body.title?.trim() ?? existing.title,
        description: body.description?.trim() ?? existing.description,
        reward: body.reward !== undefined ? Math.max(0, Math.floor(Number(body.reward))) : existing.reward,
        rarity: body.rarity?.trim() ?? existing.rarity,
        category: body.category?.trim() ?? existing.category,
        icon: body.icon?.trim() ?? existing.icon,
        isActive: body.isActive ?? existing.isActive,
      },
    });

    await writeAdminAuditLog(request, prisma, {
      action: "achievement_update",
      targetType: "Achievement",
      targetId: updated.id,
      summary: `Updated achievement #${updated.id}`,
      details: {
        isActive: { from: existing.isActive, to: updated.isActive },
        title: { from: existing.title, to: updated.title },
      },
    });

    return NextResponse.json({ ok: true, item: updated });
  } catch (error) {
    console.error("Admin achievements PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
