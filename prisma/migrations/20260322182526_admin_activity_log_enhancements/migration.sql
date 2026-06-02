-- AlterTable
ALTER TABLE "AdminAuditLog" ADD COLUMN "actorRole" TEXT;
ALTER TABLE "AdminAuditLog" ADD COLUMN "details" TEXT;
ALTER TABLE "AdminAuditLog" ADD COLUMN "summary" TEXT;
ALTER TABLE "AdminAuditLog" ADD COLUMN "targetUserId" INTEGER;

-- CreateIndex
CREATE INDEX "AdminAuditLog_actorRole_createdAt_idx" ON "AdminAuditLog"("actorRole", "createdAt");

-- CreateIndex
CREATE INDEX "AdminAuditLog_targetUserId_createdAt_idx" ON "AdminAuditLog"("targetUserId", "createdAt");
