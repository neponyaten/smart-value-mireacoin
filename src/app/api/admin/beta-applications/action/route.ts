import { prisma } from "@/lib/prisma";
import { emailService } from "@/lib/email/service";
import { generateInviteToken } from "@/lib/auth/beta-utils";
import { writeAdminAuditLog } from "@/lib/auth/admin-audit";
import { isAdminRequest, resolveActorUserId } from "@/lib/auth/admin-guard";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const actorUserId = await resolveActorUserId(request);
    if (!actorUserId) {
      return NextResponse.json({ error: "Actor user not found" }, { status: 401 });
    }

    const body = await request.json();
    const { applicationId, action, comment } = body;

    if (!applicationId || !["approve", "reject", "resend"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const application = await prisma.betaApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    let updatedApplication;

    if (action === "approve") {
      const inviteToken = generateInviteToken();
      updatedApplication = await prisma.betaApplication.update({
        where: { id: applicationId },
        data: {
          status: "invited",
          inviteToken,
          inviteSentAt: new Date(),
          decidedAt: new Date(),
          decidedByUserId: actorUserId,
          adminComment: comment || null,
        },
      });

      const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/complete-registration?token=${inviteToken}`;

      await emailService.send({
        to: application.email,
        subject: "Поздравляем! Вы одобрены в бета-тест MireaCoin",
        template: "application_approved",
        data: {
          fullName: application.fullName,
          inviteLink,
        },
      });

      await writeAdminAuditLog(request, prisma, {
        action: "approve_beta_application",
        targetType: "BetaApplication",
        targetId: applicationId,
        summary: `Approved beta application #${applicationId}`,
        details: { from: "pending", to: "invited", email: application.email },
      });
    } else if (action === "reject") {
      updatedApplication = await prisma.betaApplication.update({
        where: { id: applicationId },
        data: {
          status: "rejected",
          decidedAt: new Date(),
          decidedByUserId: actorUserId,
          adminComment: comment || null,
        },
      });

      await emailService.send({
        to: application.email,
        subject: "Результат рассмотрения вашей заявки",
        template: "application_rejected",
        data: {
          fullName: application.fullName,
          reason: comment,
        },
      });

      await writeAdminAuditLog(request, prisma, {
        action: "reject_beta_application",
        targetType: "BetaApplication",
        targetId: applicationId,
        summary: `Rejected beta application #${applicationId}`,
        details: { email: application.email, comment: comment ?? null },
      });
    } else if (action === "resend") {
      if (!application.inviteToken) {
        return NextResponse.json(
          { error: "No invite token found. Approve first." },
          { status: 400 }
        );
      }

      const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/complete-registration?token=${application.inviteToken}`;

      await emailService.send({
        to: application.email,
        subject: "Ссылка для завершения регистрации MireaCoin",
        template: "complete_registration_invite",
        data: {
          fullName: application.fullName,
          inviteLink,
        },
      });

      updatedApplication = await prisma.betaApplication.update({
        where: { id: applicationId },
        data: { inviteSentAt: new Date() },
      });

      await writeAdminAuditLog(request, prisma, {
        action: "resend_invite_beta_application",
        targetType: "BetaApplication",
        targetId: applicationId,
        summary: `Resent invite for application #${applicationId}`,
        details: { email: application.email },
      });
    }

    return NextResponse.json({
      success: true,
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Beta application action error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

