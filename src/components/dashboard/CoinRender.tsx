"use client";

import { useAppStore } from "@/store/useAppStore";
import Image from "next/image";
import { motion } from "framer-motion";
import { useMemo } from "react";
import type { CoinItem, VfxItem } from "@/lib/types/domain";
import { coinCatalog, vfxCatalog } from "@/lib/mock/data";
import { VfxWrapper } from "@/vfx/components";
import type { VfxCode } from "@/vfx/effects/vfxMap";

export function CoinRender() {
  const user = useAppStore((s) => s.user);

  const coins = useMemo(() => coinCatalog as (CoinItem & { id: string })[], []);
  const coin = useMemo(() => coins.find((c) => c.id === user?.activeCoinId) ?? coins[0], [coins, user?.activeCoinId]);

  const vfx = useMemo(() => {
    const catalog = vfxCatalog as (VfxItem & { id: string })[];
    return catalog.find((v) => v.id === user?.activeVfxId) ?? catalog[0];
  }, [user?.activeVfxId]);

  const effectCode = useMemo<VfxCode>(() => {
    if (vfx.slug === "pulse") {
      return "electric";
    }
    if (vfx.slug === "nebula") {
      return "gold_fire";
    }
    return "blue_energy";
  }, [vfx.slug]);

  return (
    <div className="mt-8 flex items-center justify-center">
      <div className="relative w-full aspect-[1/1.08] max-w-sm flex items-center justify-center">
        <div className={`absolute inset-0 rounded-full blur-3xl ${coin.glow}`} />
        <div className="absolute inset-12 rounded-full blur-2xl opacity-60 from-slate-600 to-slate-800 bg-gradient-to-br" />

        <VfxWrapper effect={effectCode} className="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] rounded-full">
          <motion.button
            type="button"
            className="relative w-full h-full rounded-full"
            animate={{ y: [-12, 12] }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 2.4 }}
            whileTap={{ scale: 0.93 }}
          >
            <Image src={coin.image} alt={coin.name} fill priority className="object-contain" />
          </motion.button>
        </VfxWrapper>

        <div className="absolute bottom-16 w-[380px] max-w-[96%] h-[110px] rounded-full border border-cyan-200/10 bg-black/10 blur-[0.3px]" />
        <div className="absolute bottom-20 w-[320px] max-w-[86%] h-[24px] rounded-full bg-cyan-300/20 blur-2xl" />
      </div>
    </div>
  );
}
