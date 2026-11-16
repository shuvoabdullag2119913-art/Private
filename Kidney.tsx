import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme, withAlpha } from "../theme";
import { lerp, useEase, useSpringP } from "./Anim";

/** Parametric longitudinal-view kidney (ultrasound schematic). Coordinates: centre (0,0), viewBox -450 -290 900 580. */
export type KShape = {
  pelvisRx: number;
  pelvisRy: number;
  calyxW: number;
  calyxLen: number;
  round: number; // 0 = sharp calyx tips, 1 = blunted
  merge: number; // 1 = separate borders erased → one big "balloon"
  cortex: number; // cortex thickness (px)
};

export const SHAPES: KShape[] = [
  { pelvisRx: 0, pelvisRy: 0, calyxW: 0, calyxLen: 0.35, round: 0, merge: 0, cortex: 40 }, // normal
  { pelvisRx: 64, pelvisRy: 40, calyxW: 0, calyxLen: 0.35, round: 0, merge: 0, cortex: 40 }, // G1
  { pelvisRx: 84, pelvisRy: 52, calyxW: 38, calyxLen: 0.6, round: 0, merge: 0, cortex: 40 }, // G2
  { pelvisRx: 108, pelvisRy: 68, calyxW: 54, calyxLen: 0.74, round: 1, merge: 0, cortex: 38 }, // G3
  { pelvisRx: 170, pelvisRy: 108, calyxW: 96, calyxLen: 0.6, round: 1, merge: 1, cortex: 16 }, // G4
];

export const mixShape = (a: KShape, b: KShape, t: number): KShape => ({
  pelvisRx: lerp(a.pelvisRx, b.pelvisRx, t),
  pelvisRy: lerp(a.pelvisRy, b.pelvisRy, t),
  calyxW: lerp(a.calyxW, b.calyxW, t),
  calyxLen: lerp(a.calyxLen, b.calyxLen, t),
  round: lerp(a.round, b.round, t),
  merge: lerp(a.merge, b.merge, t),
  cortex: lerp(a.cortex, b.cortex, t),
});

export const RX = 410;
export const RY = 215;
export const PEL = { x: 34, y: 12 };
const ANGLES = [-158, -118, -78, -38, 148, 108, 68];

const ellPath = (rx: number, ry: number) => `M ${-rx} 0 A ${rx} ${ry} 0 1 0 ${rx} 0 A ${rx} ${ry} 0 1 0 ${-rx} 0 Z`;

const BLOBS = Array.from({ length: 16 }, (_, i) => {
  const a = (i * 137.5 * Math.PI) / 180;
  const r = 0.25 + ((i * 53) % 70) / 100;
  return { x: Math.cos(a) * 190 * r, y: Math.sin(a) * 66 * r, r: 5 + ((i * 7) % 9), o: 0.35 + ((i * 13) % 40) / 100 };
});

