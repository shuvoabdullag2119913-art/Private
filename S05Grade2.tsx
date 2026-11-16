import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Abs, Entrance, lerp, ramp } from "../components/Anim";
import { CardSub, CardTitle, CheckBadge, GlassCard, GradeLadder, Pill } from "../components/Cards";
import { Callout, Kidney, mixShape, SHAPES } from "../components/Kidney";
import { ScopePanel } from "../components/ScopePanel";
import { Sfx } from "../components/Sfx";
import { CounterRoll, LineMask } from "../components/Text";
import { theme, withAlpha } from "../theme";
import { useAt } from "../timing";

// Bento grid — Grade 2 (cues 14–18)
export const S05Grade2: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt();
  const tHead = at(14, 0);
  const tPelvis = at(14, 0.45);
  const tFingers = at(15, 0.1);
  const tGauge = at(15, 0.5);
  const tMm = at(16, 0);
  const tTip = at(17, 0.1);
  const tCortex = at(18, 0);

  const p = Math.min(1, spring({ frame: f - tFingers, fps, config: theme.spring.slow }));
  const shape = mixShape(SHAPES[1], SHAPES[2], p);
  const heroGlow = ramp(f, tPelvis + 10, 16) * (1 - 0.75 * ramp(f, tTip, 16));
  const gauge = ramp(f, tMm, 36, theme.ease.inOut);
  const ring = ramp(f, tTip + 8, 14);

  return (
    <AbsoluteFill>
      <Abs x={96} y={84} style={{ display: "flex", alignItems: "center", gap: 36 }}>
        <LineMask delay={tHead} size={theme.type.h1}>Grade 2</LineMask>
        <Entrance delay={tHead + 8} cfg="bouncy" scaleFrom={0.7} dist={20}>
          <Pill size={40} tone="dim">Mild</Pill>
        </Entrance>
      </Abs>
      <Abs x={1384} y={118}>
        <GradeLadder active={2} delay={tHead + 6} />
      </Abs>

      {/* big tile: zoomed ultrasound */}
      <Abs x={96} y={272}>
        <Entrance delay={tHead + 2} from="down" dist={60} scaleFrom={0.96}>
          <ScopePanel w={1100} h={462}>
            <Kidney shape={shape} uid="s5" heroGlow={heroGlow} style={{ transform: "scale(1.34)" }}>
              <Callout from={[-250, 152]} to={[-14, 40]} label="Dilated Renal Pelvis" tone="red" delay={tPelvis + 8} anchor="middle" size={32} />
              <Callout from={[-340, -128]} to={[-112, -84]} label="Dilated Calyx" tone="red" delay={tFingers + 12} anchor="middle" size={32} />
              <Callout from={[272, 152]} to={[92, 96]} label="Dilated Calyx" tone="red" delay={tFingers + 22} anchor="middle" size={32} />
              {f > tTip + 6 && (
                <g transform="translate(157,-56)" opacity={ring}>
                  <circle r={44 - 10 * ring} fill="none" stroke={theme.colors.accent} strokeWidth="5" strokeDasharray="12 9" />
                </g>
              )}
            </Kidney>
          </ScopePanel>
        </Entrance>
      </Abs>

      {/* gauge tile */}
      <Abs x={1232} y={272} w={592}>
        <Entrance delay={tGauge} from="right" dist={70}>
          <GlassCard h={462} pad={32}>
            <CardTitle size={50}>Major calyces</CardTitle>
            <CardSub size={34}>আঙুলের মতো কালো</CardSub>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 30 }}>
              <CounterRoll to={10} delay={tMm} size={100} color={theme.colors.accent} minWidth={124} />
              <span style={{ fontFamily: theme.fonts.display, fontSize: 76, fontWeight: 600, color: theme.colors.textDim }}>–</span>
              <CounterRoll to={15} delay={tMm + 3} size={100} color={theme.colors.accent} minWidth={124} />
              <span style={{ fontFamily: theme.fonts.display, fontSize: 44, fontWeight: 600, color: theme.colors.textDim }}>mm</span>
            </div>
            {/* range gauge */}
            <div style={{ position: "relative", height: 22, borderRadius: 11, background: "rgba(255,255,255,0.08)", marginTop: 40 }}>
              <div
                style={{
                  position: "absolute", top: 0, bottom: 0, left: "50%", width: `${25 * gauge}%`, borderRadius: 11,
                  background: theme.colors.accent, boxShadow: `0 0 24px ${theme.colors.accentGlow}`,
                }}
              />
            </div>
          </GlassCard>
        </Entrance>
      </Abs>

      {/* row 2 */}
      <Abs x={96} y={766} w={552}>
        <Entrance delay={tPelvis} from="up" dist={50}>
          <GlassCard h={216} pad={28}>
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <svg width="104" height="76" viewBox="0 0 104 76">
                <ellipse cx="52" cy="38" rx="44" ry="28" fill={theme.colors.us.voidDark} stroke={theme.colors.text} strokeWidth="4" />
              </svg>
              <div>
                <CardTitle size={46}>Renal pelvis</CardTitle>
                <CardSub size={32}>ফোলা থাকে</CardSub>
              </div>
            </div>
          </GlassCard>
        </Entrance>
      </Abs>
      <Abs x={684} y={766} w={552}>
        <Entrance delay={tTip} from="up" dist={50}>
          <GlassCard h={216} pad={28}>
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <svg width="104" height="76" viewBox="0 0 104 76">
                <path d="M8 30 L84 38 L8 46 Z" fill={theme.colors.us.voidDark} stroke={theme.colors.text} strokeWidth="4" strokeLinejoin="round" />
              </svg>
              <div>
                <CardTitle size={46}>Calyx-এর প্রান্ত</CardTitle>
                <CardSub size={32}>তীক্ষ্ণ থাকে</CardSub>
              </div>
            </div>
          </GlassCard>
        </Entrance>
      </Abs>
      <Abs x={1272} y={766} w={552}>
        <Entrance delay={tCortex} from="up" dist={50}>
          <GlassCard h={216} pad={28}>
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <CheckBadge delay={tCortex + 6} size={64} />
              <div>
                <CardTitle size={46}>Cortex অক্ষত</CardTitle>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <CounterRoll to={7} delay={tCortex + 4} size={54} color={theme.colors.accent} minWidth={30} />
                  <span style={{ fontFamily: theme.fonts.display, fontSize: 44, color: theme.colors.textDim }}>–</span>
                  <CounterRoll to={10} delay={tCortex + 7} size={54} color={theme.colors.accent} minWidth={62} />
                  <span style={{ fontFamily: theme.fonts.display, fontSize: 34, color: theme.colors.textDim }}>mm</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </Entrance>
      </Abs>

      <Sfx name="whoosh" at={tHead} vol={0.22} rate={0.98} />
      <Sfx name="pop" at={tPelvis} rate={1.0} />
      <Sfx name="chime" at={tFingers + 12} rate={1.0} />
      <Sfx name="pop" at={tGauge} rate={1.05} />
      <Sfx name="click" at={tTip + 6} rate={1.0} />
      <Sfx name="pop" at={tTip} rate={0.95} />
      <Sfx name="click" at={tCortex + 8} rate={1.06} />
    </AbsoluteFill>
  );
};
