import type {
  ActiveUserItem,
  AppUser,
  AuthProviderMode,
  FeedStatusItem,
  LedgerItem,
  MarketItem,
  LeaderboardGroup,
  LeaderboardStudent,
  ProfileSettingsInput,
  PublicUserProfile,
  ReportReason,
  TopUser,
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

  updateProfile(payload: ProfileSettingsInput | { hideInventory: boolean }) {
    return request<{ user: AppUser }>("/api/user/me", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  publicProfile(userId: string) {
    return request<{ profile: PublicUserProfile }>(`/api/users/${encodeURIComponent(userId)}`, {
      method: "GET",
      cache: "no-store",
    });
  },

  topUsers() {
    return request<{ users: TopUser[] }>("/api/social/top", {
      method: "GET",
      cache: "no-store",
    });
  },

  statusFeed(limit = 20) {
    return request<{ items: FeedStatusItem[] }>(`/api/social/feed?limit=${limit}`, {
      method: "GET",
      cache: "no-store",
    });
  },

  createOrUpdateStatus(text: string) {
    return request<{ item: FeedStatusItem; cooldownRemainingMs?: number }>("/api/social/status", {
      method: "POST",
      body: JSON.stringify({ text }),
    });
  },

  activeUsers() {
    return request<{ users: ActiveUserItem[] }>("/api/social/active", {
      method: "GET",
      cache: "no-store",
    });
  },

  heartbeat() {
    return request<{ ok: true }>("/api/social/heartbeat", {
      method: "POST",
      body: JSON.stringify({}),
    });
  },

  registerProfileView(userId: string) {
    return request<{ counted: boolean; totalViews: number }>(`/api/users/${encodeURIComponent(userId)}/view`, {
      method: "POST",
      body: JSON.stringify({}),
    });
  },

  reportUser(targetUserId: string, reason: ReportReason) {
    return request<{ ok: true }>("/api/social/report/user", {
      method: "POST",
      body: JSON.stringify({ targetUserId, reason }),
    });
  },

  reportStatus(targetStatusId: string, reason: ReportReason) {
    return request<{ ok: true }>("/api/social/report/status", {
      method: "POST",
      body: JSON.stringify({ targetStatusId, reason }),
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
