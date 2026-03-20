import { mockRepository } from "@/lib/mock/repository";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = mockRepository.getLeaderboard();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Не удалось загрузить лидерборд" }, { status: 500 });
  }
}