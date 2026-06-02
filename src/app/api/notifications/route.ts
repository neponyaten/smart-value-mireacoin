import { getCurrentUserFromRequest } from "@/lib/api/auth-user";
import { mockRepository } from "@/lib/mock/repository";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ message: "Сессия не найдена" }, { status: 401 });
    }

    const limitRaw = request.nextUrl.searchParams.get("limit") || "30";
    const parsed = Number(limitRaw);
    const limit = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 1), 100) : 30;

    const { items, unreadCount } = mockRepository.getNotifications(user.id, limit);
    return NextResponse.json({ items, unreadCount }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Не удалось загрузить уведомления" }, { status: 500 });
  }
}
