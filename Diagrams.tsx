import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme, withAlpha } from "../theme";
import { lerp, ramp } from "./Anim";

const c = theme.colors;
type Seg = [number, number][]; // cubic bezier: p0,p1,p2,p3

export const pointOn = (segs: Seg[], s: number): [number, number] => {
  const n = segs.length;
  const k = Math.min(n - 1, Math.floor(s * n));
  const t = s * n - k;
  const [p0, p1, p2, p3] = segs[k];
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
};

export const Stone: React.FC<{ x: number; y: number; k?: number; broken?: number }> = ({ x, y, k = 1, broken = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${k})`}>
    {broken <= 0.01 ? (
      <polygon points="-18,-12 4,-22 22,-6 16,16 -6,22 -22,6" fill={c.us.cortexHi} stroke={c.text} strokeWidth="3" strokeLinejoin="round" />
    ) : (
      [[-16, -10, 0], [14, -12, 1], [-6, 14, 2], [20, 10, 3]].map(([dx, dy, i]) => (
        <polygon
          key={i}
          transform={`translate(${dx * (1 + broken * 1.4)},${dy * (1 + broken * 1.4)}) scale(${0.42 * (1 - broken * 0.4)})`}
          points="-18,-12 4,-22 22,-6 16,16 -6,22 -22,6" fill={c.us.cortexHi} stroke={c.text} strokeWidth="4" strokeLinejoin="round"
        />
      ))
    )}
  </g>
);

export const KidneyMini: React.FC<{
  cx: number; cy: number; rx: number; ry: number; rot?: number; pelvis?: number; // pelvis 0..1 dilation
}> = ({ cx, cy, rx, ry, rot = 0, pelvis = 0.3 }) => (
  <g transform={`translate(${cx},${cy}) rotate(${rot})`}>
    <ellipse rx={rx} ry={ry} fill={c.us.cortexHi} stroke={withAlpha(c.text, 0.25)} strokeWidth="3" />
    <ellipse rx={rx * 0.84} ry={ry * 0.8} fill={c.us.medulla} />
    <ellipse rx={rx * 0.52} ry={ry * 0.36} fill={c.us.sinus} opacity="0.85" />
    <ellipse cx={rx * 0.06} cy={ry * 0.04} rx={rx * (0.06 + 0.14 * pelvis)} ry={ry * (0.08 + 0.2 * pelvis)} fill={c.us.voidDark} />
  </g>
);

const tube = (d: string, w = 26) => (
  <>
    <path d={d} fill="none" stroke={c.line} strokeWidth={w + 4} strokeLinecap="round" />
    <path d={d} fill="none" stroke={c.surfaceHi} strokeWidth={w} strokeLinecap="round" />
  </>
);

const Drops: React.FC<{ segs: Seg[]; t0: number; n?: number; speed?: number; stop?: number }> = ({ segs, t0, n = 6, speed = 0.011, stop = 1 }) => {
  const f = useCurrentFrame();
  if (f < t0) return null;
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const s = (((f - t0) * speed + i / n) % 1) * stop;
        const [x, y] = pointOn(segs, Math.min(0.999, s));
        const o = interpolate(f - t0, [0, 10], [0, 0.95], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <circle key={i} cx={x} cy={y} r={7.5} fill={c.accent} opacity={o} />;
      })}
    </>
  );
};

const T = (x: number, y: number, s: string, anchor: "start" | "middle" | "end" = "middle") => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={theme.fonts.body} fontSize="28" fontWeight="500" fill={c.textDim} style={{ letterSpacing: 0 }}>{s}</text>
);

/* ---------------- DJ stenting ---------------- */
const DJ: Seg[] = [[[190, 150], [240, 230], [330, 215], [420, 262]], [[420, 262], [500, 308], [560, 290], [600, 312]]];
const DJ_D = "M190 150 C240 230 330 215 420 262 C500 308 560 290 600 312";
export const DJStent: React.FC<{ t0: number; tFlow: number }> = ({ t0, tFlow }) => {
  const f = useCurrentFrame();
  const draw = ramp(f, t0, 34, theme.ease.inOut);
  return (
    <svg viewBox="0 0 760 400" width="100%" height="100%" style={{ overflow: "visible" }}>
      {tube(DJ_D)}
      <ellipse cx="650" cy="322" rx="92" ry="68" fill={c.surface} stroke={c.line} strokeWidth="3" />
      <KidneyMini cx={150} cy={110} rx={128} ry={74} rot={-12} pelvis={0.8} />
      <path d={DJ_D} fill="none" stroke={c.accent} strokeWidth="6" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      {/* pigtail curls (double-J) */}
      <path d="M190 150 C208 140 218 118 202 104 C188 92 166 102 170 122" fill="none" stroke={c.accent} strokeWidth="6" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ramp(f, t0 + 26, 14)} />
      <path d="M600 312 C628 314 646 330 634 344 C620 358 598 346 606 330" fill="none" stroke={c.accent} strokeWidth="6" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ramp(f, t0 + 30, 14)} />
      <Drops segs={DJ} t0={tFlow} stop={0.95} />
      {T(150, 232, "Kidney")}
      {T(660, 410 - 18, "Bladder")}
    </svg>
  );
};

/* ---------------- PCN ---------------- */
const PCNP: Seg[] = [[[260, 168], [260, 100], [260, 60], [260, 28]], [[260, 28], [330, 28], [440, 28], [540, 28]], [[540, 28], [540, 50], [540, 70], [540, 96]]];
const PCN_D = "M260 168 L260 28 L540 28 L540 100";
export const PCN: React.FC<{ t0: number; tFlow: number }> = ({ t0, tFlow }) => {
  const f = useCurrentFrame();
  const draw = ramp(f, t0, 34, theme.ease.inOut);
  const fill = ramp(f, tFlow, 120, theme.ease.inOut);
  return (
    <svg viewBox="0 0 760 400" width="100%" height="100%" style={{ overflow: "visible" }}>
      {/* skin */}
      <path d="M40 66 Q 250 52 460 66" fill="none" stroke={withAlpha(c.text, 0.28)} strokeWidth="12" strokeLinecap="round" />
      {T(86, 106, "Skin", "start")}
      <KidneyMini cx={260} cy={226} rx={150} ry={84} rot={0} pelvis={0.8} />
      <path d={PCN_D} fill="none" stroke={c.accent} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      {/* bag */}
      <clipPath id="bag"><rect x="480" y="100" width="120" height="230" rx="30" /></clipPath>
      <rect x="480" y="100" width="120" height="230" rx="30" fill={c.surface} stroke={c.line} strokeWidth="3" />
      <rect x="480" y={330 - 150 * fill} width="120" height="230" fill={withAlpha(c.accent, 0.3)} clipPath="url(#bag)" />
      <Drops segs={PCNP} t0={tFlow} stop={0.96} speed={0.012} />
      {T(260, 352, "Kidney")}
      {T(540, 372, "Drainage", "middle")}
    </svg>
  );
};

/* ---------------- URS ---------------- */
export const URS: React.FC<{ t0: number }> = ({ t0 }) => {
  const f = useCurrentFrame();
  const a = ramp(f, t0, 60, theme.ease.inOut);
  const gone = ramp(f, t0 + 64, 18);
  const sc: Seg[] = [[[360, 252], [330, 220], [290, 190], [250, 160]]];
  const [hx, hy] = pointOn(sc, a);
  return (
    <svg viewBox="0 0 480 300" width="100%" height="100%" style={{ overflow: "visible" }}>
      {tube("M200 130 C250 190 300 190 360 230 C380 244 400 250 410 256", 20)}
      <ellipse cx="410" cy="262" rx="64" ry="48" fill={c.surface} stroke={c.line} strokeWidth="3" />
      <KidneyMini cx={150} cy={96} rx={116} ry={66} rot={-14} pelvis={0.4} />
      <Stone x={168} y={112} k={1 - gone} />
      <polyline points={`410,262 ${hx},${hy}`} fill="none" stroke={c.accent} strokeWidth="5" strokeLinecap="round" opacity="0.001" />
      <path d={`M${sc[0][0][0]} ${sc[0][0][1]} L${hx} ${hy}`} stroke={c.accent} strokeWidth="6" strokeLinecap="round" fill="none" />
      <circle cx={hx} cy={hy} r={9} fill={c.accent} />
    </svg>
  );
};

/* ---------------- PCNL ---------------- */
export const PCNL: React.FC<{ t0: number }> = ({ t0 }) => {
  const f = useCurrentFrame();
  const a = ramp(f, t0, 44, theme.ease.inOut);
  const gone = ramp(f, t0 + 50, 18);
  return (
    <svg viewBox="0 0 480 300" width="100%" height="100%" style={{ overflow: "visible" }}>
      <path d="M40 40 Q 240 26 440 40" fill="none" stroke={withAlpha(c.text, 0.28)} strokeWidth="10" strokeLinecap="round" />
      <KidneyMini cx={240} cy={186} rx={150} ry={84} pelvis={0.5} />
      <Stone x={252} y={192} k={1 - gone} />
      <path d={`M240 24 L240 ${24 + 152 * a}`} stroke={c.accent} strokeWidth="9" strokeLinecap="round" fill="none" />
      <circle cx={240} cy={24 + 152 * a} r={10} fill={c.accent} />
    </svg>
  );
};

/* ---------------- ESWL ---------------- */
export const ESWL: React.FC<{ t0: number }> = ({ t0 }) => {
  const f = useCurrentFrame();
  const broken = ramp(f, t0 + 40, 18);
  const src: [number, number] = [452, 286];
  return (
    <svg viewBox="0 0 480 300" width="100%" height="100%" style={{ overflow: "visible" }}>
      <KidneyMini cx={220} cy={134} rx={150} ry={84} pelvis={0.4} />
      <Stone x={232} y={142} broken={broken} />
      {f > t0 &&
        [0, 1, 2].map((k) => {
          const r = (((f - t0) * 3.6 + k * 70) % 240) + 8;
          const o = interpolate(r, [8, 240], [0.9, 0.05]);
          return <circle key={k} cx={src[0]} cy={src[1]} r={r} fill="none" stroke={c.accent} strokeWidth="4" opacity={o} strokeDasharray="14 10" />;
        })}
      <circle cx={src[0]} cy={src[1]} r="12" fill={c.accent} />
    </svg>
  );
};

/* ---------------- TURP ---------------- */
export const TURP: React.FC<{ t0: number }> = ({ t0 }) => {
  const f = useCurrentFrame();
  const open = ramp(f, t0 + 40, 40, theme.ease.inOut);
  const w = lerp(5, 30, open);
  return (
    <svg viewBox="0 0 760 400" width="100%" height="100%" style={{ overflow: "visible" }}>
      <ellipse cx="380" cy="96" rx="130" ry="82" fill={c.surface} stroke={c.line} strokeWidth="3" />
      {/* prostate */}
      <ellipse cx="380" cy="238" rx="112" ry="82" fill={c.us.cortex} stroke={withAlpha(c.text, 0.25)} strokeWidth="3" />
      {/* urethra (narrow → open) */}
      <rect x={380 - w / 2} y="176" width={w} height="224" rx={w / 2} fill={c.us.voidDark} />
      <rect x={380 - 40} y="150" width="80" height="40" rx="20" fill={c.us.voidDark} opacity="0.0" />
      {/* resectoscope */}
      <path d={`M380 400 L380 ${400 - 190 * ramp(f, t0, 36, theme.ease.inOut)}`} stroke={c.accent} strokeWidth="6" strokeLinecap="round" fill="none" opacity={1 - open * 0.8} />
      {T(380, 108, "Bladder")}
      {T(560, 250, "Prostate", "start")}
    </svg>
  );
};

/* ---------------- Pyeloplasty ---------------- */
export const Pyelo: React.FC<{ t0: number }> = ({ t0 }) => {
  const f = useCurrentFrame();
  const open = ramp(f, t0 + 36, 40, theme.ease.inOut);
  const w = lerp(5, 28, open);
  return (
    <svg viewBox="0 0 760 400" width="100%" height="100%" style={{ overflow: "visible" }}>
      <ellipse cx="230" cy="190" rx="170" ry="120" fill={c.us.cortexHi} stroke={withAlpha(c.text, 0.25)} strokeWidth="3" />
      <ellipse cx="230" cy="190" rx="140" ry="92" fill={c.us.medulla} />
      <ellipse cx="250" cy="196" rx="96" ry="64" fill={c.us.voidDark} />
      {/* junction + ureter */}
      <path d={`M 340 ${190 - w / 2} L 720 ${190 - 13} L 720 ${190 + 13} L 340 ${190 + w / 2} Z`} fill={c.us.voidDark} stroke={c.line} strokeWidth="2" />
      {f > t0 + 36 && <circle cx={420} cy={190} r={26 * open} fill="none" stroke={c.accent} strokeWidth="4" strokeDasharray="9 8" opacity={open} />}
      {T(230, 350, "Renal pelvis")}
      {T(560, 250, "Ureter")}
    </svg>
  );
};
