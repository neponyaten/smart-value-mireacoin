import { prisma } from "@/lib/prisma";
import { emailService } from "@/lib/email/service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { fullName, email, academicGroup, requestedRole, whyJoinBeta, telegramUrl, vkUrl, consent } =
      body;

    // Валидация
    if (!fullName?.trim() || !email?.trim() || !academicGroup?.trim() || !requestedRole?.trim()) {
      return NextResponse.json(
        { error: "Все обязательные поля должны быть заполнены" },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        { error: "Необходимо согласиться с условиями" },
        { status: 400 }
      );
    }

    // Проверяем, не было ли уже заявки с этим email
    const existing = await prisma.betaApplication.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Заявка с этим email уже существует" },
        { status: 400 }
      );
    }

    // Создаём заявку
    const application = await prisma.betaApplication.create({
      data: {
        email,
        fullName,
        academicGroup,
        requestedRole,
        whyJoin: whyJoinBeta || "",
        telegramUrl: telegramUrl || null,
        vkUrl: vkUrl || null,
        status: "pending",
      },
    });

    // Отправляем email подтверждения
    await emailService.send({
      to: email,
      subject: "Заявка на бета-тест MireaCoin получена",
      template: "application_received",
      data: { fullName, email },
    });

    return NextResponse.json({
      success: true,
      message: "Спасибо! Ваша заявка получена. Ответ придет на почту.",
      applicationId: application.id,
    });
  } catch (error) {
    console.error("Beta application error:", error);
    return NextResponse.json({ error: "Ошибка при отправке заявки" }, { status: 500 });
  }
}
