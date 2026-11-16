import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Abs, Entrance, ramp } from "../components/Anim";
import { CardSub, CardTitle, GlassCard, Pill } from "../components/Cards";
import { Bracket, Callout, Kidney, SHAPES } from "../components/Kidney";
import { ScopePanel } from "../components/ScopePanel";
import { Sfx } from "../components/Sfx";
import { CounterRoll, LineMask } from "../components/Text";
import { theme, withAlpha } from "../theme";
import { useAt } from "../timing";

// Glossy UI mockup — normal kidney (cues 3–5)
export const S02Normal: React.FC = () => {
  const f = useCurrentFrame();
  const at = useAt();
  const tSinus = at(3, 0.55);
  const tHyper = at(4, 0);
  const tCortex = at(4, 0.55);
  const tMm = at(5, 0);

  const sinusGlow = ramp(f, tHyper, 14) * (1 - 0.75 * ramp(f, tCortex, 16));
  const cortexGlow = ramp(f, tCortex + 6, 16) * (1 - 0.35 * ramp(f, tMm + 40, 20));

  return (
    <AbsoluteFill>
      <Abs x={96} y={92}>
        <LineMask delay={0} size={theme.type.h1}>Normal Kidney</LineMask>
      </Abs>

      <Abs x={96} y={262}>
        <Entrance delay={2} from="left" dist={90} cfg="smooth" scaleFrom={0.96}>
          <ScopePanel w={1110} h={720} caption="Normal Kidney">
            <Kidney shape={SHAPES[0]} uid="s2" drawIn={ramp(f, 6, 40, theme.ease.inOut)} sinusGlow={sinusGlow} cortexGlow={cortexGlow}>
              <Callout from={[250, 195]} to={[100, 40]} label="Renal Sinus" delay={tSinus} anchor="middle" />
              <Callout from={[-250, -252]} to={[-250, -154]} label="Cortex" delay={tCortex} anchor="middle" />
              <Bracket x={112} y1={-207} y2={-167} delay={tMm} label="7–10 mm" />
            </Kidney>
          </ScopePanel>
        </Entrance>
      </Abs>

      {/* right column */}
      <Abs x={1262} y={262} w={562}>
        <Entrance delay={tSinus} from="right" dist={70}>
          <GlassCard h={322} pad={28}>
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <div
                style={{
                  width: 124, height: 76, borderRadius: 16,
                  background: `radial-gradient(ellipse at 50% 50%, ${theme.colors.us.sinus}, ${theme.colors.us.sinusDim})`,
                  boxShadow: `0 0 36px ${withAlpha(theme.colors.us.sinus, 0.25)}`,
                }}
              />
              <CardTitle size={52}>Renal sinus</CardTitle>
            </div>
            <div style={{ marginTop: 20 }}>
              <CardTitle size={50}>সম্পূর্ণ সাদা</CardTitle>
            </div>
            <div style={{ marginTop: 18, height: 60 }}>
              <Entrance delay={tHyper} cfg="bouncy" scaleFrom={0.7} dist={20}>
                <Pill size={32}>Hyperechoic</Pill>
              </Entrance>
            </div>
          </GlassCard>
        </Entrance>
      </Abs>
      <Abs x={1262} y={658} w={562}>
        <Entrance delay={tCortex} from="right" dist={70}>
          <GlassCard h={322} pad={28}>
            <CardTitle size={50}>Cortex-এর পুরুত্ব</CardTitle>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 14 }}>
              <CounterRoll to={7} delay={tMm} size={104} color={theme.colors.accent} minWidth={62} />
              <span style={{ fontFamily: theme.fonts.display, fontSize: 80, fontWeight: 600, color: theme.colors.textDim }}>–</span>
              <CounterRoll to={10} delay={tMm + 3} size={104} color={theme.colors.accent} minWidth={124} />
              <span style={{ fontFamily: theme.fonts.display, fontSize: 52, fontWeight: 600, color: theme.colors.textDim }}>mm</span>
            </div>
            <div style={{ marginTop: 4 }}>
              <Entrance delay={tMm + 14} cfg="bouncy" scaleFrom={0.7} dist={20}>
                <Pill size={32} tone="dim">স্বাভাবিক</Pill>
              </Entrance>
            </div>
          </GlassCard>
        </Entrance>
      </Abs>

      <Sfx name="whoosh" at={0} vol={0.22} rate={1.05} />
      <Sfx name="pop" at={tSinus} rate={1} />
      <Sfx name="chime" at={tHyper} rate={1.0} />
      <Sfx name="pop" at={tCortex} rate={1.06} />
      <Sfx name="click" at={tMm + 4} rate={1.0} />
    </AbsoluteFill>
  );
};
