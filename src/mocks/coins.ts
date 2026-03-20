export type CoinRarity = "Common" | "Rare" | "Epic" | "Legendary" | "Artifact";

export type CoinDef = {
  id: string;
  name: string;
  rarity: CoinRarity;
  price: number; // для shop (в токенах)
};

export const coinsMock: CoinDef[] = [
  { id: "coin_common", name: "Mirea Common", rarity: "Common", price: 0 },
  { id: "coin_rare", name: "Neon Rare", rarity: "Rare", price: 120 },
  { id: "coin_epic", name: "Cyber Epic", rarity: "Epic", price: 350 },
  { id: "coin_legendary", name: "Legend Core", rarity: "Legendary", price: 900 },
  { id: "coin_artifact", name: "Artifact Prism", rarity: "Artifact", price: 2000 },
];