export type StudentLB = {
  id: number;
  name: string;
  group: string;
  score: number;
  activeCoinId: string;
  activeVfxId: string;
};

export type GroupLB = {
  id: number;
  group: string;
  score: number;
  activeCoinId: string;
  activeVfxId: string;
};

export const leaderboardStudentsMock: StudentLB[] = [
  { id: 1, name: "Мария Петрова", group: "ИКБО-01-23", score: 9820, activeCoinId: "coin_epic", activeVfxId: "vfx_rings" },
  { id: 2, name: "Иван Иванов", group: "ИКБО-01-23", score: 8410, activeCoinId: "coin_common", activeVfxId: "vfx_none" },
  { id: 3, name: "Алексей Смирнов", group: "ИКБО-02-23", score: 7990, activeCoinId: "coin_rare", activeVfxId: "vfx_pulse" },
  { id: 4, name: "Дарья Кузнецова", group: "ИКБО-03-23", score: 7450, activeCoinId: "coin_legendary", activeVfxId: "vfx_none" },
];

export const leaderboardGroupsMock: GroupLB[] = [
  { id: 1, group: "ИКБО-01-23", score: 35210, activeCoinId: "coin_epic", activeVfxId: "vfx_rings" },
  { id: 2, group: "ИКБО-02-23", score: 33100, activeCoinId: "coin_rare", activeVfxId: "vfx_pulse" },
  { id: 3, group: "ИКБО-03-23", score: 31840, activeCoinId: "coin_legendary", activeVfxId: "vfx_none" },
];