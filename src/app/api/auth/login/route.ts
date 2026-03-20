import { AUTH_SESSION_TTL_MS } from "@/lib/constants/auth";
import { mockRepository } from "@/lib/mock/repository";
import { setSessionCookie } from "@/lib/api/session";
import type { AuthProviderMode } from "@/lib/types/domain";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const login = String(body?.login ?? body?.email ?? "").trim();
    const password = String(body?.password ?? "").trim();
    const providerMode = String(body?.providerMode ?? "LKS") as AuthProviderMode;

    if (!login || !password) {
      return NextResponse.json({ message: "Укажите логин и пароль" }, { status: 400 });
    }

    if (!["LKS", "ATTENDANCE"].includes(providerMode)) {
      return NextResponse.json({ message: "Некорректный provider mode" }, { status: 400 });
    }

    const user = mockRepository.login({ login, password, providerMode });
    if (!user) {
      return NextResponse.json({ message: "Неверные данные входа" }, { status: 401 });
    }

    const session = mockRepository.createSession(user.id, providerMode, AUTH_SESSION_TTL_MS);
    const response = NextResponse.json({ user }, { status: 200 });
    setSessionCookie(response, session.id);

    return response;
  } catch {
    return NextResponse.json({ message: "Ошибка авторизации" }, { status: 500 });
  }
}