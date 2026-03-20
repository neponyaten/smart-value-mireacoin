import { mockRepository } from "@/lib/mock/repository";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const limitRaw = request.nextUrl.searchParams.get("limit") || "20";
    const parsed = Number(limitRaw);
    const limit = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 1), 50) : 20;
    const items = mockRepository.getStatusFeed(limit);
    return NextResponse.json({ items }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Не удалось загрузить ленту" }, { status: 500 });
  }
}
