import { getCurrentUserFromRequest } from "@/lib/api/auth-user";
import { mockRepository } from "@/lib/mock/repository";
import type { ReportReason } from "@/lib/types/domain";
import { NextRequest, NextResponse } from "next/server";

const REASONS: ReportReason[] = ["spam", "abuse", "inappropriate", "other"];

export async function POST(request: NextRequest) {
  try {
    const user = getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ message: "Сессия не найдена" }, { status: 401 });
    }

    const body = await request.json();
    const targetStatusId = typeof body?.targetStatusId === "string" ? body.targetStatusId : "";
    const reason = typeof body?.reason === "string" ? body.reason : "";

    if (!targetStatusId) {
      return NextResponse.json({ message: "Не выбран статус" }, { status: 400 });
    }
    if (!REASONS.includes(reason as ReportReason)) {
      return NextResponse.json({ message: "Некорректная причина жалобы" }, { status: 400 });
    }

    const result = mockRepository.createReport({
      reporterUserId: user.id,
      targetType: "status",
      targetStatusId,
      reason: reason as ReportReason,
    });

    if ("error" in result) {
      return NextResponse.json({ message: result.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Не удалось отправить жалобу" }, { status: 500 });
  }
}
