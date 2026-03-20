import { getSessionId } from "@/lib/api/session";
import { mockRepository } from "@/lib/mock/repository";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const sessionId = getSessionId(request);
  if (!sessionId) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const user = mockRepository.getUserBySession(sessionId);
  return NextResponse.json({ user }, { status: 200 });
}

export async function PATCH(request: NextRequest) {
  try {
    const sessionId = getSessionId(request);
    if (!sessionId) {
      return NextResponse.json({ message: "Сессия не найдена" }, { status: 401 });
    }

    const user = mockRepository.getUserBySession(sessionId);
    if (!user) {
      return NextResponse.json({ message: "Сессия истекла" }, { status: 401 });
    }

    const body = await request.json();
    const hideInventory = Boolean(body?.hideInventory);
    const updated = mockRepository.setHideInventory(user.id, hideInventory);
    if (!updated) {
      return NextResponse.json({ message: "Пользователь не найден" }, { status: 404 });
    }

    return NextResponse.json({ user: updated }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Не удалось обновить профиль" }, { status: 500 });
  }
}