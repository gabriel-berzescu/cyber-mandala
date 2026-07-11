export interface Palette {
  name: string;
  background: number;
  colors: number[];
}

export const PALETTES: Palette[] = [
  {
    name: 'Neon Sunset',
    background: 0x0b0614,
    colors: [0xff2d95, 0xff6b35, 0xffd166, 0x9d4edd],
  },
  {
    name: 'Cyber Ice',
    background: 0x040a12,
    colors: [0x00e5ff, 0x4dc9ff, 0x9ef0ff, 0x3a86ff],
  },
  {
    name: 'Toxic Grid',
    background: 0x050c06,
    colors: [0x39ff14, 0xccff00, 0x00ffab, 0xf0ff5f],
  },
  {
    name: 'Vaporwave',
    background: 0x0d0716,
    colors: [0xff71ce, 0x01cdfe, 0x05ffa1, 0xb967ff],
  },
  {
    name: 'Blood Chrome',
    background: 0x100508,
    colors: [0xff1744, 0xff5252, 0xd500f9, 0xff8a80],
  },
];
