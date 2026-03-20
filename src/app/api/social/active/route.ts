import { mockRepository } from "@/lib/mock/repository";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = mockRepository.getActiveUsers(12);
    return NextResponse.json({ users }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Не удалось загрузить активных пользователей" }, { status: 500 });
  }
}
