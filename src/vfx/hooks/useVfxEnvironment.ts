"use client";

import { useEffect, useState } from "react";

type VfxEnvironment = {
  isMobile: boolean;
  reducedMotion: boolean;
  canUseHeavyEffects: boolean;
};

const MOBILE_QUERY = "(max-width: 768px), (pointer: coarse)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function useVfxEnvironment(): VfxEnvironment {
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mobileMq = window.matchMedia(MOBILE_QUERY);
    const motionMq = window.matchMedia(REDUCED_MOTION_QUERY);

    const sync = () => {
      setIsMobile(mobileMq.matches);
      setReducedMotion(motionMq.matches);
    };

    sync();

    mobileMq.addEventListener("change", sync);
    motionMq.addEventListener("change", sync);

    return () => {
      mobileMq.removeEventListener("change", sync);
      motionMq.removeEventListener("change", sync);
    };
  }, []);

  return {
    isMobile,
    reducedMotion,
    canUseHeavyEffects: !isMobile && !reducedMotion,
  };
}
