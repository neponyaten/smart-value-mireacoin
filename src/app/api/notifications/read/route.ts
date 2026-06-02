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
    const notificationId = typeof body?.notificationId === "string" ? body.notificationId : "";

    if (notificationId) {
      const updated = mockRepository.markNotificationRead(user.id, notificationId);
      if (!updated) {
        return NextResponse.json({ message: "Уведомление не найдено" }, { status: 404 });
      }
      return NextResponse.json({ item: updated }, { status: 200 });
    }

    const result = mockRepository.markAllNotificationsRead(user.id);
    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Не удалось обновить уведомления" }, { status: 500 });
  }
}
