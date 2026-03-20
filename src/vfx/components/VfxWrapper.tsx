"use client";

import { memo, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { BlueEnergyEffect } from "@/vfx/effects/BlueEnergyEffect";
import { VFX_MAP, type VfxCode } from "@/vfx/effects/vfxMap";
import { useLazyMount } from "@/vfx/hooks/useLazyMount";
import { useVfxEnvironment } from "@/vfx/hooks/useVfxEnvironment";

type VfxWrapperProps = {
  effect: VfxCode;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
};

export const VfxWrapper = memo(function VfxWrapper({ effect, children, className, disabled = false }: VfxWrapperProps) {
  const definition = VFX_MAP[effect] ?? VFX_MAP.blue_energy;
  const { canUseHeavyEffects } = useVfxEnvironment();
  const { ref, mounted } = useLazyMount();

  const allowAdvanced = !disabled && mounted && canUseHeavyEffects;
  const useCanvasRenderer = allowAdvanced && definition.renderer === "canvas";

  return (
    <div
      ref={ref}
      className={cn("relative isolate", definition.fallbackClassName, definition.qualityClassName, className)}
      data-vfx-code={effect}
      data-vfx-renderer={useCanvasRenderer ? "canvas" : "css"}
    >
      {children}

      {effect === "blue_energy" && <BlueEnergyEffect enabled={useCanvasRenderer} />}
    </div>
  );
});
