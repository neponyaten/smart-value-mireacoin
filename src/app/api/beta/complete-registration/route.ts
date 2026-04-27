import { prisma } from "@/lib/prisma";
import { BETA_INVITE_TOKEN_EXPIRY_DAYS } from "@/lib/auth/beta-utils";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = String(body?.token ?? "").trim();
    const password = String(body?.password ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const passwordConfirm =
      typeof body?.passwordConfirm === "string" ? body.passwordConfirm.trim() : undefined;

    if (!token || !password || !email) {
      return NextResponse.json(
        { error: "Token, password, and email are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    if (passwordConfirm !== undefined && password !== passwordConfirm) {
      return NextResponse.json(
        { error: "Password confirmation mismatch" },
        { status: 400 }
      );
    }

    const application = await prisma.betaApplication.findUnique({
      where: { inviteToken: token },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Invalid or expired invite link" },
        { status: 400 }
      );
    }

    if (application.email !== email) {
      return NextResponse.json(
        { error: "Email doesn't match the invitation" },
        { status: 400 }
      );
    }

    if (application.status !== "invited") {
      return NextResponse.json(
        { error: "This invitation is no longer valid" },
        { status: 400 }
      );
    }

    const inviteSentDate = application.inviteSentAt || new Date();
    const expiryDate = new Date(inviteSentDate);
    expiryDate.setDate(expiryDate.getDate() + BETA_INVITE_TOKEN_EXPIRY_DAYS);

    if (new Date() > expiryDate) {
      return NextResponse.json(
        { error: "Invite link has expired" },
        { status: 400 }
      );
    }
    const passwordHash = await hash(password, 12);

    const result = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { email: application.email },
      });
      if (existingUser) {
        throw new Error("ACCOUNT_ALREADY_EXISTS");
      }

      const user = await tx.user.create({
        data: {
          email: application.email,
          fullName: application.fullName,
          displayName: application.fullName.split(" ")[0] || application.fullName,
          group: application.academicGroup,
          role: application.requestedRole === "Студент" ? "Студент" : "Преподаватель",
          passwordHash,
          userType: "user",
        },
      });

      const consumeToken = await tx.betaApplication.updateMany({
        where: {
          id: application.id,
          status: "invited",
          inviteToken: token,
          userId: null,
        },
        data: {
          status: "completed",
          userId: user.id,
          inviteToken: null,
          inviteSentAt: null,
          updatedAt: new Date(),
        },
      });

      if (consumeToken.count !== 1) {
        throw new Error("TOKEN_ALREADY_USED");
      }

      await tx.adminAuditLog.create({
        data: {
          userId: application.decidedByUserId ?? user.id,
          action: "create_user_from_beta_application",
          targetId: application.id,
          targetType: "BetaApplication",
          changes: JSON.stringify({ createdUserId: user.id }),
        },
      });

      return user;
    });

    return NextResponse.json({
      success: true,
      user: {
        id: result.id,
        email: result.email,
        fullName: result.fullName,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "ACCOUNT_ALREADY_EXISTS") {
      return NextResponse.json(
        { error: "Account with this email already exists" },
        { status: 409 }
      );
    }

    if (error instanceof Error && error.message === "TOKEN_ALREADY_USED") {
      return NextResponse.json(
        { error: "Invite token is already used or no longer valid" },
        { status: 409 }
      );
    }

    console.error("Complete registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
