// theme.ts — single source of truth. NEVER inline colors/easings/springs in components.
// Scheme: "Graphite Alert" (user-selected #6)
import { Easing } from "remotion";

export const withAlpha = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
};

export const theme = {
  colors: {
    bg: "#0E0E10",
    bgAlt: "#16161A",
    surface: "#1D1D22",
    surfaceHi: "#2A2A31",
    primary: "#EF4444", // HERO — severity / dilation. Max one hero element per frame.
    accent: "#FACC15", // labels, highlights, normal-structure arrows
    text: "#FAFAFA",
    textDim: "#A1A1AA",
    line: "rgba(250,250,250,0.12)",
    glow: "rgba(239,68,68,0.42)",
    accentGlow: "rgba(250,204,21,0.30)",
    // Ultrasound greyscale ramp (neutral tones of this scheme)
    us: {
      voidDark: "#030304",
      cortex: "#3E3E45",
      cortexHi: "#585862",
      medulla: "#232328",
      sinus: "#E4E4E7",
      sinusDim: "#9A9AA3",
    },
  },
  fonts: {
    display: '"Hind Siliguri", sans-serif',
    body: '"Hind Siliguri", sans-serif',
  },
  type: { hero: 190, h1: 120, h2: 84, h3: 56, body: 42, label: 32, small: 28 },
  radius: { card: 28, inner: 18, pill: 999 },
  shadow: {
    card: "0 30px 70px -28px rgba(0,0,0,0.75), 0 2px 0 rgba(255,255,255,0.04) inset",
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
    slow: { damping: 26, stiffness: 50, mass: 1.2 },
  },
} as const;

export type SpringName = keyof typeof theme.spring;
