import { getSessionId } from "@/lib/api/session";
import { mockRepository } from "@/lib/mock/repository";
import type { ProfileSettingsInput } from "@/lib/types/domain";
import { NextRequest, NextResponse } from "next/server";

function normalizeText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, maxLength);
}

function normalizeBool(value: unknown, fallback: boolean) {
  if (typeof value === "boolean") {
    return value;
  }
  return fallback;
}

function normalizeUrl(value: unknown) {
  const raw = normalizeText(value, 240);
  if (!raw) {
    return "";
  }

  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return "";
    }
    return parsed.toString();
  } catch {
    return "";
  }
}

export async function GET(request: NextRequest) {
  const sessionId = getSessionId(request);
  if (!sessionId) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const user = mockRepository.getUserBySession(sessionId);
  return NextResponse.json({ user }, { status: 200 });
}

export async function PATCH(request: NextRequest) {
  try {
    const sessionId = getSessionId(request);
    if (!sessionId) {
      return NextResponse.json({ message: "Сессия не найдена" }, { status: 401 });
    }

    const user = mockRepository.getUserBySession(sessionId);
    if (!user) {
      return NextResponse.json({ message: "Сессия истекла" }, { status: 401 });
    }

    const body = await request.json();

    if (typeof body?.hideInventory === "boolean") {
      const updated = mockRepository.setHideInventory(user.id, Boolean(body.hideInventory));
      if (!updated) {
        return NextResponse.json({ message: "Пользователь не найден" }, { status: 404 });
      }
      return NextResponse.json({ user: updated }, { status: 200 });
    }

    const settings: ProfileSettingsInput = {
      bio: normalizeText(body?.bio, 280),
      showInventory: normalizeBool(body?.showInventory, !user.hideInventory),
      showGroup: normalizeBool(body?.showGroup, true),
      showTelegram: normalizeBool(body?.showTelegram, false),
      showVk: normalizeBool(body?.showVk, false),
      showMax: normalizeBool(body?.showMax, false),
      telegramUrl: normalizeUrl(body?.telegramUrl),
      vkUrl: normalizeUrl(body?.vkUrl),
      maxUrl: normalizeUrl(body?.maxUrl),
    };

    if (!settings.telegramUrl) {
      settings.showTelegram = false;
    }
    if (!settings.vkUrl) {
      settings.showVk = false;
    }
    if (!settings.maxUrl) {
      settings.showMax = false;
    }

    const updated = mockRepository.updateProfileSettings(user.id, settings);
    if (!updated) {
      return NextResponse.json({ message: "Пользователь не найден" }, { status: 404 });
    }

    return NextResponse.json({ user: updated }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Не удалось обновить профиль" }, { status: 500 });
  }
}