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
    const achievementId = typeof body?.achievementId === "string" ? body.achievementId : "";

    if (!achievementId) {
      return NextResponse.json({ message: "Не указан achievementId" }, { status: 400 });
    }

    const result = mockRepository.unlockAchievement(user.id, achievementId);
    if ("error" in result) {
      return NextResponse.json({ message: result.error }, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Не удалось выдать достижение" }, { status: 500 });
  }
}
