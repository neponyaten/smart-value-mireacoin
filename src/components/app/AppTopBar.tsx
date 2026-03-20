"use client";

import Image from "next/image";
import { useAppStore } from "@/store/useAppStore";

export function AppTopBar() {
  const user = useAppStore((s) => s.user);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden">
          {/* если нет лого — оставь букву M */}
          <span className="text-neon font-bold">M</span>
        </div>
        <div className="text-white font-semibold">MireaCoin</div>
      </div>

      <div className="px-4 py-2 rounded-full bg-black/35 border border-white/10 text-sm">
        Баланс: <span className="text-neon font-semibold">{user?.coins ?? 0} MC</span> →
      </div>
    </div>
  );
}