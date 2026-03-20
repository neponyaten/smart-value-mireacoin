export type AttendanceEvent = {
  id: string;
  title: string;
  reward: number;
  ts: number;
};

const now = Date.now();

export const attendanceEventsMock: AttendanceEvent[] = [
  {
    id: "evt_1",
    title: "Пара 1",
    reward: 15,
    ts: now - 1000 * 60 * 60 * 3,
  },
  {
    id: "evt_2",
    title: "Пара 2",
    reward: 20,
    ts: now - 1000 * 60 * 60 * 2,
  },
];