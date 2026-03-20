export type User = {
  id: number;
  fullName: string;
  group: string;
  role: "Студент" | "Староста";
  coins: number;
  activeCoinId: string;
  activeVfxId: string;
  hideInventory: boolean;
  referralCode: string;
  lastSyncedAt: number;
  rewardedEventIds: string[];
};

export const studentUserMock: User = {
  id: 1,
  fullName: "Иван Иванов",
  group: "ИКБО-01-23",
  role: "Студент",
  coins: 420,
  activeCoinId: "coin_common",
  activeVfxId: "vfx_none",
  hideInventory: false,
  referralCode: "MIREA-INVITE-123",
  lastSyncedAt: 0,
  rewardedEventIds: [],
};

export const leaderUserMock: User = {
  id: 2,
  fullName: "Мария Петрова",
  group: "ИКБО-01-23",
  role: "Староста",
  coins: 1200,
  activeCoinId: "coin_epic",
  activeVfxId: "vfx_rings",
  hideInventory: false,
  referralCode: "LEADER-REF-777",
  lastSyncedAt: 0,
  rewardedEventIds: [],
};