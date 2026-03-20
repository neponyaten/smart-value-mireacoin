import { clearSessionCookie, getSessionId } from "@/lib/api/session";
import { mockRepository } from "@/lib/mock/repository";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const sessionId = getSessionId(request);
  if (sessionId) {
    mockRepository.destroySession(sessionId);
  }

  const response = NextResponse.json({ ok: true }, { status: 200 });
  clearSessionCookie(response);
  return response;
}
