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
  ActiveUserItem,
  Achievement,
  AchievementCategory,
  AchievementRarity,
  AchievementUnlockResult,
  AchievementProgress,
  AppUser,
  AuthProviderMode,
  FeedStatusItem,
  LeaderboardGroup,
  LeaderboardStudent,
  LedgerItem,
  MarketItem,
  NotificationItem,
  NotificationType,
  ProfileSettingsInput,
  PublicInventoryItem,
  PublicUserProfile,
  ReportReason,
  ReportTargetType,
  TopUser,
} from "@/lib/types/domain";

type SessionRecord = {
  id: string;
  userId: string;
  providerMode: AuthProviderMode;
  expiresAt: number;
};

type ProfileViewRecord = {
  id: string;
  profileOwnerId: string;
  viewerUserId: string;
  viewedAt: string;
};

type UserStatusRecord = {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
};

type ContentReportRecord = {
  id: string;
  reporterUserId: string;
  targetUserId?: string;
  targetStatusId?: string;
  targetType: ReportTargetType;
  reason: ReportReason;
  createdAt: string;
};

type NotificationRecord = NotificationItem;

type AchievementRecord = Achievement;

type UserAchievementRecord = {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: string;
};

type MockDb = {
  users: MockInternalUser[];
  ledgerByUserId: Record<string, LedgerItem[]>;
  sessions: Map<string, SessionRecord>;
  profileViews: ProfileViewRecord[];
  statuses: UserStatusRecord[];
  reports: ContentReportRecord[];
  notifications: NotificationRecord[];
  achievements: AchievementRecord[];
  userAchievements: UserAchievementRecord[];
};

declare global {
  // eslint-disable-next-line no-var
  var __mireaMockDb: MockDb | undefined;
}

function createDb(): MockDb {
  const now = Date.now();
  const achievementCreatedAt = new Date(now - 1000 * 60 * 60 * 24 * 15).toISOString();

  const achievements: AchievementRecord[] = [
    {
      id: "ach-beta",
      title: "Участник бета-теста",
      description: "Принял участие в раннем тестировании продукта.",
      reward: 500,
      rarity: "epic",
      icon: "🧪",
      category: "rare",
      createdAt: achievementCreatedAt,
    },
    {
      id: "ach-first-login",
      title: "Первый вход",
      description: "Успешно вошел в систему впервые.",
      reward: 100,
      rarity: "common",
      icon: "🔓",
      category: "activity",
      createdAt: achievementCreatedAt,
    },
    {
      id: "ach-7-days",
      title: "7 дней подряд",
      description: "Сохранял активность 7 дней без пропусков.",
      reward: 300,
      rarity: "rare",
      icon: "📅",
      category: "study",
      createdAt: achievementCreatedAt,
    },
    {
      id: "ach-1000-mc",
      title: "1000 MC",
      description: "Достиг баланса в 1000 MireaCoin.",
      reward: 350,
      rarity: "rare",
      icon: "💰",
      category: "economy",
      createdAt: achievementCreatedAt,
    },
    {
      id: "ach-top10",
      title: "В топ-10",
      description: "Вошел в десятку лидеров по балансу.",
      reward: 700,
      rarity: "legendary",
      icon: "🏆",
      category: "social",
      createdAt: achievementCreatedAt,
    },
  ];

  return {
    users: structuredClone(usersSeed),
    ledgerByUserId: structuredClone(ledgerSeed),
    sessions: new Map<string, SessionRecord>(),
    profileViews: [],
    statuses: [
      {
        id: `status-${crypto.randomUUID()}`,
        userId: "u-leader-1",
        text: "Собираем актив по группе на этой неделе. Го в топ 1.",
        createdAt: new Date(now - 1000 * 60 * 30).toISOString(),
        updatedAt: new Date(now - 1000 * 60 * 30).toISOString(),
      },
      {
        id: `status-${crypto.randomUUID()}`,
        userId: "u-student-2",
        text: "Сегодня тестирую новый VFX билд, выглядит огонь.",
        createdAt: new Date(now - 1000 * 60 * 80).toISOString(),
        updatedAt: new Date(now - 1000 * 60 * 80).toISOString(),
      },
    ],
    reports: [],
    notifications: [
      {
        id: `notif-${crypto.randomUUID()}`,
        userId: "u-student-1",
        type: "system",
        title: "Добро пожаловать в MireaCoin",
        description: "Следите за заданиями, рынком и достижениями в одном месте.",
        isRead: false,
        createdAt: new Date(now - 1000 * 60 * 40).toISOString(),
      },
    ],
    achievements,
    userAchievements: [
      {
        id: `uach-${crypto.randomUUID()}`,
        userId: "u-student-1",
        achievementId: "ach-first-login",
        unlockedAt: new Date(now - 1000 * 60 * 60 * 12).toISOString(),
      },
      {
        id: `uach-${crypto.randomUUID()}`,
        userId: "u-leader-1",
        achievementId: "ach-first-login",
        unlockedAt: new Date(now - 1000 * 60 * 60 * 14).toISOString(),
      },
      {
        id: `uach-${crypto.randomUUID()}`,
        userId: "u-leader-1",
        achievementId: "ach-1000-mc",
        unlockedAt: new Date(now - 1000 * 60 * 60 * 9).toISOString(),
      },
    ],
  };
}

