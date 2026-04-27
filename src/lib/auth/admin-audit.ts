import { getCurrentUserFromRequest } from "@/lib/api/auth-user";
import { resolveActorUserId } from "@/lib/auth/admin-guard";
import type { PrismaClient } from "@prisma/client";
import type { NextRequest } from "next/server";

type AuditWriter = Pick<PrismaClient, "adminAuditLog">;

type AuditPayload = {
  action: string;
  targetType?: string;
  targetId?: number | null;
  targetUserId?: number | null;
  summary?: string;
  details?: unknown;
};

export async function writeAdminAuditLog(
  request: NextRequest,
  db: AuditWriter,
  payload: AuditPayload
) {
  const actorUserId = await resolveActorUserId(request);
  if (!actorUserId) {
    return;
  }

  const currentUser = getCurrentUserFromRequest(request) as { role?: string; userType?: string } | null;
  const actorRole = currentUser?.userType || currentUser?.role || null;

  await db.adminAuditLog.create({
    data: {
      userId: actorUserId,
      actorRole,
      action: payload.action,
      targetType: payload.targetType ?? null,
      targetId: payload.targetId ?? null,
      targetUserId: payload.targetUserId ?? null,
      summary: payload.summary ?? null,
      details: payload.details ? JSON.stringify(payload.details) : null,
      changes: payload.details ? JSON.stringify(payload.details) : null,
    },
  });
}
