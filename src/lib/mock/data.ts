import type {
  AppUser,
  AttendanceStatus,
  CoinItem,
  LeaderboardGroup,
  LeaderboardStudent,
  LedgerItem,
  MarketItem,
  VfxItem,
} from "@/lib/types/domain";

type InternalUser = AppUser & { password: string };

export const coinCatalog: CoinItem[] = [
  {
    id: "coin-common",
    slug: "common",
    name: "Mirea Core",
    rarity: "COMMON",
    price: 0,
    glow: "from-cyan-300/30 to-slate-500/20",
    image: "/coins/coin_basic.png",
  },
  {
    id: "coin-rare",
    slug: "rare",
    name: "Fire Orbit",
    rarity: "RARE",
    price: 180,
    glow: "from-orange-300/35 to-red-500/20",
    image: "/coins/coin_fire.png",
  },
  {
    id: "coin-epic",
    slug: "epic",
    name: "Gold Pulse",
    rarity: "EPIC",
    price: 390,
    glow: "from-amber-300/35 to-yellow-500/25",
    image: "/coins/coin_gold.png",
  },
  {
    id: "coin-legendary",
    slug: "legendary",
    name: "Ice Nova",
    rarity: "LEGENDARY",
    price: 920,
    glow: "from-blue-200/40 to-cyan-400/30",
    image: "/coins/coin_ice.png",
  },
  {
    id: "coin-artifact",
    slug: "artifact",
    name: "Lightning Sigma",
    rarity: "ARTIFACT",
    price: 1800,
    glow: "from-violet-300/40 to-cyan-400/25",
    image: "/coins/coin_lightning.png",
  },
];

export const vfxCatalog: VfxItem[] = [
  { id: "vfx-blue-energy", slug: "blue_energy", name: "Blue Energy", rarity: "COMMON", category: "ENERGY", intensity: "CALM", price: 90, color: "#22d3ee" },
  { id: "vfx-plasma-core", slug: "plasma_core", name: "Plasma Core", rarity: "RARE", category: "ENERGY", intensity: "AGGRESSIVE", price: 220, color: "#06b6d4" },
  { id: "vfx-quantum-pulse", slug: "quantum_pulse", name: "Quantum Pulse", rarity: "EPIC", category: "ENERGY", intensity: "CHAOTIC", price: 450, color: "#67e8f9" },
  { id: "vfx-neon-wave", slug: "neon_wave", name: "Neon Wave", rarity: "RARE", category: "ENERGY", intensity: "CALM", price: 280, color: "#60a5fa" },

  { id: "vfx-gold-fire", slug: "gold_fire", name: "Gold Fire", rarity: "RARE", category: "FIRE", intensity: "AGGRESSIVE", price: 260, color: "#fbbf24" },
  { id: "vfx-phoenix-flame", slug: "phoenix_flame", name: "Phoenix Flame", rarity: "EPIC", category: "FIRE", intensity: "AGGRESSIVE", price: 540, color: "#fb923c" },
  { id: "vfx-inferno-ring", slug: "inferno_ring", name: "Inferno Ring", rarity: "LEGENDARY", category: "FIRE", intensity: "CHAOTIC", price: 980, color: "#f97316" },
  { id: "vfx-sun-ash", slug: "sun_ash", name: "Sun Ash", rarity: "COMMON", category: "FIRE", intensity: "CALM", price: 130, color: "#fdba74" },

  { id: "vfx-electric-arc", slug: "electric_arc", name: "Electric Arc", rarity: "RARE", category: "ELECTRIC", intensity: "AGGRESSIVE", price: 240, color: "#38bdf8" },
  { id: "vfx-storm-core", slug: "storm_core", name: "Storm Core", rarity: "EPIC", category: "ELECTRIC", intensity: "CHAOTIC", price: 520, color: "#818cf8" },
  { id: "vfx-lightning-orbit", slug: "lightning_orbit", name: "Lightning Orbit", rarity: "LEGENDARY", category: "ELECTRIC", intensity: "CHAOTIC", price: 1020, color: "#a5b4fc" },
  { id: "vfx-static-crown", slug: "static_crown", name: "Static Crown", rarity: "COMMON", category: "ELECTRIC", intensity: "CALM", price: 140, color: "#7dd3fc" },

  { id: "vfx-galaxy-core", slug: "galaxy_core", name: "Galaxy Core", rarity: "EPIC", category: "COSMIC", intensity: "CALM", price: 560, color: "#a78bfa" },
  { id: "vfx-black-hole", slug: "black_hole", name: "Black Hole", rarity: "LEGENDARY", category: "COSMIC", intensity: "AGGRESSIVE", price: 1200, color: "#6366f1" },
  { id: "vfx-nebula-particles", slug: "nebula_particles", name: "Nebula Particles", rarity: "RARE", category: "COSMIC", intensity: "CHAOTIC", price: 360, color: "#c084fc" },
  { id: "vfx-starforge", slug: "starforge", name: "Starforge", rarity: "EPIC", category: "COSMIC", intensity: "CALM", price: 620, color: "#93c5fd" },

  { id: "vfx-god-light", slug: "god_light", name: "God Light", rarity: "LEGENDARY", category: "PREMIUM", intensity: "CALM", price: 1600, color: "#fef08a" },
  { id: "vfx-holographic", slug: "holographic", name: "Holographic", rarity: "LEGENDARY", category: "PREMIUM", intensity: "CHAOTIC", price: 1720, color: "#5eead4" },
  { id: "vfx-diamond-aura", slug: "diamond_aura", name: "Diamond Aura", rarity: "LEGENDARY", category: "PREMIUM", intensity: "AGGRESSIVE", price: 1950, color: "#e0f2fe" },
  { id: "vfx-glitch-reality", slug: "glitch_reality", name: "Glitch Reality", rarity: "LEGENDARY", category: "PREMIUM", intensity: "CHAOTIC", price: 2100, color: "#f0abfc" },
  { id: "vfx-aurora-grid", slug: "aurora_grid", name: "Aurora Grid", rarity: "EPIC", category: "PREMIUM", intensity: "CALM", price: 860, color: "#22d3ee" },
];

