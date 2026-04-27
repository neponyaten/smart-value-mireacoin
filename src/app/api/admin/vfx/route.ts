import { writeAdminAuditLog } from "@/lib/auth/admin-audit";
import { isAdminRequest, resolveActorUserId } from "@/lib/auth/admin-guard";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const items = await prisma.vfxCatalogItem.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Admin VFX GET error:", error);
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
      name?: string;
      code?: string;
      rarity?: string;
      price?: number;
      targetSlot?: string;
      preview?: string;
      isActive?: boolean;
    };

    const name = body.name?.trim() ?? "";
    const code = body.code?.trim().toLowerCase() ?? "";

    if (!name || !code) {
      return NextResponse.json({ error: "name and code are required" }, { status: 400 });
    }

    const created = await prisma.vfxCatalogItem.create({
      data: {
        name,
        code,
        rarity: body.rarity?.trim() || "common",
        price: Math.max(0, Math.floor(Number(body.price ?? 0))),
        targetSlot: body.targetSlot?.trim() || "NICKNAME",
        preview: body.preview?.trim() || null,
        isActive: body.isActive ?? true,
      },
    });

    await writeAdminAuditLog(request, prisma, {
      action: "vfx_create",
      targetType: "VfxCatalogItem",
      targetId: created.id,
      summary: `Created VFX #${created.id}`,
      details: { name: created.name, code: created.code, isActive: created.isActive },
    });

    return NextResponse.json({ ok: true, item: created });
  } catch (error) {
    console.error("Admin VFX POST error:", error);
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
      name?: string;
      code?: string;
      rarity?: string;
      price?: number;
      targetSlot?: string;
      preview?: string;
      isActive?: boolean;
    };

    if (!body.id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const existing = await prisma.vfxCatalogItem.findUnique({ where: { id: body.id } });
    if (!existing) {
      return NextResponse.json({ error: "VFX item not found" }, { status: 404 });
    }

    const updated = await prisma.vfxCatalogItem.update({
      where: { id: existing.id },
      data: {
        name: body.name?.trim() ?? existing.name,
        code: body.code?.trim().toLowerCase() ?? existing.code,
        rarity: body.rarity?.trim() ?? existing.rarity,
        price: body.price !== undefined ? Math.max(0, Math.floor(Number(body.price))) : existing.price,
        targetSlot: body.targetSlot?.trim() ?? existing.targetSlot,
        preview: body.preview?.trim() || null,
        isActive: body.isActive ?? existing.isActive,
      },
    });

    await writeAdminAuditLog(request, prisma, {
      action: "vfx_update",
      targetType: "VfxCatalogItem",
      targetId: updated.id,
      summary: `Updated VFX #${updated.id}`,
      details: {
        isActive: { from: existing.isActive, to: updated.isActive },
        name: { from: existing.name, to: updated.name },
      },
    });

    return NextResponse.json({ ok: true, item: updated });
  } catch (error) {
    console.error("Admin VFX PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
