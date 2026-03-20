import { getSessionId } from "@/lib/api/session";
import { mockRepository } from "@/lib/mock/repository";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const sessionId = getSessionId(request);
  if (!sessionId) {
    return NextResponse.json({ items: [] }, { status: 200 });
  }

  const user = mockRepository.getUserBySession(sessionId);
  if (!user) {
    return NextResponse.json({ items: [] }, { status: 200 });
  }

  const items = mockRepository.getLedger(user.id);
  return NextResponse.json({ items }, { status: 200 });
}
