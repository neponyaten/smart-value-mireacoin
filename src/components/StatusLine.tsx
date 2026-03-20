"use client";

import { useEffect, useMemo, useState } from "react";

function getStatusByTime(date: Date) {
  const h = date.getHours();
  const m = date.getMinutes();
  const total = h * 60 + m;

  // простая логика по времени (пример)
  // 09:00-10:30 пара 1
  // 10:40-12:10 пара 2
  // 12:20-13:50 пара 3
  // 14:00-15:30 пара 4
  // иначе отдых

  const pairs = [
    { from: 9 * 60, to: 10 * 60 + 30, text: "Фармим знания на 1-й паре" },
    { from: 10 * 60 + 40, to: 12 * 60 + 10, text: "Фармим знания на 2-й паре" },
    { from: 12 * 60 + 20, to: 13 * 60 + 50, text: "Фармим знания на 3-й паре" },
    { from: 14 * 60, to: 15 * 60 + 30, text: "Фармим знания на 4-й паре" },
  ];

  const hit = pairs.find((p) => total >= p.from && total <= p.to);
  if (hit) return hit.text;

  if (total >= 16 * 60 && total <= 18 * 60) return "Катаем проекты в лабе";
  if (total >= 12 * 60 && total <= 14 * 60) return "Восстанавливаем ману в столовой";

  return "Режим свободного фарма";
}

export function StatusLine() {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 10_000);
    return () => clearInterval(t);
  }, []);

  const text = useMemo(() => getStatusByTime(now), [now]);

  return (
    <div className="text-sm text-gray-300 text-center mt-4">
      {text}
    </div>
  );
}