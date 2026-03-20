import { getCurrentUserFromRequest } from "@/lib/api/auth-user";
import { mockRepository } from "@/lib/mock/repository";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const user = getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ message: "Сессия не найдена" }, { status: 401 });
    }

    const body = await request.json();
    const text = typeof body?.text === "string" ? body.text.slice(0, 200) : "";
    const result = mockRepository.createOrUpdateStatus(user.id, text);

    if ("error" in result) {
      return NextResponse.json(
        { message: result.error, cooldownRemainingMs: result.cooldownRemainingMs },
        { status: 400 }
      );
    }

    if (!result.status) {
      return NextResponse.json({ message: "Не удалось сохранить статус" }, { status: 500 });
    }

    return NextResponse.json({ item: result.status }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Ошибка обновления статуса" }, { status: 500 });
  }
}
