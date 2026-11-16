import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Abs, Entrance, ramp } from "../components/Anim";
import { CardSub, CardTitle, CheckBadge, GlassCard, GradeLadder, Pill } from "../components/Cards";
import { Callout, Kidney, mixShape, SHAPES } from "../components/Kidney";
import { ScopePanel } from "../components/ScopePanel";
import { Sfx } from "../components/Sfx";
import { CounterRoll, LineMask } from "../components/Text";
import { theme } from "../theme";
import { useAt } from "../timing";

// Glass cards — Grade 1 (cues 9–13)
export const S04Grade1: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt();
  const tHead = at(9, 0);
  const tCardA = at(9, 0.5);
  const tMorph = at(10, 0);
  const tCardB = at(11, 0);
  const tMm = at(11, 0.5);
  const tCardC = at(12, 0);
  const tChk1 = at(12, 0.45);
  const tChk2 = at(13, 0, 1, 2);

  const p = Math.min(1, spring({ frame: f - tMorph, fps, config: theme.spring.slow }));
  const shape = mixShape(SHAPES[0], SHAPES[1], p);
  const heroGlow = ramp(f, tMorph + 14, 16) * (1 - 0.8 * ramp(f, tCardC, 16));

  return (
    <AbsoluteFill>
      <Abs x={96} y={84} style={{ display: "flex", alignItems: "center", gap: 36 }}>
        <LineMask delay={tHead} size={theme.type.h1}>Grade 1</LineMask>
        <Entrance delay={tHead + 8} cfg="bouncy" scaleFrom={0.7} dist={20}>
          <Pill size={40} tone="dim">Mild</Pill>
        </Entrance>
      </Abs>
      <Abs x={1384} y={118}>
        <GradeLadder active={1} delay={tHead + 6} />
      </Abs>

      <Abs x={96} y={272}>
        <Entrance delay={tHead + 2} from="left" dist={80} scaleFrom={0.96}>
          <ScopePanel w={1040} h={710} caption="Grade 1 Hydronephrosis (Mild)">
            <Kidney shape={shape} uid="s4" heroGlow={heroGlow}>
              <Callout from={[210, 168]} to={[92, 40]} label="Dilated Renal Pelvis" tone="red" delay={tMorph + 14} anchor="middle" />
              <Callout from={[-300, 100]} to={[-140, 8]} label="Normal Calyces" delay={tCardC} anchor="middle" />
              <Callout from={[-250, -252]} to={[-250, -154]} label="Cortex" delay={tCardC + 6} anchor="middle" />
            </Kidney>
          </ScopePanel>
        </Entrance>
      </Abs>

      <Abs x={1190} y={272} w={634}>
        <Entrance delay={tCardA} from="right" dist={70}>
          <GlassCard h={200} pad={28}>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <svg width="96" height="72" viewBox="0 0 96 72">
                <ellipse cx="48" cy="36" rx="38" ry="24" fill={theme.colors.us.voidDark} stroke={theme.colors.text} strokeWidth="4" />
              </svg>
              <div>
                <CardTitle size={44}>Renal pelvis সামান্য ফুলে ওঠে</CardTitle>
                <CardSub size={30}>কিডনির মুখ</CardSub>
              </div>
            </div>
          </GlassCard>
        </Entrance>
      </Abs>
      <Abs x={1190} y={502} w={634}>
        <Entrance delay={tCardB} from="right" dist={70}>
          <GlassCard h={226} pad={28}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <Pill size={30}>Anechoic</Pill>
              <CardTitle size={42}>ডিম্বাকৃতির কালো অংশ</CardTitle>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 14 }}>
              <CounterRoll to={7} delay={tMm} size={92} color={theme.colors.accent} minWidth={54} />
              <span style={{ fontFamily: theme.fonts.display, fontSize: 70, fontWeight: 600, color: theme.colors.textDim }}>–</span>
              <CounterRoll to={10} delay={tMm + 3} size={92} color={theme.colors.accent} minWidth={110} />
              <span style={{ fontFamily: theme.fonts.display, fontSize: 44, fontWeight: 600, color: theme.colors.textDim }}>mm</span>
            </div>
          </GlassCard>
        </Entrance>
      </Abs>
      <Abs x={1190} y={756} w={634}>
        <Entrance delay={tCardC} from="right" dist={70}>
          <GlassCard h={226} pad={28}>
            <div style={{ display: "flex", flexDirection: "column", gap: 22, justifyContent: "center", height: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <CheckBadge delay={tChk1} />
                <CardTitle size={46}>Calyces স্বাভাবিক</CardTitle>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <CheckBadge delay={tChk2} />
                <CardTitle size={46}>Cortex স্বাভাবিক</CardTitle>
              </div>
            </div>
          </GlassCard>
        </Entrance>
      </Abs>

      <Sfx name="whoosh" at={tHead} vol={0.22} rate={1.02} />
      <Sfx name="pop" at={tCardA} rate={1.0} />
      <Sfx name="chime" at={tMorph + 14} rate={0.94} />
      <Sfx name="pop" at={tCardB} rate={1.06} />
      <Sfx name="click" at={tMm + 4} />
      <Sfx name="pop" at={tCardC} rate={0.96} />
      <Sfx name="click" at={tChk1 + 3} rate={1.05} />
      <Sfx name="click" at={tChk2 + 3} rate={0.96} />
    </AbsoluteFill>
  );
};
