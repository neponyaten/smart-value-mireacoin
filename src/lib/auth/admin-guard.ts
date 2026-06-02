import { getCurrentUserFromRequest } from "@/lib/api/auth-user";
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

const elevatedUserTypes = new Set(["moderator", "admin", "superadmin"]);

export function isAdminRequest(request: NextRequest): boolean {
  const currentUser = getCurrentUserFromRequest(request);
  if (!currentUser) {
    return false;
  }

  // Legacy fallback: LEADER users can access moderation routes in old sessions.
  if (currentUser.role === "LEADER") {
    return true;
  }

  return elevatedUserTypes.has((currentUser as { userType?: string }).userType ?? "");
}

export function getActorUserId(request: NextRequest): number | null {
  const currentUser = getCurrentUserFromRequest(request);
  if (!currentUser) {
    return null;
  }

  const numericId = Number(currentUser.id);
  return Number.isFinite(numericId) ? numericId : null;
}

export async function resolveActorUserId(request: NextRequest): Promise<number | null> {
  const currentUser = getCurrentUserFromRequest(request);
  if (!currentUser) {
    return null;
  }

  const numericId = Number(currentUser.id);
  if (Number.isFinite(numericId)) {
    return numericId;
  }

  const byEmail = await prisma.user.findUnique({
    where: { email: currentUser.email },
    select: { id: true },
  });
  if (byEmail) {
    return byEmail.id;
  }

  const fallbackAdmin = await prisma.user.findFirst({
    where: {
      userType: { in: ["admin", "superadmin", "moderator"] },
    },
    orderBy: { id: "asc" },
    select: { id: true },
  });
  if (fallbackAdmin) {
    return fallbackAdmin.id;
  }

  const fallbackAnyUser = await prisma.user.findFirst({
    orderBy: { id: "asc" },
    select: { id: true },
  });

  return fallbackAnyUser?.id ?? null;
}
