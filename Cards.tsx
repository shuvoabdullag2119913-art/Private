import React from "react";
import { interpolate } from "remotion";
import { theme, withAlpha } from "../theme";
import { clampX, Entrance, useEase, useSpringP } from "./Anim";

export const GlassCard: React.FC<{
  w?: number;
  h?: number;
  pad?: number;
  glow?: string; // hero glow colour (max one per frame!)
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ w, h, pad = 32, glow, style, children }) => (
  <div
    style={{
      width: w, height: h, boxSizing: "border-box", padding: pad, borderRadius: theme.radius.card,
      background: "linear-gradient(160deg, rgba(255,255,255,0.075), rgba(255,255,255,0.022))",
      border: `1.5px solid ${glow ? withAlpha(glow, 0.7) : theme.colors.line}`,
      boxShadow: glow ? `${theme.shadow.card}, 0 0 60px ${withAlpha(glow, 0.32)}, 0 0 120px ${withAlpha(glow, 0.16)}` : theme.shadow.card,
      fontFamily: theme.fonts.body, color: theme.colors.text, ...style,
    }}
  >
    {children}
  </div>
);

export const Pill: React.FC<{
  children: React.ReactNode;
  tone?: "accent" | "hero" | "dim" | "solid";
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, tone = "accent", size = theme.type.small, style }) => {
  const m = {
    accent: { bg: withAlpha(theme.colors.accent, 0.14), fg: theme.colors.accent, bd: withAlpha(theme.colors.accent, 0.5) },
    hero: { bg: theme.colors.primary, fg: theme.colors.text, bd: theme.colors.primary },
    dim: { bg: "rgba(255,255,255,0.06)", fg: theme.colors.textDim, bd: theme.colors.line },
    solid: { bg: theme.colors.accent, fg: theme.colors.bg, bd: theme.colors.accent },
  }[tone];
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 10, padding: `${size * 0.22}px ${size * 0.7}px`,
        borderRadius: theme.radius.pill, background: m.bg, color: m.fg, border: `1.5px solid ${m.bd}`,
        fontFamily: theme.fonts.body, fontSize: size, fontWeight: 600, lineHeight: 1.3, letterSpacing: 0, ...style,
      }}
    >
      {children}
    </span>
  );
};

/** Animated check mark in a circle (drawn, not an emoji). */
export const CheckBadge: React.FC<{ delay: number; size?: number; color?: string }> = ({
  delay, size = 52, color = theme.colors.accent,
}) => {
  const p = useSpringP(delay, "bouncy");
  const d = useEase(delay + 3, 12, theme.ease.out);
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" style={{ transform: `scale(${Math.max(0, p)})`, opacity: Math.min(1, p * 2) }}>
      <circle cx="26" cy="26" r="24" fill={withAlpha(color, 0.16)} stroke={color} strokeWidth="2.5" />
      <path d="M15 27 L23 35 L38 18" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d} />
    </svg>
  );
};

/** 1-2-3-4 grade ladder (active grade glows in accent). */
export const GradeLadder: React.FC<{ active: number; delay?: number }> = ({ active, delay = 0 }) => {
  const cell = 64;
  return (
    <Entrance delay={delay} from="down" dist={30}>
      <div style={{ display: "flex", alignItems: "center", gap: 0, fontFamily: theme.fonts.body }}>
        <span style={{ fontSize: 28, fontWeight: 600, color: theme.colors.textDim, marginRight: 18 }}>Grade</span>
        {[1, 2, 3, 4].map((g, i) => {
          const isA = g === active;
          const done = g < active;
          const col = theme.colors.accent;
          return (
            <React.Fragment key={g}>
              {i > 0 && (
                <div style={{ width: 28, height: 3, background: g <= active ? withAlpha(theme.colors.text, 0.5) : theme.colors.line }} />
              )}
              <div
                style={{
                  width: cell, height: cell, borderRadius: cell / 2, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 34, fontWeight: 700, boxSizing: "border-box",
                  background: isA ? col : done ? "rgba(255,255,255,0.1)" : "transparent",
                  color: isA ? theme.colors.bg : done ? theme.colors.text : theme.colors.textDim,
                  border: `2px solid ${isA ? col : done ? withAlpha(theme.colors.text, 0.5) : theme.colors.line}`,
                  transform: `scale(${isA ? 1.14 : 1})`,
                  boxShadow: isA ? `0 0 34px ${withAlpha(col, 0.45)}` : undefined,
                }}
              >
                {g}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </Entrance>
  );
};

/** Tile heading row used inside cards. */
export const CardTitle: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({
  children, size = 46, color = theme.colors.text,
}) => (
  <div style={{ fontFamily: theme.fonts.display, fontSize: size, fontWeight: 700, lineHeight: 1.25, color, letterSpacing: 0 }}>{children}</div>
);
export const CardSub: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({
  children, size = 32, color = theme.colors.textDim,
}) => (
  <div style={{ fontFamily: theme.fonts.body, fontSize: size, fontWeight: 500, lineHeight: 1.35, color, letterSpacing: 0 }}>{children}</div>
);

export { interpolate, clampX };
