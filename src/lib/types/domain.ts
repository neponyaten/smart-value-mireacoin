export type UserRole = "STUDENT" | "LEADER";

export type AttendanceStatus = "ACTIVE" | "LATE" | "ABSENT" | "EXCUSED";

export type AuthProviderMode = "LKS" | "ATTENDANCE";

export type CoinRarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY" | "ARTIFACT";

export type VfxRarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY";

export type VfxCategory = "ENERGY" | "FIRE" | "ELECTRIC" | "COSMIC" | "PREMIUM";

export type VfxSlot = "NICKNAME" | "COIN" | "LEADERBOARD";

export type InventoryCategory = "COIN" | "VFX";

export type ReportTargetType = "profile" | "status";

export type ReportReason = "spam" | "abuse" | "inappropriate" | "other";

export type NotificationType = "achievement" | "coins" | "market" | "system";

export type AchievementRarity = "common" | "rare" | "epic" | "legendary";

export type AchievementCategory = "study" | "activity" | "economy" | "social" | "rare";

export type UITheme = "dark" | "light";

export type CoinItem = {
  id: string;
  slug: string;
  name: string;
  rarity: CoinRarity;
  price: number;
  glow: string;
  image: string;
};

export type VfxItem = {
  id: string;
  slug: string;
  name: string;
  rarity: VfxRarity;
  category: VfxCategory;
  intensity: "CALM" | "AGGRESSIVE" | "CHAOTIC";
  price: number;
  color: string;
};

export type MarketItem = {
  id: string;
  category: InventoryCategory;
  itemId: string;
  price: number;
  featured?: boolean;
};

export type AppUser = {
  id: string;
  studentId: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  bio: string;
  group: string;
  role: UserRole;
  userType?: "user" | "moderator" | "admin" | "superadmin";
  balance: number;
  coins: number;
  attendanceStatus: AttendanceStatus;
  avatarUrl: string;
  hideInventory: boolean;
  showInventory: boolean;
  showGroup: boolean;
  showTelegram: boolean;
  showVk: boolean;
  showMax: boolean;
  telegramUrl: string;
  vkUrl: string;
  maxUrl: string;
  referralCode: string;
  ownedCoinIds: string[];
  ownedVfxIds: string[];
  activeCoinId: string;
  activeVfxId: string;
  activeVfxBySlot: Record<VfxSlot, string>;
  providerMode: AuthProviderMode;
  lastSeenAt: string;
};

export type LedgerItem = {
  id: string;
  type: "ATTENDANCE" | "PURCHASE" | "BONUS";
  title: string;
  amount: number;
  createdAt: string;
};

export type LeaderboardStudent = {
  rank: number;
  id: string;
  fullName: string;
  avatarUrl: string;
  group: string;
  balance: number;
  activeCoinId: string;
  nicknameVfxId?: string;
  leaderboardVfxId?: string;
};

export type LeaderboardGroup = {
  rank: number;
  group: string;
  totalBalance: number;
};

export type ProfileSettingsInput = {
  bio: string;
  showInventory: boolean;
  showGroup: boolean;
  showTelegram: boolean;
  showVk: boolean;
  showMax: boolean;
  telegramUrl: string;
  vkUrl: string;
  maxUrl: string;
};

export type PublicContactLinks = {
  telegramUrl?: string;
  vkUrl?: string;
  maxUrl?: string;
};

export type PublicInventoryItem = {
  id: string;
  category: InventoryCategory;
  rarity: CoinRarity | VfxRarity;
  name: string;
};

export type PublicUserProfile = {
  id: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  rank: number;
  balance: number;
  profileViews: number;
  recentViewTimestamps: string[];
  bio: string;
  group?: string;
  activeCoinId: string;
  activeVfxId: string;
  badges: string[];
  showcase: PublicInventoryItem[];
  inventory?: PublicInventoryItem[];
  contacts: PublicContactLinks;
};

export type TopUser = {
  id: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  rank: number;
  balance: number;
  activeVfxId: string;
};

export type FeedStatusItem = {
  id: string;
  userId: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  text: string;
  createdAt: string;
  updatedAt: string;
};

export type ActiveUserItem = {
  id: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  lastSeenAt: string;
  isOnline: boolean;
};

export type NotificationItem = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  description: string;
  isRead: boolean;
  createdAt: string;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  reward: number;
  rarity: AchievementRarity;
  icon: string;
  category: AchievementCategory;
  createdAt: string;
};

export type UserAchievement = {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: string;
};

export type UserAchievementView = Achievement & {
  unlockedAt?: string;
  unlocked: boolean;
};

export type AchievementProgress = {
  unlocked: number;
  total: number;
  percent: number;
};

export type AchievementUnlockResult = {
  userAchievement: UserAchievement;
  achievement: Achievement;
  notification: NotificationItem;
  rewardDelta: number;
  newBalance: number;
};

export type ToastItem = {
  id: string;
  title: string;
  message: string;
  type: NotificationType | "success";
  createdAt: string;
  durationMs?: number;
};