export const marketCatalog: MarketItem[] = [
  ...coinCatalog.map((coin) => ({
    id: `market-${coin.id}`,
    category: "COIN" as const,
    itemId: coin.id,
    price: coin.price,
    featured: coin.rarity === "LEGENDARY" || coin.rarity === "ARTIFACT",
  })),
  ...vfxCatalog.map((vfx) => ({
    id: `market-${vfx.id}`,
    category: "VFX" as const,
    itemId: vfx.id,
    price: vfx.price,
    featured: vfx.rarity === "LEGENDARY",
  })),
];

function attendance(status: AttendanceStatus): AttendanceStatus {
  return status;
}

export const usersSeed: InternalUser[] = [
  {
    id: "u-student-1",
    studentId: "MIR-230011",
    email: "ivan.ivanov@mirea.ru",
    fullName: "Иван Иванов",
    group: "ИКБО-01-23",
    role: "STUDENT",
    balance: 540,
    coins: 540,
    attendanceStatus: attendance("ACTIVE"),
    avatarUrl: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=ivan",
    hideInventory: false,
    referralCode: "MIREA-IVAN-23",
    ownedCoinIds: ["coin-common", "coin-rare"],
    ownedVfxIds: ["vfx-blue-energy", "vfx-plasma-core"],
    activeCoinId: "coin-rare",
    activeVfxId: "vfx-blue-energy",
    activeVfxBySlot: {
      NICKNAME: "vfx-plasma-core",
      COIN: "vfx-blue-energy",
      LEADERBOARD: "vfx-blue-energy",
    },
    providerMode: "LKS",
    password: "123456",
  },
  {
    id: "u-leader-1",
    studentId: "MIR-230077",
    email: "maria.petrova@mirea.ru",
    fullName: "Мария Петрова",
    group: "ИКБО-01-23",
    role: "LEADER",
    balance: 1260,
    coins: 1260,
    attendanceStatus: attendance("ACTIVE"),
    avatarUrl: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=maria",
    hideInventory: false,
    referralCode: "MIREA-LEADER-77",
    ownedCoinIds: ["coin-common", "coin-rare", "coin-epic"],
    ownedVfxIds: ["vfx-blue-energy", "vfx-electric-arc", "vfx-galaxy-core"],
    activeCoinId: "coin-epic",
    activeVfxId: "vfx-electric-arc",
    activeVfxBySlot: {
      NICKNAME: "vfx-galaxy-core",
      COIN: "vfx-electric-arc",
      LEADERBOARD: "vfx-blue-energy",
    },
    providerMode: "ATTENDANCE",
    password: "123456",
  },
  {
    id: "u-student-2",
    studentId: "MIR-230054",
    email: "alex.smirnov@mirea.ru",
    fullName: "Алексей Смирнов",
    group: "ИКБО-02-23",
    role: "STUDENT",
    balance: 870,
    coins: 870,
    attendanceStatus: attendance("LATE"),
    avatarUrl: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=alex",
    hideInventory: true,
    referralCode: "MIREA-ALEX-54",
    ownedCoinIds: ["coin-common", "coin-legendary"],
    ownedVfxIds: ["vfx-blue-energy", "vfx-nebula-particles", "vfx-gold-fire"],
    activeCoinId: "coin-legendary",
    activeVfxId: "vfx-nebula-particles",
    activeVfxBySlot: {
      NICKNAME: "vfx-gold-fire",
      COIN: "vfx-nebula-particles",
      LEADERBOARD: "vfx-blue-energy",
    },
    providerMode: "LKS",
    password: "123456",
  },
];

export const ledgerSeed: Record<string, LedgerItem[]> = {
  "u-student-1": [
    {
      id: "led-1",
      type: "ATTENDANCE",
      title: "Посещение пары по матанализу",
      amount: 40,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    },
    {
      id: "led-2",
      type: "PURCHASE",
      title: "Покупка VFX Orbit Rings",
      amount: -130,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
  ],
  "u-leader-1": [
    {
      id: "led-3",
      type: "BONUS",
      title: "Бонус за модерацию группы",
      amount: 120,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    },
  ],
};

export function publicUser(user: InternalUser): AppUser {
  const { password: _password, ...publicData } = user;
  return publicData;
}

export function defaultLeaderboard(users: AppUser[]): {
  students: LeaderboardStudent[];
  groups: LeaderboardGroup[];
} {
  const students = [...users]
    .sort((a, b) => b.balance - a.balance)
    .map((user, index) => ({
      rank: index + 1,
      id: user.id,
      fullName: user.fullName,
      group: user.group,
      balance: user.balance,
      activeCoinId: user.activeCoinId,
    }));

  const groupMap = users.reduce<Record<string, number>>((acc, user) => {
    acc[user.group] = (acc[user.group] ?? 0) + user.balance;
    return acc;
  }, {});

  const groups = Object.entries(groupMap)
    .sort((a, b) => b[1] - a[1])
    .map(([group, totalBalance], index) => ({
      rank: index + 1,
      group,
      totalBalance,
    }));

  return { students, groups };
}

export type MockInternalUser = InternalUser;
