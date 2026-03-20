import type {
  AppUser,
  AuthProviderMode,
  LedgerItem,
  MarketItem,
  LeaderboardGroup,
  LeaderboardStudent,
} from "@/lib/types/domain";

type ApiError = { message: string };

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const payload = (await response.json()) as T & ApiError;
  if (!response.ok) {
    throw new Error(payload?.message || "Ошибка запроса");
  }

  return payload;
}

export const apiClient = {
  login(payload: { login: string; password: string; providerMode: AuthProviderMode }) {
    return request<{ user: AppUser }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  register(payload: {
    email: string;
    fullName: string;
    group: string;
    studentId: string;
    password: string;
    providerMode: AuthProviderMode;
  }) {
    return request<{ user: AppUser }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  session() {
    return request<{ user: AppUser | null }>("/api/auth/session", {
      method: "GET",
      cache: "no-store",
    });
  },

  logout() {
    return request<{ ok: true }>("/api/auth/logout", { method: "POST" });
  },

  market() {
    return request<{ items: MarketItem[] }>("/api/market", { method: "GET", cache: "no-store" });
  },

  purchase(marketItemId: string) {
    return request<{ user: AppUser; ledgerItem: LedgerItem }>("/api/market/purchase", {
      method: "POST",
      body: JSON.stringify({ marketItemId }),
    });
  },

  leaderboard() {
    return request<{ students: LeaderboardStudent[]; groups: LeaderboardGroup[] }>(
      "/api/leaderboard",
      {
        method: "GET",
        cache: "no-store",
      }
    );
  },

  attendanceSync() {
    return request<{ user: AppUser; ledgerItem: LedgerItem }>("/api/attendance/sync", {
      method: "POST",
      body: JSON.stringify({}),
    });
  },

  updateProfile(payload: { hideInventory: boolean }) {
    return request<{ user: AppUser }>("/api/user/me", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  selectInventory(payload: { coinId?: string; vfxId?: string }) {
    return request<{ user: AppUser }>("/api/inventory/select", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  ledger() {
    return request<{ items: LedgerItem[] }>("/api/ledger", { method: "GET", cache: "no-store" });
  },
};
