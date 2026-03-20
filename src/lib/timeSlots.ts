export type BreakSlot = {
  key: string;
  start: string; // "HH:MM"
  end: string;   // "HH:MM"
  title: string;
  reward: number;
};

export const BREAK_SLOTS: BreakSlot[] = [
  { key: "b1", start: "09:00", end: "10:30", title: "Перерыв 1", reward: 10 },
  { key: "b2", start: "10:40", end: "12:10", title: "Перерыв 2", reward: 10 },
  { key: "b3", start: "12:40", end: "14:10", title: "Перерыв 3", reward: 10 },
  { key: "b4", start: "14:20", end: "15:50", title: "Перерыв 4", reward: 10 },
  { key: "b5", start: "16:20", end: "17:50", title: "Перерыв 5", reward: 10 },
  { key: "b6", start: "18:00", end: "19:30", title: "Перерыв 6", reward: 10 },
];

function toMin(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function getActiveBreakSlot(now = new Date()): BreakSlot | null {
  const cur = now.getHours() * 60 + now.getMinutes();
  for (const s of BREAK_SLOTS) {
    if (cur >= toMin(s.start) && cur <= toMin(s.end)) return s;
  }
  return null;
}