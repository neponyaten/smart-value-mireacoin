import { mockRepository } from "@/lib/mock/repository";
import { NextResponse } from "next/server";

export async function GET() {
  const items = mockRepository.getMarketItems();
  return NextResponse.json({ items }, { status: 200 });
}
