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
    const marketItemId = String(body?.marketItemId ?? "").trim();
    if (!marketItemId) {
      return NextResponse.json({ message: "marketItemId обязателен" }, { status: 400 });
    }

    const result = mockRepository.purchaseItem(user.id, marketItemId);
    if ("error" in result) {
      return NextResponse.json({ message: result.error }, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Покупка не выполнена" }, { status: 500 });
  }
}
