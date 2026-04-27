-- CreateTable
CREATE TABLE "VfxCatalogItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "targetSlot" TEXT NOT NULL,
    "preview" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "UserVfxGrant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "vfxItemId" INTEGER NOT NULL,
    "grantedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserVfxGrant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserVfxGrant_vfxItemId_fkey" FOREIGN KEY ("vfxItemId") REFERENCES "VfxCatalogItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SystemNotificationBatch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sentByUserId" INTEGER NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetValue" TEXT,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "recipientsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SystemNotificationBatch_sentByUserId_fkey" FOREIGN KEY ("sentByUserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Achievement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "reward" INTEGER NOT NULL DEFAULT 0,
    "rarity" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Achievement" ("category", "createdAt", "description", "icon", "id", "rarity", "reward", "title") SELECT "category", "createdAt", "description", "icon", "id", "rarity", "reward", "title" FROM "Achievement";
DROP TABLE "Achievement";
ALTER TABLE "new_Achievement" RENAME TO "Achievement";
CREATE INDEX "Achievement_category_rarity_idx" ON "Achievement"("category", "rarity");
CREATE TABLE "new_ContentReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reporterUserId" INTEGER NOT NULL,
    "targetUserId" INTEGER,
    "targetStatusId" INTEGER,
    "targetType" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewedByUserId" INTEGER,
    "reviewedAt" DATETIME,
    "reviewComment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContentReport_reporterUserId_fkey" FOREIGN KEY ("reporterUserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ContentReport_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ContentReport_targetStatusId_fkey" FOREIGN KEY ("targetStatusId") REFERENCES "UserStatus" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ContentReport_reviewedByUserId_fkey" FOREIGN KEY ("reviewedByUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ContentReport" ("createdAt", "id", "reason", "reporterUserId", "targetStatusId", "targetType", "targetUserId") SELECT "createdAt", "id", "reason", "reporterUserId", "targetStatusId", "targetType", "targetUserId" FROM "ContentReport";
DROP TABLE "ContentReport";
ALTER TABLE "new_ContentReport" RENAME TO "ContentReport";
CREATE INDEX "ContentReport_targetType_targetUserId_targetStatusId_idx" ON "ContentReport"("targetType", "targetUserId", "targetStatusId");
CREATE INDEX "ContentReport_reporterUserId_createdAt_idx" ON "ContentReport"("reporterUserId", "createdAt");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "fullName" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'Студент',
    "userType" TEXT NOT NULL DEFAULT 'user',
    "passwordHash" TEXT NOT NULL,
    "coins" INTEGER NOT NULL DEFAULT 0,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "blockedAt" DATETIME,
    "blockedReason" TEXT,
    "lastSeenAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("coins", "createdAt", "displayName", "email", "firstName", "fullName", "group", "id", "lastName", "lastSeenAt", "passwordHash", "role", "updatedAt", "userType") SELECT "coins", "createdAt", "displayName", "email", "firstName", "fullName", "group", "id", "lastName", "lastSeenAt", "passwordHash", "role", "updatedAt", "userType" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "VfxCatalogItem_code_key" ON "VfxCatalogItem"("code");

-- CreateIndex
CREATE INDEX "VfxCatalogItem_isActive_rarity_idx" ON "VfxCatalogItem"("isActive", "rarity");

-- CreateIndex
CREATE INDEX "UserVfxGrant_userId_grantedAt_idx" ON "UserVfxGrant"("userId", "grantedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserVfxGrant_userId_vfxItemId_key" ON "UserVfxGrant"("userId", "vfxItemId");

-- CreateIndex
CREATE INDEX "SystemNotificationBatch_createdAt_idx" ON "SystemNotificationBatch"("createdAt");

-- CreateIndex
CREATE INDEX "SystemNotificationBatch_targetType_createdAt_idx" ON "SystemNotificationBatch"("targetType", "createdAt");
