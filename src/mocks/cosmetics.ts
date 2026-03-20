export type Rarity = "Common" | "Rare" | "Epic" | "Legendary" | "Artifact";

export type CoinDef = {
  id: string;
  name: string;
  rarity: Rarity;
};

export type VfxDef = {
  id: string;
  name: string;
};

export const COINS: CoinDef[] = [
  { id: "coin_common", name: "MireaCoin (Common)", rarity: "Common" },
  { id: "coin_rare", name: "MireaCoin (Rare)", rarity: "Rare" },
  { id: "coin_epic", name: "MireaCoin (Epic)", rarity: "Epic" },
  { id: "coin_legendary", name: "MireaCoin (Legendary)", rarity: "Legendary" },
  { id: "coin_artifact", name: "MireaCoin (Artifact)", rarity: "Artifact" },
];

export const VFX: VfxDef[] = [
  { id: "vfx_none", name: "None" },
  { id: "vfx_rings", name: "Rings" },
  { id: "vfx_pulse", name: "Pulse" },
  { id: "vfx_lightning", name: "Lightning" },
];

export const DEFAULT_OWNED_COINS = ["coin_common"];
export const DEFAULT_OWNED_VFX = ["vfx_none"];