import { AUTH_SESSION_COOKIE, AUTH_SESSION_TTL_MS } from "@/lib/constants/auth";
import type { NextRequest, NextResponse } from "next/server";

export function getSessionId(request: NextRequest) {
  return request.cookies.get(AUTH_SESSION_COOKIE)?.value ?? null;
}

export function setSessionCookie(response: NextResponse, sessionId: string) {
  response.cookies.set({
    name: AUTH_SESSION_COOKIE,
    value: sessionId,
    maxAge: Math.floor(AUTH_SESSION_TTL_MS / 1000),
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: AUTH_SESSION_COOKIE,
    value: "",
    maxAge: 0,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
