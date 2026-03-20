import { getSessionId } from "@/lib/api/session";
import { mockRepository } from "@/lib/mock/repository";
import type { NextRequest } from "next/server";

export function getCurrentUserFromRequest(request: NextRequest) {
  const sessionId = getSessionId(request);
  if (!sessionId) {
    return null;
  }

  return mockRepository.getUserBySession(sessionId);
}
