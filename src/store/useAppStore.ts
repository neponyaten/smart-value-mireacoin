import { coinCatalog, vfxCatalog } from "@/lib/mock/data";
import type {
  AppUser,
  AuthProviderMode,
  LeaderboardGroup,
  LeaderboardStudent,
  LedgerItem,
  MarketItem,
  ProfileSettingsInput,
} from "@/lib/types/domain";
import { apiClient } from "@/lib/api/client";
import { create } from "zustand";

type LegacyClaimResult = { ok: boolean; message: string };

type AppState = {
  user: AppUser | null;
  ledger: LedgerItem[];
  marketItems: MarketItem[];
  leaderboardStudents: LeaderboardStudent[];
  leaderboardGroups: LeaderboardGroup[];
  isSessionLoading: boolean;
  isBusy: boolean;
  error: string;

  hydrateSession: () => Promise<void>;
  login: (payload: {
    login: string;
    password: string;
    providerMode: AuthProviderMode;
  }) => Promise<void>;
  register: (payload: {
    email: string;
    fullName: string;
    group: string;
    studentId: string;
    password: string;
    providerMode: AuthProviderMode;
  }) => Promise<void>;
  logout: () => Promise<void>;

  loadMarket: () => Promise<void>;
  loadLeaderboard: () => Promise<void>;
  loadLedger: () => Promise<void>;

  purchaseItem: (marketItemId: string) => Promise<void>;
  syncAttendance: () => Promise<void>;
  setHideInventory: (hideInventory: boolean) => Promise<void>;
  updateProfile: (payload: ProfileSettingsInput) => Promise<void>;
  setActiveCoin: (coinId: string) => Promise<void>;
  setActiveVfx: (vfxId: string) => Promise<void>;

  setUser: (user: AppUser | null) => void;
  clearError: () => void;

  addLedger: (item: LedgerItem) => void;
  claimBreakReward: (slotKey: string, delta: number, title: string) => LegacyClaimResult;
};

function applyUser(user: AppUser) {
  return {
    ...user,
    displayName: user.displayName || user.fullName,
    firstName: user.firstName,
    lastName: user.lastName,
    coins: user.balance,
    showInventory: user.showInventory ?? !user.hideInventory,
    showGroup: user.showGroup ?? true,
    showTelegram: user.showTelegram ?? false,
    showVk: user.showVk ?? false,
    showMax: user.showMax ?? false,
    bio: user.bio ?? "",
    telegramUrl: user.telegramUrl ?? "",
    vkUrl: user.vkUrl ?? "",
    maxUrl: user.maxUrl ?? "",
    lastSeenAt: user.lastSeenAt ?? new Date().toISOString(),
  };
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  ledger: [],
  marketItems: [],
  leaderboardStudents: [],
  leaderboardGroups: [],
  isSessionLoading: true,
  isBusy: false,
  error: "",

  clearError: () => set({ error: "" }),

  setUser: (user) => set({ user: user ? applyUser(user) : null }),

  hydrateSession: async () => {
    set({ isSessionLoading: true, error: "" });
    try {
      const { user } = await apiClient.session();
      set({ user: user ? applyUser(user) : null, isSessionLoading: false });
    } catch (error) {
      set({ user: null, isSessionLoading: false, error: (error as Error).message });
    }
  },

  login: async (payload) => {
    set({ isBusy: true, error: "" });
    try {
      const { user } = await apiClient.login(payload);
      set({ user: applyUser(user), isBusy: false });
    } catch (error) {
      set({ isBusy: false, error: (error as Error).message });
      throw error;
    }
  },

  register: async (payload) => {
    set({ isBusy: true, error: "" });
    try {
      const { user } = await apiClient.register(payload);
      set({ user: applyUser(user), isBusy: false });
    } catch (error) {
      set({ isBusy: false, error: (error as Error).message });
      throw error;
    }
  },

  logout: async () => {
    set({ isBusy: true, error: "" });
    try {
      await apiClient.logout();
      set({ user: null, ledger: [], isBusy: false });
    } catch (error) {
      set({ isBusy: false, error: (error as Error).message });
      throw error;
    }
  },

  loadMarket: async () => {
    try {
      const { items } = await apiClient.market();
      set({ marketItems: items });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  loadLeaderboard: async () => {
    try {
      const { students, groups } = await apiClient.leaderboard();
      set({ leaderboardStudents: students, leaderboardGroups: groups });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  loadLedger: async () => {
    try {
      const { items } = await apiClient.ledger();
      set({ ledger: items });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  purchaseItem: async (marketItemId) => {
    set({ isBusy: true, error: "" });
    try {
      const { user, ledgerItem } = await apiClient.purchase(marketItemId);
      set((state) => ({
        user: applyUser(user),
        ledger: [ledgerItem, ...state.ledger],
        isBusy: false,
      }));
    } catch (error) {
      set({ isBusy: false, error: (error as Error).message });
      throw error;
    }
  },

  syncAttendance: async () => {
    set({ isBusy: true, error: "" });
    try {
      const { user, ledgerItem } = await apiClient.attendanceSync();
      set((state) => ({
        user: applyUser(user),
        ledger: [ledgerItem, ...state.ledger],
        isBusy: false,
      }));
    } catch (error) {
      set({ isBusy: false, error: (error as Error).message });
      throw error;
    }
  },

  setHideInventory: async (hideInventory) => {
    try {
      const { user } = await apiClient.updateProfile({ hideInventory });
      set({ user: applyUser(user) });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  updateProfile: async (payload) => {
    set({ isBusy: true, error: "" });
    try {
      const { user } = await apiClient.updateProfile(payload);
      set({ user: applyUser(user), isBusy: false });
    } catch (error) {
      set({ isBusy: false, error: (error as Error).message });
      throw error;
    }
  },

  setActiveCoin: async (coinId) => {
    try {
      const currentUser = get().user;
      if (!currentUser || !currentUser.ownedCoinIds.includes(coinId)) {
        return;
      }
      const { user } = await apiClient.selectInventory({ coinId });
      set({ user: applyUser(user) });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  setActiveVfx: async (vfxId) => {
    try {
      const currentUser = get().user;
      if (!currentUser || !currentUser.ownedVfxIds.includes(vfxId)) {
        return;
      }
      const { user } = await apiClient.selectInventory({ vfxId });
      set({ user: applyUser(user) });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  addLedger: (item) => set((state) => ({ ledger: [item, ...state.ledger] })),

  claimBreakReward: (_slotKey, delta, title) => {
    const user = get().user;
    if (!user) {
      return { ok: false, message: "Нет активной сессии" };
    }

    const bonusItem: LedgerItem = {
      id: `legacy-${crypto.randomUUID()}`,
      type: "BONUS",
      title,
      amount: delta,
      createdAt: new Date().toISOString(),
    };

    const nextUser = applyUser({ ...user, balance: user.balance + delta, coins: user.balance + delta });
    set((state) => ({ user: nextUser, ledger: [bonusItem, ...state.ledger] }));
    return { ok: true, message: `+${delta} MC начислено` };
  },
}));

export const staticCatalog = {
  coins: coinCatalog,
  vfx: vfxCatalog,
};