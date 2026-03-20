export type UserRole = "STUDENT" | "LEADER";

export type AttendanceStatus = "ACTIVE" | "LATE" | "ABSENT" | "EXCUSED";

export type AuthProviderMode = "LKS" | "ATTENDANCE";

export type CoinRarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY" | "ARTIFACT";

export type VfxRarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY";

export type VfxCategory = "ENERGY" | "FIRE" | "ELECTRIC" | "COSMIC" | "PREMIUM";

export type VfxSlot = "NICKNAME" | "COIN" | "LEADERBOARD";

export type InventoryCategory = "COIN" | "VFX";

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
  fullName: string;
  group: string;
  role: UserRole;
  balance: number;
  coins: number;
  attendanceStatus: AttendanceStatus;
  avatarUrl: string;
  hideInventory: boolean;
  referralCode: string;
  ownedCoinIds: string[];
  ownedVfxIds: string[];
  activeCoinId: string;
  activeVfxId: string;
  activeVfxBySlot: Record<VfxSlot, string>;
  providerMode: AuthProviderMode;
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
  group: string;
  balance: number;
  activeCoinId: string;
};

export type LeaderboardGroup = {
  rank: number;
  group: string;
  totalBalance: number;
};
