import { DEFAULT_MOCK_PASSWORD } from "@/lib/constants/auth";
import {
  coinCatalog,
  defaultLeaderboard,
  ledgerSeed,
  marketCatalog,
  publicUser,
  usersSeed,
  vfxCatalog,
  type MockInternalUser,
} from "@/lib/mock/data";
import type {
  AppUser,
  AuthProviderMode,
  LeaderboardGroup,
  LeaderboardStudent,
  LedgerItem,
  MarketItem,
} from "@/lib/types/domain";

type SessionRecord = {
  id: string;
  userId: string;
  providerMode: AuthProviderMode;
  expiresAt: number;
};

type MockDb = {
  users: MockInternalUser[];
  ledgerByUserId: Record<string, LedgerItem[]>;
  sessions: Map<string, SessionRecord>;
};

declare global {
  // eslint-disable-next-line no-var
  var __mireaMockDb: MockDb | undefined;
}

function createDb(): MockDb {
  return {
    users: structuredClone(usersSeed),
    ledgerByUserId: structuredClone(ledgerSeed),
    sessions: new Map<string, SessionRecord>(),
  };
}

function db() {
  if (!global.__mireaMockDb) {
    global.__mireaMockDb = createDb();
  }
  return global.__mireaMockDb;
}

export const mockRepository = {
  getCatalog() {
    return {
      coins: coinCatalog,
      vfx: vfxCatalog,
      market: marketCatalog,
    };
  },

  login(payload: { login: string; password: string; providerMode: AuthProviderMode }) {
    const login = payload.login.trim().toLowerCase();
    const current = db();

    const user = current.users.find(
      (candidate) =>
        candidate.email.toLowerCase() === login || candidate.studentId.toLowerCase() === login
    );

    if (!user) {
      return null;
    }

    const passwordOk = user.password === payload.password || payload.password === DEFAULT_MOCK_PASSWORD;
    if (!passwordOk) {
      return null;
    }

    user.providerMode = payload.providerMode;
    user.attendanceStatus = payload.providerMode === "ATTENDANCE" ? "ACTIVE" : user.attendanceStatus;
    return publicUser(user);
  },

  register(payload: {
    email: string;
    fullName: string;
    group: string;
    studentId: string;
    password: string;
    providerMode: AuthProviderMode;
  }) {
    const current = db();
    const exists = current.users.some(
      (user) =>
        user.email.toLowerCase() === payload.email.toLowerCase() ||
        user.studentId.toLowerCase() === payload.studentId.toLowerCase()
    );

    if (exists) {
      return { error: "Пользователь с таким email или student id уже существует" } as const;
    }

    const newUser: MockInternalUser = {
      id: `u-${crypto.randomUUID()}`,
      studentId: payload.studentId,
      email: payload.email,
      fullName: payload.fullName,
      group: payload.group,
      role: "STUDENT",
      balance: 180,
      coins: 180,
      attendanceStatus: "ACTIVE",
      avatarUrl: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${encodeURIComponent(payload.studentId)}`,
      hideInventory: false,
      referralCode: `MIREA-${payload.studentId}`,
      ownedCoinIds: ["coin-common"],
      ownedVfxIds: ["vfx-none"],
      activeCoinId: "coin-common",
      activeVfxId: "vfx-none",
      providerMode: payload.providerMode,
      password: payload.password,
    };

    current.users.push(newUser);
    current.ledgerByUserId[newUser.id] = [
      {
        id: `led-${crypto.randomUUID()}`,
        type: "BONUS",
        title: "Стартовый бонус новичка",
        amount: 180,
        createdAt: new Date().toISOString(),
      },
    ];

    return { user: publicUser(newUser) } as const;
  },

  createSession(userId: string, providerMode: AuthProviderMode, ttlMs: number) {
    const current = db();
    const session: SessionRecord = {
      id: crypto.randomUUID(),
      userId,
      providerMode,
      expiresAt: Date.now() + ttlMs,
    };

    current.sessions.set(session.id, session);
    return session;
  },

  destroySession(sessionId: string) {
    db().sessions.delete(sessionId);
  },

  getUserBySession(sessionId: string) {
    const current = db();
    const session = current.sessions.get(sessionId);
    if (!session) {
      return null;
    }

    if (session.expiresAt < Date.now()) {
      current.sessions.delete(sessionId);
      return null;
    }

    const user = current.users.find((candidate) => candidate.id === session.userId);
    if (!user) {
      current.sessions.delete(sessionId);
      return null;
    }

    return publicUser(user);
  },

  getUserById(userId: string) {
    const user = db().users.find((candidate) => candidate.id === userId);
    return user ? publicUser(user) : null;
  },

  getLedger(userId: string) {
    return [...(db().ledgerByUserId[userId] ?? [])].sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : -1
    );
  },

  setHideInventory(userId: string, hideInventory: boolean) {
    const user = db().users.find((candidate) => candidate.id === userId);
    if (!user) {
      return null;
    }
    user.hideInventory = hideInventory;
    return publicUser(user);
  },

  setActiveInventory(userId: string, payload: { coinId?: string; vfxId?: string }) {
    const user = db().users.find((candidate) => candidate.id === userId);
    if (!user) {
      return null;
    }

    if (payload.coinId && user.ownedCoinIds.includes(payload.coinId)) {
      user.activeCoinId = payload.coinId;
    }

    if (payload.vfxId && user.ownedVfxIds.includes(payload.vfxId)) {
      user.activeVfxId = payload.vfxId;
    }

    return publicUser(user);
  },

  purchaseItem(userId: string, marketItemId: string) {
    const current = db();
    const user = current.users.find((candidate) => candidate.id === userId);
    if (!user) {
      return { error: "Пользователь не найден" } as const;
    }

    const marketItem = marketCatalog.find((item) => item.id === marketItemId);
    if (!marketItem) {
      return { error: "Товар не найден" } as const;
    }

    const alreadyOwned =
      marketItem.category === "COIN"
        ? user.ownedCoinIds.includes(marketItem.itemId)
        : user.ownedVfxIds.includes(marketItem.itemId);

    if (alreadyOwned) {
      return { error: "Товар уже в инвентаре" } as const;
    }

    if (user.balance < marketItem.price) {
      return { error: "Недостаточно MireaCoin" } as const;
    }

    user.balance -= marketItem.price;
    user.coins = user.balance;

    if (marketItem.category === "COIN") {
      user.ownedCoinIds.push(marketItem.itemId);
      user.activeCoinId = marketItem.itemId;
    } else {
      user.ownedVfxIds.push(marketItem.itemId);
      user.activeVfxId = marketItem.itemId;
    }

    const ledgerItem: LedgerItem = {
      id: `led-${crypto.randomUUID()}`,
      type: "PURCHASE",
      title: `Покупка ${marketItem.category === "COIN" ? "монеты" : "VFX"}`,
      amount: -marketItem.price,
      createdAt: new Date().toISOString(),
    };

    if (!current.ledgerByUserId[userId]) {
      current.ledgerByUserId[userId] = [];
    }
    current.ledgerByUserId[userId].push(ledgerItem);

    return {
      user: publicUser(user),
      ledgerItem,
    } as const;
  },

  attendanceReward(userId: string) {
    const current = db();
    const user = current.users.find((candidate) => candidate.id === userId);
    if (!user) {
      return null;
    }

    const bonus = 25;
    user.balance += bonus;
    user.coins = user.balance;
    user.attendanceStatus = "ACTIVE";

    const ledgerItem: LedgerItem = {
      id: `led-${crypto.randomUUID()}`,
      type: "ATTENDANCE",
      title: "Синхронизация посещаемости",
      amount: bonus,
      createdAt: new Date().toISOString(),
    };

    if (!current.ledgerByUserId[userId]) {
      current.ledgerByUserId[userId] = [];
    }
    current.ledgerByUserId[userId].push(ledgerItem);

    return { user: publicUser(user), ledgerItem };
  },

  getLeaderboard(): { students: LeaderboardStudent[]; groups: LeaderboardGroup[] } {
    const users: AppUser[] = db().users.map((user) => publicUser(user));
    return defaultLeaderboard(users);
  },

  getMarketItems(): MarketItem[] {
    return [...marketCatalog];
  },
};