type Props = {
  shape: KShape;
  uid?: string;
  drawIn?: number; // 0..1 outline draw → fill
  sinusGlow?: number; // 0..1 accent highlight of the sinus
  cortexGlow?: number; // 0..1 accent highlight of the cortex band
  heroGlow?: number; // 0..1 red rim around dilated lumen (HERO — one per frame)
  opacity?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

export const Kidney: React.FC<Props> = ({
  shape: s, uid = "k", drawIn = 1, sinusGlow = 0, cortexGlow = 0, heroGlow = 0, opacity = 1, children, style,
}) => {
  const c = theme.colors;
  const rxi = RX - s.cortex - 14;
  const ryi = RY - s.cortex - 14;

  const lumen = (fill: string, stroke: string, sw: number, key: string) => (
    <g key={key} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round">
      {s.calyxW > 0.5 &&
        ANGLES.map((deg, i) => {
          const a = (deg * Math.PI) / 180;
          const T = { x: Math.cos(a) * rxi * s.calyxLen, y: Math.sin(a) * ryi * s.calyxLen };
          const dx = T.x - PEL.x, dy = T.y - PEL.y, L = Math.hypot(dx, dy) || 1;
          const nx = -dy / L, ny = dx / L;
          const b = s.calyxW * 0.55;
          const t = lerp(2, s.calyxW * 0.46, s.round);
          return (
            <path
              key={i}
              d={`M ${PEL.x + nx * b} ${PEL.y + ny * b} L ${T.x + nx * t} ${T.y + ny * t} A ${t} ${t} 0 0 0 ${T.x - nx * t} ${T.y - ny * t} L ${PEL.x - nx * b} ${PEL.y - ny * b} Z`}
            />
          );
        })}
      {s.pelvisRx > 0.5 && <ellipse cx={PEL.x} cy={PEL.y} rx={s.pelvisRx} ry={Math.max(0.5, s.pelvisRy)} transform={`rotate(-12 ${PEL.x} ${PEL.y})`} />}
      {s.merge > 0.01 && <ellipse cx={20} cy={8} rx={Math.max(0.1, 342 * s.merge)} ry={Math.max(0.1, 160 * s.merge)} />}
    </g>
  );

  const fillOp = interpolate(drawIn, [0.35, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wall = 1 - s.merge;

  return (
    <svg viewBox="-450 -290 900 580" width="100%" height="100%" style={{ overflow: "visible", opacity, ...style }}>
      <defs>
        <radialGradient id={`${uid}-cx`} cx="50%" cy="40%" r="75%">
          <stop offset="0%" stopColor={c.us.cortexHi} />
          <stop offset="100%" stopColor={c.us.cortex} />
        </radialGradient>
        <radialGradient id={`${uid}-sn`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={c.us.sinus} />
          <stop offset="100%" stopColor={c.us.sinusDim} />
        </radialGradient>
        <clipPath id={`${uid}-clip`}>
          <ellipse cx="0" cy="0" rx={RX} ry={RY} />
        </clipPath>
        <filter id={`${uid}-org`} filterUnits="userSpaceOnUse" x="-450" y="-290" width="900" height="580">
          <feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves="2" seed="4" result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="16" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id={`${uid}-sp`} filterUnits="userSpaceOnUse" x="-450" y="-290" width="900" height="580">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="9" />
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  2.3 0 0 0 -0.92" />
        </filter>
        <filter id={`${uid}-bl`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* abdominal-wall echo layers above the kidney (ultrasound feel) */}
      {[-252, -266, -280].map((y, i) => (
        <path key={i} d={`M -330 ${y} Q 0 ${y - 40} 330 ${y}`} fill="none" stroke={c.us.sinus} strokeOpacity={0.1 + i * 0.015} strokeWidth={5 - i} opacity={fillOp} />
      ))}

      {/* outline draw-in */}
      <ellipse cx="0" cy="0" rx={RX} ry={RY} fill="none" stroke={withAlpha(c.text, 0.75)} strokeWidth="3.5" pathLength={1}
        strokeDasharray={1} strokeDashoffset={1 - Math.min(1, drawIn * 1.6)} opacity={1 - fillOp * 0.55} />

      <g opacity={fillOp}>
        {/* cortex (outer band), medulla (inner) */}
        <ellipse cx="0" cy="0" rx={RX} ry={RY} fill={`url(#${uid}-cx)`} stroke={withAlpha(c.text, 0.22)} strokeWidth="3" />
        <ellipse cx="0" cy="0" rx={RX - s.cortex} ry={RY - s.cortex} fill={c.us.medulla} />

        {/* renal sinus — bright / hyperechoic */}
        <g opacity={1 - 0.8 * s.merge} transform={`scale(${1 - 0.3 * s.merge})`}>
          <ellipse cx="0" cy="0" rx="205" ry="80" fill={`url(#${uid}-sn)`} opacity="0.92" />
          {BLOBS.map((b, i) => (
            <circle key={i} cx={b.x} cy={b.y} r={b.r} fill={c.us.sinus} opacity={b.o} />
          ))}
          {sinusGlow > 0 && (
            <>
              <ellipse cx="0" cy="0" rx="205" ry="80" fill={withAlpha(c.accent, 0.22 * sinusGlow)} />
              <ellipse cx="0" cy="0" rx="214" ry="88" fill="none" stroke={c.accent} strokeWidth="5" opacity={sinusGlow} />
            </>
          )}
        </g>

        {/* anechoic lumen (black): halo → hero rim → fill, all through one organic distortion */}
        <g filter={`url(#${uid}-org)`}>
          {lumen(c.us.sinusDim, c.us.sinusDim, 9, "halo")}
          {heroGlow > 0 && (
            <g opacity={heroGlow}>{lumen(c.primary, c.primary, 20, "hero")}</g>
          )}
          <g opacity={1}>{lumen(c.us.voidDark, c.us.voidDark, 0.5, "void")}</g>
        </g>
        {/* cover the halo where borders have been erased (grade 4) */}
        {s.merge > 0.01 && (
          <g filter={`url(#${uid}-org)`} opacity={s.merge}>
            {lumen(c.us.voidDark, c.us.voidDark, 14, "cover")}
          </g>
        )}

        {/* residual septa inside the balloon */}
        <g opacity={0.55 * s.merge} stroke={c.us.sinusDim} strokeWidth="15" strokeLinecap="round" fill="none" filter={`url(#${uid}-bl)`}>
          <path d="M -120 -50 Q -92 10 -128 66" />
          <path d="M 70 -96 Q 96 -26 56 40" />
          <path d="M 170 24 Q 134 70 168 112" />
        </g>

        {cortexGlow > 0 && (
          <path d={ellPath(RX, RY) + " " + ellPath(RX - s.cortex, RY - s.cortex)} fillRule="evenodd" fill={withAlpha(c.accent, 0.24 * cortexGlow)} stroke={c.accent} strokeWidth="2.5" strokeOpacity={0.8 * cortexGlow} />
        )}

        {/* ultrasound speckle */}
        <rect x="-450" y="-290" width="900" height="580" filter={`url(#${uid}-sp)`} clipPath={`url(#${uid}-clip)`} opacity="0.3" />
      </g>

      {children}
    </svg>
  );
};

/* ---------- Annotations (same coordinate space as Kidney) ---------- */

export const Callout: React.FC<{
  from: [number, number];
  to: [number, number];
  label: string;
  tone?: "yellow" | "red";
  delay: number;
  anchor?: "start" | "middle" | "end";
  size?: number;
}> = ({ from, to, label, tone = "yellow", delay, anchor = "middle", size = 30 }) => {
  const col = tone === "red" ? theme.colors.primary : theme.colors.accent;
  const lp = useEase(delay + 3, 14, theme.ease.out);
  const tp = useSpringP(delay, "snappy");
  const ex = from[0] + (to[0] - from[0]) * lp;
  const ey = from[1] + (to[1] - from[1]) * lp;
  const ang = (Math.atan2(to[1] - from[1], to[0] - from[0]) * 180) / Math.PI;
  const above = to[1] > from[1];
  return (
    <g>
      <line x1={from[0]} y1={from[1]} x2={ex} y2={ey} stroke={col} strokeWidth="3.5" strokeDasharray="10 8" strokeLinecap="round" opacity={Math.min(1, lp * 3)} />
      <polygon points="0,0 -24,-10 -24,10" fill={col} transform={`translate(${ex},${ey}) rotate(${ang})`} opacity={lp > 0.02 ? 1 : 0} />
      <text
        x={from[0]} y={from[1] + (above ? -16 : 38) + (1 - Math.min(1, tp)) * 10} textAnchor={anchor}
        fontFamily={theme.fonts.body} fontSize={size} fontWeight={600} fill={theme.colors.text}
        stroke={theme.colors.bg} strokeWidth="8" paintOrder="stroke" strokeLinejoin="round" opacity={Math.min(1, Math.max(0, tp))} style={{ letterSpacing: 0 }}
      >
        {label}
      </text>
    </g>
  );
};

/** Vertical thickness bracket (e.g. cortex mm). */
export const Bracket: React.FC<{ x: number; y1: number; y2: number; delay: number; label?: string; tone?: "yellow" | "red" }> = ({
  x, y1, y2, delay, label, tone = "yellow",
}) => {
  const col = tone === "red" ? theme.colors.primary : theme.colors.accent;
  const p = useEase(delay, 14, theme.ease.out);
  const tp = useSpringP(delay + 8, "snappy");
  const ym = (y1 + y2) / 2;
  const f = useCurrentFrame();
  void f;
  return (
    <g opacity={Math.min(1, p * 2)}>
      <line x1={x} y1={ym - ((y2 - y1) / 2) * p} x2={x} y2={ym + ((y2 - y1) / 2) * p} stroke={col} strokeWidth="4" strokeLinecap="round" />
      <line x1={x - 16} y1={y1} x2={x + 16} y2={y1} stroke={col} strokeWidth="4" strokeLinecap="round" opacity={p} />
      <line x1={x - 16} y1={y2} x2={x + 16} y2={y2} stroke={col} strokeWidth="4" strokeLinecap="round" opacity={p} />
      {label && (
        <text x={x + 28} y={ym + 11} fontFamily={theme.fonts.body} fontSize={32} fontWeight={700} fill={col}
          stroke={theme.colors.bg} strokeWidth="8" paintOrder="stroke" opacity={Math.min(1, Math.max(0, tp))} style={{ letterSpacing: 0 }}>
          {label}
        </text>
      )}
    </g>
  );
};
