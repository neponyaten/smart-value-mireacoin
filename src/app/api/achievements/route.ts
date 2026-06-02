import { getCurrentUserFromRequest } from "@/lib/api/auth-user";
import { mockRepository } from "@/lib/mock/repository";
import { NextRequest, NextResponse } from "next/server";

function normalizeText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, maxLength);
}

export async function GET(request: NextRequest) {
  try {
    const user = getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ message: "Сессия не найдена" }, { status: 401 });
    }

    const { items, progress } = mockRepository.getUserAchievements(user.id);
    return NextResponse.json({ items, progress }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Не удалось загрузить достижения" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ message: "Сессия не найдена" }, { status: 401 });
    }

    if (user.role !== "LEADER") {
      return NextResponse.json({ message: "Недостаточно прав" }, { status: 403 });
    }

    const body = await request.json();
    const title = normalizeText(body?.title, 70);
    const description = normalizeText(body?.description, 240);
    const icon = normalizeText(body?.icon, 8);
    const reward = Number(body?.reward);

    if (!title || !description || !Number.isFinite(reward) || reward < 0) {
      return NextResponse.json({ message: "Некорректные параметры достижения" }, { status: 400 });
    }

    const achievement = mockRepository.createAchievement({
      title,
      description,
      reward,
      icon,
      rarity: typeof body?.rarity === "string" ? body.rarity : "common",
      category: typeof body?.category === "string" ? body.category : "activity",
    });

    return NextResponse.json({ achievement }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Не удалось создать достижение" }, { status: 500 });
  }
}
