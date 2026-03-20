import { getSessionId } from "@/lib/api/session";
import { mockRepository } from "@/lib/mock/repository";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const sessionId = getSessionId(request);
    if (!sessionId) {
      return NextResponse.json({ message: "Сессия не найдена" }, { status: 401 });
    }

    const user = mockRepository.getUserBySession(sessionId);
    if (!user) {
      return NextResponse.json({ message: "Сессия недействительна" }, { status: 401 });
    }

    const result = mockRepository.attendanceReward(user.id);
    if (!result) {
      return NextResponse.json({ message: "Пользователь не найден" }, { status: 404 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Ошибка синхронизации" }, { status: 500 });
  }
}