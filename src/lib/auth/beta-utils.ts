import crypto from "crypto";

export function generateInviteToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function validateAdminAccess(userType?: string): boolean {
  return userType === "admin" || userType === "superadmin";
}

export function validateModeratorAccess(userType?: string): boolean {
  return (
    userType === "admin" ||
    userType === "superadmin" ||
    userType === "moderator"
  );
}

export const BETA_INVITE_TOKEN_EXPIRY_DAYS = 7;
