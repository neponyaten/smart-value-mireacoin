"use client";

import { motion } from "framer-motion";

type Props = {
  coinId: string;
  vfxId: string;
  onTap?: () => void;
};

function coinStyle(coinId: string) {
  // максимально просто: градиенты по редкости
  if (coinId === "coin_rare") {
    return "from-cyan-300 to-blue-500";
  }
  if (coinId === "coin_epic") {
    return "from-fuchsia-400 to-indigo-500";
  }
  if (coinId === "coin_legendary") {
    return "from-amber-300 to-orange-500";
  }
  if (coinId === "coin_artifact") {
    return "from-emerald-300 to-cyan-500";
  }
  return "from-gray-200 to-cyan-400"; // common
}

function vfxOverlay(vfxId: string) {
  // простые оверлеи без canvas
  if (vfxId === "vfx_rings") {
    return (
      <motion.div
        className="absolute inset-0 rounded-full border border-white/20"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
      />
    );
  }

  if (vfxId === "vfx_pulse") {
    return (
      <motion.div
        className="absolute inset-0 rounded-full border border-cyan-300/30"
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
      />
    );
  }

  return null; // vfx_none
}

export function CoinRenderer({ coinId, vfxId, onTap }: Props) {
  return (
    <div className="relative w-[220px] h-[220px]">
      {/* (1) glow background */}
      <div className="absolute inset-0 rounded-full blur-2xl opacity-60 bg-cyan-400/30" />

      {/* (2) coin */}
      <motion.button
        type="button"
        onClick={onTap}
        className="absolute inset-0 rounded-full"
        whileTap={{ scale: 0.94 }}
        aria-label="coin"
      >
        <div
          className={[
            "absolute inset-0 rounded-full",
            "bg-gradient-to-br",
            coinStyle(coinId),
            "shadow-neon",
            "border border-white/10",
          ].join(" ")}
        />
        {/* легкий блик */}
        <div className="absolute top-6 left-7 w-24 h-24 rounded-full bg-white/10 blur-md" />
        <div className="absolute bottom-7 right-7 w-16 h-16 rounded-full bg-black/20 blur-md" />
      </motion.button>

      {/* (3) vfx overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {vfxOverlay(vfxId)}
      </div>
    </div>
  );
}