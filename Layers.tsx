import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme, withAlpha } from "../theme";
import { TOTAL_FRAMES } from "../timing";

// Layer 1 — background mesh (never a flat colour)
export const BgMesh: React.FC = () => {
  const f = useCurrentFrame();
  const d1 = Math.sin(f / 55) * 60;
  const d2 = Math.cos(f / 70) * 50;
  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <div
        style={{
          position: "absolute", width: 1300, height: 1300, borderRadius: "50%", top: -640, left: -380 + d1,
          filter: "blur(70px)",
          background: `radial-gradient(circle, ${withAlpha(theme.colors.primary, 0.16)}, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: "absolute", width: 1000, height: 1000, borderRadius: "50%", bottom: -520, right: -300 - d2,
          filter: "blur(80px)",
          background: `radial-gradient(circle, ${withAlpha(theme.colors.accent, 0.07)}, transparent 65%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${withAlpha(theme.colors.text, 0.07)} 1.5px, transparent 1.7px)`,
          backgroundSize: "48px 48px",
          backgroundPosition: `${-f * 0.3}px ${f * 0.2}px`,
          WebkitMaskImage: "radial-gradient(ellipse at center, black 25%, transparent 78%)",
          maskImage: "radial-gradient(ellipse at center, black 25%, transparent 78%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Layer 4 — colour grade (above content, below grain)
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: theme.colors.primary, mixBlendMode: "soft-light", opacity: 0.14 }} />
    <AbsoluteFill
      style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.12), transparent 26%, transparent 74%, rgba(0,0,0,0.22))" }}
    />
  </AbsoluteFill>
);

// Layer 5a — procedural film grain
export const Grain: React.FC = () => {
  const f = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none", backgroundImage: noise, backgroundSize: "220px",
        backgroundPosition: `${(f * 7) % 220}px ${(f * 13) % 220}px`, opacity: 0.06, mixBlendMode: "overlay",
      }}
    />
  );
};

// Layer 5b — vignette (topmost)
export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.34) 100%)" }}
  />
);

// Persistent HUD: tiny title + thin progress line
export const Hud: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, TOTAL_FRAMES], [0, 1], { easing: theme.ease.inOut });
  const o = interpolate(f, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute", left: 96, top: 44, opacity: o * 0.75, display: "flex", alignItems: "center", gap: 14,
          fontFamily: theme.fonts.body, fontSize: 26, fontWeight: 600, color: theme.colors.textDim,
        }}
      >
        <span style={{ width: 12, height: 12, borderRadius: 6, background: theme.colors.accent, display: "inline-block" }} />
        Hydronephrosis · Grades
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 5, background: "rgba(255,255,255,0.05)" }}>
        <div style={{ width: `${p * 100}%`, height: "100%", background: theme.colors.accent, opacity: 0.8 }} />
      </div>
    </AbsoluteFill>
  );
};
