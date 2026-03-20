"use client";

import { useAppStore } from "@/store/useAppStore";
import { coinsMock } from "@/mocks/coins";
import { vfxMock } from "@/mocks/vfx";

export function InventoryBar() {
  const user = useAppStore((s) => s.user);
  const activeCoin = user?.activeCoinId;
  const activeVfx = user?.activeVfxId;
  const setActiveCoin = useAppStore((s) => s.setActiveCoin);
  const setActiveVfx = useAppStore((s) => s.setActiveVfx);

  return (
    <div className="glass w-full max-w-md rounded-2xl p-3 border border-white/10">
      <div className="text-xs text-gray-400 mb-2">Инвентарь</div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {coinsMock.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCoin(c.id)}
            className={[
              "px-3 py-2 rounded-xl text-xs whitespace-nowrap border transition",
              c.id === activeCoin
                ? "bg-neon text-black border-transparent"
                : "bg-black/40 text-gray-300 border-white/10",
            ].join(" ")}
          >
            {c.rarity}
          </button>
        ))}
      </div>

      <div className="h-px bg-white/10 my-3" />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {vfxMock.map((v) => (
          <button
            key={v.id}
            onClick={() => setActiveVfx(v.id)}
            className={[
              "px-3 py-2 rounded-xl text-xs whitespace-nowrap border transition",
              v.id === activeVfx
                ? "bg-neon text-black border-transparent"
                : "bg-black/40 text-gray-300 border-white/10",
            ].join(" ")}
          >
            {v.name}
          </button>
        ))}
      </div>
    </div>
  );
}