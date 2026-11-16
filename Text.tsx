import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { theme } from "../theme";
import { clampX, useEase, useSpringP } from "./Anim";

/** Word-by-word staggered reveal. Splits ONLY on spaces (never inside Bengali clusters). */
export const WordReveal: React.FC<{
  text: string;
  delay?: number;
  per?: number;
  size?: number;
  weight?: number;
  color?: string;
  accent?: string[]; // words rendered in accent colour
  accentColor?: string;
  align?: "flex-start" | "center" | "flex-end";
  gapPx?: number;
  lineHeight?: number;
  maxWidth?: number;
  style?: React.CSSProperties;
}> = ({
  text, delay = 0, per = 4, size = theme.type.h2, weight = 700, color = theme.colors.text,
  accent = [], accentColor = theme.colors.accent, align = "flex-start", gapPx, lineHeight = 1.3, maxWidth, style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        display: "flex", flexWrap: "wrap", columnGap: gapPx ?? Math.round(size * 0.26), rowGap: 0,
        justifyContent: align, fontFamily: theme.fonts.display, fontSize: size, fontWeight: weight,
        lineHeight, letterSpacing: 0, color, maxWidth, ...style,
      }}
    >
      {text.split(" ").map((w, i) => {
        const p = spring({ frame: frame - delay - i * per, fps, config: theme.spring.snappy });
        const o = Math.min(1, Math.max(0, p));
        return (
          <span
            key={i}
            style={{
              display: "inline-block", opacity: o, color: accent.includes(w) ? accentColor : color,
              transform: `translateY(${interpolate(p, [0, 1], [34, 0])}px) scale(${interpolate(p, [0, 1], [0.94, 1])})`,
              filter: `blur(${interpolate(o, [0, 1], [7, 0])}px)`,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Line mask reveal: text rises out of a clipped box. Padding protects Bengali matras. */
export const LineMask: React.FC<{
  children: React.ReactNode;
  delay?: number;
  size?: number;
  weight?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, size = theme.type.h2, weight = 700, color = theme.colors.text, style }) => {
  const p = useSpringP(delay, "smooth");
  return (
    <div style={{ overflow: "hidden", paddingTop: size * 0.16, paddingBottom: size * 0.2, ...style }}>
      <div
        style={{
          fontFamily: theme.fonts.display, fontSize: size, fontWeight: weight, color, lineHeight: 1.25, letterSpacing: 0,
          transform: `translateY(${interpolate(p, [0, 1], [112, 0])}%)`, opacity: Math.min(1, p * 1.6),
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Highlight sweep behind a phrase (accent bar sweeps left→right, text flips to dark). */
export const HighlightWord: React.FC<{
  children: React.ReactNode;
  delay: number;
  size?: number;
  weight?: number;
  idleColor?: string;
  barColor?: string;
}> = ({ children, delay, size = theme.type.h2, weight = 700, idleColor = theme.colors.text, barColor = theme.colors.accent }) => {
  const p = useEase(delay, 14, theme.ease.out);
  return (
    <span style={{ position: "relative", display: "inline-block", padding: `0 ${size * 0.18}px` }}>
      <span
        style={{
          position: "absolute", left: 0, right: 0, top: "10%", bottom: "6%", background: barColor,
          borderRadius: size * 0.16, transformOrigin: "left center", transform: `scaleX(${p})`,
        }}
      />
      <span
        style={{
          position: "relative", fontFamily: theme.fonts.display, fontSize: size, fontWeight: weight,
          color: p > 0.45 ? theme.colors.bg : idleColor, letterSpacing: 0,
        }}
      >
        {children}
      </span>
    </span>
  );
};

/** Counter roll — only for numbers that appear in the script. */
export const CounterRoll: React.FC<{
  to: number;
  delay?: number;
  size?: number;
  color?: string;
  weight?: number;
  minWidth?: number;
}> = ({ to, delay = 0, size = 80, color = theme.colors.text, weight = 700, minWidth }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 30, stiffness: 70, mass: 1 } });
  const v = Math.round(interpolate(p, [0, 1], [0, to]));
  return (
    <span
      style={{
        display: "inline-block", minWidth, textAlign: "center", fontFamily: theme.fonts.display, fontSize: size,
        fontWeight: weight, color, fontVariantNumeric: "tabular-nums", letterSpacing: 0,
      }}
    >
      {v}
    </span>
  );
};

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export { clampX };
