import { getCurrentUserFromRequest } from "@/lib/api/auth-user";
import { mockRepository } from "@/lib/mock/repository";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const user = getCurrentUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ message: "Сессия не найдена" }, { status: 401 });
  }

  const touched = mockRepository.touchLastSeen(user.id);
  if (!touched) {
    return NextResponse.json({ message: "Пользователь не найден" }, { status: 404 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
