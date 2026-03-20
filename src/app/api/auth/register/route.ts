import { AUTH_SESSION_TTL_MS } from "@/lib/constants/auth";
import { mockRepository } from "@/lib/mock/repository";
import { setSessionCookie } from "@/lib/api/session";
import type { AuthProviderMode } from "@/lib/types/domain";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = {
      email: String(body?.email ?? "").trim().toLowerCase(),
      password: String(body?.password ?? "").trim(),
      fullName: String(body?.fullName ?? "").trim(),
      group: String(body?.group ?? "").trim(),
      studentId: String(body?.studentId ?? "").trim().toUpperCase(),
      providerMode: String(body?.providerMode ?? "LKS") as AuthProviderMode,
    };

    if (!payload.email || !payload.password || !payload.fullName || !payload.group || !payload.studentId) {
      return NextResponse.json({ message: "Заполните все поля" }, { status: 400 });
    }

    if (payload.password.length < 6) {
      return NextResponse.json({ message: "Пароль должен быть не короче 6 символов" }, { status: 400 });
    }

    if (!["LKS", "ATTENDANCE"].includes(payload.providerMode)) {
      return NextResponse.json({ message: "Некорректный provider mode" }, { status: 400 });
    }

    const result = mockRepository.register(payload);
    if ("error" in result) {
      return NextResponse.json({ message: result.error }, { status: 409 });
    }

    const session = mockRepository.createSession(
      result.user.id,
      result.user.providerMode,
      AUTH_SESSION_TTL_MS
    );

    const response = NextResponse.json({ user: result.user }, { status: 201 });
    setSessionCookie(response, session.id);

    return response;
  } catch {
    return NextResponse.json({ message: "Ошибка регистрации" }, { status: 500 });
  }
}