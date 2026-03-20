export type VfxCode = "blue_energy" | "gold_fire" | "electric";

export type VfxRendererType = "css" | "canvas" | "webgl";

export type VfxDefinition = {
  code: VfxCode;
  renderer: VfxRendererType;
  fallbackClassName: string;
  qualityClassName?: string;
};

export const VFX_MAP: Record<VfxCode, VfxDefinition> = {
  blue_energy: {
    code: "blue_energy",
    renderer: "canvas",
    fallbackClassName:
      "shadow-[0_0_24px_rgba(34,211,238,0.35),0_0_70px_rgba(14,116,144,0.25)] before:absolute before:inset-[-6%] before:rounded-full before:bg-[radial-gradient(circle,rgba(34,211,238,0.22)_0%,rgba(8,47,73,0.08)_45%,transparent_80%)] before:blur-2xl before:content-['']",
    qualityClassName: "[filter:drop-shadow(0_0_48px_rgba(34,211,238,0.45))]",
  },
  gold_fire: {
    code: "gold_fire",
    renderer: "css",
    fallbackClassName:
      "shadow-[0_0_20px_rgba(251,191,36,0.35),0_0_56px_rgba(234,88,12,0.2)] before:absolute before:inset-[-4%] before:rounded-full before:bg-[radial-gradient(circle,rgba(251,191,36,0.25)_0%,rgba(180,83,9,0.08)_48%,transparent_80%)] before:blur-xl before:content-['']",
  },
  electric: {
    code: "electric",
    renderer: "css",
    fallbackClassName:
      "shadow-[0_0_22px_rgba(56,189,248,0.35),0_0_64px_rgba(129,140,248,0.2)] before:absolute before:inset-[-5%] before:rounded-full before:bg-[conic-gradient(from_180deg_at_50%_50%,rgba(34,211,238,0.22),rgba(129,140,248,0.2),rgba(34,211,238,0.22))] before:opacity-60 before:blur-xl before:animate-[spin_4.5s_linear_infinite] before:content-['']",
  },
};
