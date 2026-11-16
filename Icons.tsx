import React from "react";
import { theme } from "../theme";
import { useEase } from "./Anim";

/** Stroke-drawn icon: every path uses pathLength=1 so it can "draw in". 100×100 viewBox. */
export const DrawIcon: React.FC<{
  paths: string[];
  delay?: number;
  size?: number;
  color?: string;
  stroke?: number;
  extra?: React.ReactNode;
}> = ({ paths, delay = 0, size = 160, color = theme.colors.text, stroke = 4.5, extra }) => {
  const p = useEase(delay, 26, theme.ease.inOut);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      {paths.map((d, i) => (
        <path key={i} d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, Math.max(0, p * (1 + i * 0.08)))} />
      ))}
      {extra}
    </svg>
  );
};

export const ICON = {
  // capsule (analgesic)
  pill: ["M31 40 H69 A10 10 0 0 1 69 60 H31 A10 10 0 0 1 31 40 Z", "M50 40 V60", "M38 47 H42"],
  // shield + cross (antibiotic)
  shield: ["M50 12 L81 25 V50 C81 70 67 82 50 89 C33 82 19 70 19 50 V25 Z", "M50 36 V64", "M36 50 H64"],
  droplet: ["M50 12 C50 12 24 46 24 62 A26 26 0 0 0 76 62 C76 46 50 12 50 12 Z", "M38 64 C38 71 43 76 49 77"],
  thermometer: ["M42 60 V24 A8 8 0 0 1 58 24 V60 A16 16 0 1 1 42 60 Z", "M62 30 H70", "M62 42 H70", "M50 40 V68"],
  // torso with flank pain rays
  flank: [
    "M40 20 A10 10 0 1 1 60 20 A10 10 0 1 1 40 20",
    "M26 90 V60 C26 46 36 40 50 40 C64 40 74 46 74 60 V90",
    "M78 52 L92 46", "M80 62 L96 62", "M78 72 L90 80",
  ],
  // kidney with X (failure)
  kidneyX: [
    "M58 14 C80 16 86 44 72 58 C64 66 68 78 58 86 C45 94 26 86 26 64 C26 42 38 12 58 14 Z",
    "M42 40 L66 64", "M66 40 L42 64",
  ],
  paw: [
    "M50 52 C36 52 28 64 30 74 C32 84 42 84 50 80 C58 84 68 84 70 74 C72 64 64 52 50 52 Z",
    "M22 46 A7 10 0 1 1 22 45.9", "M38 30 A7 11 0 1 1 38 29.9", "M62 30 A7 11 0 1 1 62 29.9", "M78 46 A7 10 0 1 1 78 45.9",
  ],
  arrow: ["M20 50 H78", "M60 32 L80 50 L60 68"],
  warn: ["M50 14 L90 84 H10 Z", "M50 40 V60", "M50 72 V73"],
};
