import { mockRepository } from "@/lib/mock/repository";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: Params) {
  try {
    const { id } = await context.params;
    if (!id?.trim()) {
      return NextResponse.json({ message: "Некорректный id пользователя" }, { status: 400 });
    }

    const profile = mockRepository.getPublicProfileById(id.trim());
    if (!profile) {
      return NextResponse.json({ message: "Пользователь не найден" }, { status: 404 });
    }

    return NextResponse.json({ profile }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Не удалось загрузить публичный профиль" }, { status: 500 });
  }
}
