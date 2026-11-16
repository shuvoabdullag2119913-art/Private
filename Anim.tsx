import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SpringName, theme } from "../theme";

export const clampX = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** spring progress 0→1 (may overshoot) starting at `delay` */
export const useSpringP = (delay = 0, cfg: SpringName = "smooth") => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: theme.spring[cfg] });
};

/** eased progress 0→1 over `dur` frames starting at `delay` (never linear) */
export const useEase = (delay: number, dur: number, easing: (t: number) => number = theme.ease.out) => {
  const f = useCurrentFrame();
  return interpolate(f, [delay, delay + dur], [0, 1], { easing, ...clampX });
};

type Dir = "up" | "down" | "left" | "right" | "none";

/** Premium entrance: opacity + translate + scale together (+ soft blur). */
export const Entrance: React.FC<{
  delay?: number;
  from?: Dir;
  dist?: number;
  scaleFrom?: number;
  cfg?: SpringName;
  blur?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay = 0, from = "up", dist = 44, scaleFrom = 0.94, cfg = "smooth", blur = 6, style, children }) => {
  const p = useSpringP(delay, cfg);
  const op = Math.min(1, Math.max(0, p));
  const d = interpolate(p, [0, 1], [dist, 0]);
  const tx = from === "left" ? -d : from === "right" ? d : 0;
  const ty = from === "up" ? d : from === "down" ? -d : 0;
  return (
    <div
      style={{
        opacity: op,
        transform: `translate(${tx}px, ${ty}px) scale(${interpolate(p, [0, 1], [scaleFrom, 1])})`,
        filter: blur ? `blur(${interpolate(op, [0, 1], [blur, 0])}px)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Idle micro-motion for anything on screen > 2s */
export const Breathe: React.FC<{
  amp?: number;
  phase?: number;
  scale?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ amp = 4, phase = 0, scale = 0.012, style, children }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        transform: `translateY(${Math.sin((f + phase) / 30) * amp}px) scale(${1 + Math.sin((f + phase) / 22) * scale})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Abs: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ x, y, w, h, style, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, ...style }}>{children}</div>
);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** pure helper: eased 0→1 ramp from frame a over len frames */
export const ramp = (f: number, a: number, len = 14, easing: (t: number) => number = theme.ease.out) =>
  interpolate(f, [a, a + len], [0, 1], { easing, ...clampX });
