import { getCurrentUserFromRequest } from "@/lib/api/auth-user";
import { mockRepository } from "@/lib/mock/repository";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: Params) {
  try {
    const viewer = getCurrentUserFromRequest(request);
    if (!viewer) {
      return NextResponse.json({ message: "Сессия не найдена" }, { status: 401 });
    }

    const { id } = await context.params;
    if (!id?.trim()) {
      return NextResponse.json({ message: "Некорректный id пользователя" }, { status: 400 });
    }

    const target = mockRepository.getUserById(id.trim());
    if (!target) {
      return NextResponse.json({ message: "Профиль не найден" }, { status: 404 });
    }

    const result = mockRepository.registerProfileView({
      profileOwnerId: target.id,
      viewerUserId: viewer.id,
    });

    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Не удалось зарегистрировать просмотр" }, { status: 500 });
  }
}