function db() {
  if (!global.__mireaMockDb) {
    global.__mireaMockDb = createDb();
  }
  return global.__mireaMockDb;
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0],
    lastName: parts.length > 1 ? parts[parts.length - 1] : undefined,
  };
}

function mapStatusItem(record: UserStatusRecord): FeedStatusItem | null {
  const user = db().users.find((candidate) => candidate.id === record.userId);
  if (!user) {
    return null;
  }

  const names = splitName(user.fullName);
  return {
    id: record.id,
    userId: user.id,
    displayName: user.displayName || user.fullName,
    firstName: user.firstName || names.firstName,
    lastName: user.lastName || names.lastName,
    text: record.text,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

const PROFILE_VIEW_WINDOW_MS = 24 * 60 * 60 * 1000;
const STATUS_COOLDOWN_MS = 60 * 60 * 1000;
const REPORT_WINDOW_MS = 12 * 60 * 60 * 1000;

function createNotificationForUser(payload: {
  userId: string;
  type: NotificationType;
  title: string;
  description: string;
}) {
  const notification: NotificationRecord = {
    id: `notif-${crypto.randomUUID()}`,
    userId: payload.userId,
    type: payload.type,
    title: payload.title.slice(0, 90),
    description: payload.description.slice(0, 260),
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  db().notifications.push(notification);
  return notification;
}

function normalizeAchievementRarity(input: string): AchievementRarity {
  if (input === "rare" || input === "epic" || input === "legendary") {
    return input;
  }
  return "common";
}

function normalizeAchievementCategory(input: string): AchievementCategory {
  if (input === "study" || input === "activity" || input === "economy" || input === "social" || input === "rare") {
    return input;
  }
  return "activity";
}

function achievementProgressOf(userId: string): AchievementProgress {
  const current = db();
  const total = current.achievements.length;
  const unlocked = current.userAchievements.filter((item) => item.userId === userId).length;
  const percent = total > 0 ? Math.round((unlocked / total) * 100) : 0;
  return { unlocked, total, percent };
}

function buildBadges(user: AppUser): string[] {
  const badges: string[] = [];
  if (user.role === "LEADER") {
    badges.push("Group Captain");
  }
  if (user.balance >= 1000) {
    badges.push("MC Whale");
  }
  if (user.ownedCoinIds.length + user.ownedVfxIds.length >= 4) {
    badges.push("Collector");
  }
  if (badges.length === 0) {
    badges.push("Rising Player");
  }
  return badges;
}

function userInventoryShowcase(user: AppUser): PublicInventoryItem[] {
  const coin = coinCatalog.find((item) => item.id === user.activeCoinId);
  const vfx = vfxCatalog.find((item) => item.id === user.activeVfxId);

  return [
    coin
      ? {
          id: coin.id,
          category: "COIN",
          rarity: coin.rarity,
          name: coin.name,
        }
      : null,
    vfx
      ? {
          id: vfx.id,
          category: "VFX",
          rarity: vfx.rarity,
          name: vfx.name,
        }
      : null,
  ].filter((item): item is PublicInventoryItem => Boolean(item));
}

function toPublicProfile(user: AppUser): PublicUserProfile {
  const users = db().users.map((entry) => publicUser(entry));
  const rank = [...users].sort((a, b) => b.balance - a.balance).findIndex((entry) => entry.id === user.id) + 1;
  const names = splitName(user.fullName);
  const views = db()
    .profileViews
    .filter((item) => item.profileOwnerId === user.id)
    .sort((a, b) => (a.viewedAt < b.viewedAt ? 1 : -1));

  const allInventory: PublicInventoryItem[] = [
    ...user.ownedCoinIds
      .map((coinId) => coinCatalog.find((coin) => coin.id === coinId))
      .filter((coin): coin is NonNullable<typeof coin> => Boolean(coin))
      .map((coin) => ({
        id: coin.id,
        category: "COIN" as const,
        rarity: coin.rarity,
        name: coin.name,
      })),
    ...user.ownedVfxIds
      .map((vfxId) => vfxCatalog.find((item) => item.id === vfxId))
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .map((item) => ({
        id: item.id,
        category: "VFX" as const,
        rarity: item.rarity,
        name: item.name,
      })),
  ];

  const contacts = {
    telegramUrl: user.showTelegram && user.telegramUrl ? user.telegramUrl : undefined,
    vkUrl: user.showVk && user.vkUrl ? user.vkUrl : undefined,
    maxUrl: user.showMax && user.maxUrl ? user.maxUrl : undefined,
  };

  return {
    id: user.id,
    displayName: user.displayName || user.fullName,
    firstName: user.firstName || names.firstName,
    lastName: user.lastName || names.lastName,
    rank,
    balance: user.balance,
    profileViews: views.length,
    recentViewTimestamps: views.slice(0, 10).map((item) => item.viewedAt),
    bio: user.bio,
    group: user.showGroup ? user.group : undefined,
    activeCoinId: user.activeCoinId,
    activeVfxId: user.activeVfxId,
    badges: buildBadges(user),
    showcase: userInventoryShowcase(user),
    inventory: user.showInventory ? allInventory : undefined,
    contacts,
  };
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
      displayName: payload.fullName,
      firstName: splitName(payload.fullName).firstName,
      lastName: splitName(payload.fullName).lastName,
      fullName: payload.fullName,
      bio: "Новый участник MireaCoin beta.",
      group: payload.group,
      role: "STUDENT",
      balance: 180,
      coins: 180,
      attendanceStatus: "ACTIVE",
      avatarUrl: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${encodeURIComponent(payload.studentId)}`,
      hideInventory: false,
      showInventory: true,
      showGroup: true,
      showTelegram: false,
      showVk: false,
      showMax: false,
      telegramUrl: "",
      vkUrl: "",
      maxUrl: "",
      referralCode: `MIREA-${payload.studentId}`,
      ownedCoinIds: ["coin-common"],
      ownedVfxIds: ["vfx-blue-energy"],
      activeCoinId: "coin-common",
      activeVfxId: "vfx-blue-energy",
      activeVfxBySlot: {
        NICKNAME: "vfx-blue-energy",
        COIN: "vfx-blue-energy",
        LEADERBOARD: "vfx-blue-energy",
      },
      providerMode: payload.providerMode,
      lastSeenAt: new Date().toISOString(),
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

    user.lastSeenAt = new Date().toISOString();

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

  getNotifications(userId: string, limit = 30) {
    const allItems = db().notifications.filter((item) => item.userId === userId);
    const items = allItems
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, limit);

    const unreadCount = allItems.filter((item) => !item.isRead).length;
    return { items, unreadCount };
  },

  markNotificationRead(userId: string, notificationId: string) {
    const item = db().notifications.find((notification) => notification.id === notificationId);
    if (!item || item.userId !== userId) {
      return null;
    }

    item.isRead = true;
    return item;
  },

  markAllNotificationsRead(userId: string) {
    let count = 0;
    for (const notification of db().notifications) {
      if (notification.userId === userId && !notification.isRead) {
        notification.isRead = true;
        count += 1;
      }
    }
    return { updated: count };
  },

  createAchievement(payload: {
    title: string;
    description: string;
    reward: number;
    rarity: string;
    icon: string;
    category: string;
  }) {
    const achievement: AchievementRecord = {
      id: `ach-${crypto.randomUUID()}`,
      title: payload.title.trim().slice(0, 70),
      description: payload.description.trim().slice(0, 240),
      reward: Math.max(0, Math.floor(payload.reward)),
      rarity: normalizeAchievementRarity(payload.rarity),
      icon: payload.icon.trim().slice(0, 8) || "🏅",
      category: normalizeAchievementCategory(payload.category),
      createdAt: new Date().toISOString(),
    };

    db().achievements.push(achievement);
    return achievement;
  },

  getAchievements() {
    return [...db().achievements].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  },

  getUserAchievements(userId: string) {
    const current = db();
    const unlockedMap = new Map(
      current.userAchievements
        .filter((item) => item.userId === userId)
        .map((item) => [item.achievementId, item])
    );

    const items = current.achievements
      .map((achievement) => {
        const unlocked = unlockedMap.get(achievement.id);
        return {
          ...achievement,
          unlocked: Boolean(unlocked),
          unlockedAt: unlocked?.unlockedAt,
        };
      })
      .sort((a, b) => Number(b.unlocked) - Number(a.unlocked) || Number(a.reward) - Number(b.reward));

    return {
      items,
      progress: achievementProgressOf(userId),
    };
  },

  unlockAchievement(userId: string, achievementId: string): AchievementUnlockResult | { error: string } {
    const current = db();
    const user = current.users.find((candidate) => candidate.id === userId);
    if (!user) {
      return { error: "Пользователь не найден" };
    }

    const achievement = current.achievements.find((item) => item.id === achievementId);
    if (!achievement) {
      return { error: "Достижение не найдено" };
    }

    const already = current.userAchievements.find(
      (item) => item.userId === userId && item.achievementId === achievementId
    );
    if (already) {
      return { error: "Достижение уже выдано" };
    }

    const userAchievement: UserAchievementRecord = {
      id: `uach-${crypto.randomUUID()}`,
      userId,
      achievementId,
      unlockedAt: new Date().toISOString(),
    };
    current.userAchievements.push(userAchievement);

    user.balance += achievement.reward;
    user.coins = user.balance;

    const ledgerItem: LedgerItem = {
      id: `led-${crypto.randomUUID()}`,
      type: "BONUS",
      title: `Награда за достижение: ${achievement.title}`,
      amount: achievement.reward,
      createdAt: new Date().toISOString(),
    };

    if (!current.ledgerByUserId[userId]) {
      current.ledgerByUserId[userId] = [];
    }
    current.ledgerByUserId[userId].push(ledgerItem);

    const notification = createNotificationForUser({
      userId,
      type: "achievement",
      title: `🎉 Новое достижение: ${achievement.title}`,
      description: `+${achievement.reward} MC начислено за выполнение достижения`,
    });

    return {
      userAchievement,
      achievement,
      notification,
      rewardDelta: achievement.reward,
      newBalance: user.balance,
    };
  },

  setHideInventory(userId: string, hideInventory: boolean) {
    const user = db().users.find((candidate) => candidate.id === userId);
    if (!user) {
      return null;
    }
    user.hideInventory = hideInventory;
    user.showInventory = !hideInventory;
    return publicUser(user);
  },

  updateProfileSettings(userId: string, settings: ProfileSettingsInput) {
    const user = db().users.find((candidate) => candidate.id === userId);
    if (!user) {
      return null;
    }

    user.bio = settings.bio;
    user.showInventory = settings.showInventory;
    user.hideInventory = !settings.showInventory;
    user.showGroup = settings.showGroup;
    user.showTelegram = settings.showTelegram;
    user.showVk = settings.showVk;
    user.showMax = settings.showMax;
    user.telegramUrl = settings.telegramUrl;
    user.vkUrl = settings.vkUrl;
    user.maxUrl = settings.maxUrl;

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

    const purchasedName =
      marketItem.category === "COIN"
        ? coinCatalog.find((coin) => coin.id === marketItem.itemId)?.name
        : vfxCatalog.find((vfx) => vfx.id === marketItem.itemId)?.name;

    createNotificationForUser({
      userId,
      type: "market",
      title: "Покупка в маркете",
      description: `${purchasedName ?? "Предмет"} за ${marketItem.price} MC`,
    });

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

    createNotificationForUser({
      userId,
      type: "coins",
      title: "Начислены монеты",
      description: `Синхронизация посещаемости: +${bonus} MC`,
    });

    return { user: publicUser(user), ledgerItem };
  },

  getLeaderboard(): { students: LeaderboardStudent[]; groups: LeaderboardGroup[] } {
    const users: AppUser[] = db().users.map((user) => publicUser(user));
    return defaultLeaderboard(users);
  },

  getPublicProfileById(userId: string): PublicUserProfile | null {
    const user = db().users.find((candidate) => candidate.id === userId);
    if (!user) {
      return null;
    }
    return toPublicProfile(publicUser(user));
  },

  registerProfileView(payload: { profileOwnerId: string; viewerUserId: string }) {
    const current = db();
    const now = Date.now();

    if (payload.profileOwnerId === payload.viewerUserId) {
      const total = current.profileViews.filter((item) => item.profileOwnerId === payload.profileOwnerId).length;
      return { counted: false, totalViews: total };
    }

    const latest = current.profileViews
      .filter(
        (item) =>
          item.profileOwnerId === payload.profileOwnerId &&
          item.viewerUserId === payload.viewerUserId
      )
      .sort((a, b) => (a.viewedAt < b.viewedAt ? 1 : -1))[0];

    if (latest && now - new Date(latest.viewedAt).getTime() < PROFILE_VIEW_WINDOW_MS) {
      const total = current.profileViews.filter((item) => item.profileOwnerId === payload.profileOwnerId).length;
      return { counted: false, totalViews: total };
    }

    current.profileViews.push({
      id: `view-${crypto.randomUUID()}`,
      profileOwnerId: payload.profileOwnerId,
      viewerUserId: payload.viewerUserId,
      viewedAt: new Date(now).toISOString(),
    });

    const total = current.profileViews.filter((item) => item.profileOwnerId === payload.profileOwnerId).length;
    return { counted: true, totalViews: total };
  },

  getTopUsers(limit = 10): TopUser[] {
    return db()
      .users
      .map((user) => publicUser(user))
      .sort((a, b) => b.balance - a.balance)
      .slice(0, limit)
      .map((user, index) => {
        const names = splitName(user.fullName);
        return {
          id: user.id,
          displayName: user.displayName || user.fullName,
          firstName: user.firstName || names.firstName,
          lastName: user.lastName || names.lastName,
          rank: index + 1,
          balance: user.balance,
          activeVfxId: user.activeVfxId,
        };
      });
  },

  getStatusFeed(limit = 20): FeedStatusItem[] {
    return db()
      .statuses
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
      .slice(0, limit)
      .map((entry) => mapStatusItem(entry))
      .filter((entry): entry is FeedStatusItem => Boolean(entry));
  },

  createOrUpdateStatus(userId: string, text: string) {
    const current = db();
    const now = Date.now();
    const cleanText = text.trim().replace(/\s+/g, " ").slice(0, 200);

    if (!cleanText) {
      return { error: "Статус не должен быть пустым" } as const;
    }

    const previous = current.statuses.find((item) => item.userId === userId);
    if (previous) {
      const delta = now - new Date(previous.updatedAt).getTime();
      if (delta < STATUS_COOLDOWN_MS) {
        return {
          error: "Статус можно обновлять не чаще одного раза в час",
          cooldownRemainingMs: STATUS_COOLDOWN_MS - delta,
        } as const;
      }

      previous.text = cleanText;
      previous.updatedAt = new Date(now).toISOString();
      return { status: mapStatusItem(previous) } as const;
    }

    const created: UserStatusRecord = {
      id: `status-${crypto.randomUUID()}`,
      userId,
      text: cleanText,
      createdAt: new Date(now).toISOString(),
      updatedAt: new Date(now).toISOString(),
    };

    current.statuses.push(created);
    return { status: mapStatusItem(created) } as const;
  },

  touchLastSeen(userId: string) {
    const user = db().users.find((candidate) => candidate.id === userId);
    if (!user) {
      return null;
    }
    user.lastSeenAt = new Date().toISOString();
    return publicUser(user);
  },

  getActiveUsers(limit = 12): ActiveUserItem[] {
    const now = Date.now();
    const ONLINE_WINDOW = 10 * 60 * 1000;

    return db()
      .users
      .map((user) => {
        const names = splitName(user.fullName);
        const lastSeenAt = user.lastSeenAt || new Date(now - 1000 * 60 * 60).toISOString();
        return {
          id: user.id,
          displayName: user.displayName || user.fullName,
          firstName: user.firstName || names.firstName,
          lastName: user.lastName || names.lastName,
          lastSeenAt,
          isOnline: now - new Date(lastSeenAt).getTime() <= ONLINE_WINDOW,
        };
      })
      .sort((a, b) => (a.lastSeenAt < b.lastSeenAt ? 1 : -1))
      .slice(0, limit);
  },

  createReport(payload: {
    reporterUserId: string;
    targetType: ReportTargetType;
    reason: ReportReason;
    targetUserId?: string;
    targetStatusId?: string;
  }) {
    const current = db();
    const now = Date.now();

    if (payload.targetType === "profile") {
      if (!payload.targetUserId) {
        return { error: "Не указан пользователь для жалобы" } as const;
      }

      if (payload.targetUserId === payload.reporterUserId) {
        return { error: "Нельзя отправить жалобу на свой профиль" } as const;
      }
    }

    if (payload.targetType === "status") {
      if (!payload.targetStatusId) {
        return { error: "Не указан статус для жалобы" } as const;
      }
    }

    const duplicate = current.reports
      .filter(
        (item) =>
          item.reporterUserId === payload.reporterUserId &&
          item.targetType === payload.targetType &&
          item.targetUserId === payload.targetUserId &&
          item.targetStatusId === payload.targetStatusId
      )
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0];

    if (duplicate && now - new Date(duplicate.createdAt).getTime() < REPORT_WINDOW_MS) {
      return { error: "Похожая жалоба уже отправлена недавно" } as const;
    }

    current.reports.push({
      id: `report-${crypto.randomUUID()}`,
      reporterUserId: payload.reporterUserId,
      targetType: payload.targetType,
      targetUserId: payload.targetUserId,
      targetStatusId: payload.targetStatusId,
      reason: payload.reason,
      createdAt: new Date(now).toISOString(),
    });

    return { ok: true } as const;
  },

  getMarketItems(): MarketItem[] {
    return [...marketCatalog];
  },
};
