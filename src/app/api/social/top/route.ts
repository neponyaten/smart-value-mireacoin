import { mockRepository } from "@/lib/mock/repository";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = mockRepository.getTopUsers(10);
    return NextResponse.json({ users }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Не удалось загрузить Top 10" }, { status: 500 });
  }
}
