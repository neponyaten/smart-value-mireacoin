import { prisma } from "@/lib/prisma";

export type EmailTemplate =
  | "application_received"
  | "application_approved"
  | "application_rejected"
  | "complete_registration_invite";

interface EmailData {
  to: string;
  subject: string;
  template: EmailTemplate;
  data: Record<string, any>;
}

type EmailProvider = "stub" | "resend" | "sendgrid";

function resolveProvider(): EmailProvider {
  const value = (process.env.EMAIL_PROVIDER ?? "stub").toLowerCase();
  if (value === "resend") {
    return "resend";
  }
  if (value === "sendgrid") {
    return "sendgrid";
  }
  return "stub";
}

class EmailService {
  async send(params: EmailData): Promise<boolean> {
    const html = this.renderTemplate(params.template, params.data);
    const provider = resolveProvider();

    try {
      if (provider === "resend") {
        await this.sendViaResend(params.to, params.subject, html);
      } else if (provider === "sendgrid") {
        await this.sendViaSendGrid(params.to, params.subject, html);
      } else {
        // Stub mode for local/dev environments without provider credentials.
        console.info(`[email:stub] to=${params.to} template=${params.template}`);
      }

      // Логируем в БД
      await prisma.emailLog.create({
        data: {
          to: params.to,
          subject: params.subject,
          type: params.template,
          status: provider === "stub" ? "failed" : "sent",
          error:
            provider === "stub"
              ? "EMAIL_PROVIDER is not configured. Use resend/sendgrid in env."
              : null,
        },
      });

      return provider !== "stub";
    } catch (error) {
      console.error("Email send error:", error);
      await prisma.emailLog.create({
        data: {
          to: params.to,
          subject: params.subject,
          type: params.template,
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      });
      return false;
    }
  }

  private async sendViaResend(to: string, subject: string, html: string) {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;

    if (!apiKey || !from) {
      throw new Error("Resend provider is not configured (RESEND_API_KEY, EMAIL_FROM)");
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`Resend error: ${response.status} ${responseText.slice(0, 500)}`);
    }
  }

  private async sendViaSendGrid(to: string, subject: string, html: string) {
    const apiKey = process.env.SENDGRID_API_KEY;
    const from = process.env.EMAIL_FROM;

    if (!apiKey || !from) {
      throw new Error("SendGrid provider is not configured (SENDGRID_API_KEY, EMAIL_FROM)");
    }

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: from },
        subject,
        content: [{ type: "text/html", value: html }],
      }),
    });

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`SendGrid error: ${response.status} ${responseText.slice(0, 500)}`);
    }
  }

  private renderTemplate(template: EmailTemplate, data: Record<string, any>): string {
    switch (template) {
      case "application_received":
        return this.applicationReceivedTemplate(data);
      case "application_approved":
        return this.applicationApprovedTemplate(data);
      case "application_rejected":
        return this.applicationRejectedTemplate(data);
      case "complete_registration_invite":
        return this.completeRegistrationTemplate(data);
      default:
        return "";
    }
  }

  private applicationReceivedTemplate(data: Record<string, any>): string {
    return `
      <h2>Заявка получена</h2>
      <p>Привет, ${data.fullName}!</p>
      <p>Спасибо за интерес к MireaCoin. Ваша заявка на участие в бета-тестировании получена.</p>
      <p>Мы проверим её в ближайшее время и свяжемся с вами по почте.</p>
      <p>С уважением,<br/>Команда MireaCoin</p>
    `;
  }

  private applicationApprovedTemplate(data: Record<string, any>): string {
    return `
      <h2>Поздравляем! Вы одобрены в бета-тест MireaCoin</h2>
      <p>Привет, ${data.fullName}!</p>
      <p>Отличная новость — ваша заявка одобрена!</p>
      <p><a href="${data.inviteLink}" style="background: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
        Завершить регистрацию
      </a></p>
      <p>По ссылке выше вы сможете завершить регистрацию и начать использовать MireaCoin.</p>
      <p>С уважением,<br/>Команда MireaCoin</p>
    `;
  }

  private applicationRejectedTemplate(data: Record<string, any>): string {
    return `
      <h2>Решение по вашей заявке</h2>
      <p>Привет, ${data.fullName}!</p>
      <p>К сожалению, в этот раз мы не можем одобрить вашу заявку на участие в бета-тесте.</p>
      ${data.reason ? `<p>Причина: ${data.reason}</p>` : ""}
      <p>Спасибо за интерес! Попробуйте подать заявку позже или свяжитесь с нами.</p>
      <p>С уважением,<br/>Команда MireaCoin</p>
    `;
  }

  private completeRegistrationTemplate(data: Record<string, any>): string {
    return `
      <h2>Завершите регистрацию в MireaCoin</h2>
      <p>Привет, ${data.fullName}!</p>
      <p>Кликните по ссылке ниже, чтобы завершить регистрацию:</p>
      <p><a href="${data.inviteLink}" style="background: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
        Завершить регистрацию
      </a></p>
      <p>С уважением,<br/>Команда MireaCoin</p>
    `;
  }
}

export const emailService = new EmailService();
