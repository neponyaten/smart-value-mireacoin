import { getSessionId } from "@/lib/api/session";
import { mockRepository } from "@/lib/mock/repository";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const sessionId = getSessionId(request);
  if (!sessionId) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const user = mockRepository.getUserBySession(sessionId);
  return NextResponse.json({ user }, { status: 200 });
}
