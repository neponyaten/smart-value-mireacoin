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

    const body = await request.json();
    const coinId = typeof body?.coinId === "string" ? body.coinId : undefined;
    const vfxId = typeof body?.vfxId === "string" ? body.vfxId : undefined;

    const updated = mockRepository.setActiveInventory(user.id, { coinId, vfxId });
    if (!updated) {
      return NextResponse.json({ message: "Пользователь не найден" }, { status: 404 });
    }

    return NextResponse.json({ user: updated }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Не удалось обновить инвентарь" }, { status: 500 });
  }
}
