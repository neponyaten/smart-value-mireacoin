export type VfxDef = {
  id: string;
  name: string;
  price: number;
};

export const vfxMock: VfxDef[] = [
  { id: "vfx_none", name: "None", price: 0 },
  { id: "vfx_rings", name: "Rings", price: 80 },
  { id: "vfx_pulse", name: "Pulse", price: 160 },
];