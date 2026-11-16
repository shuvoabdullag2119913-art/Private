import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Abs, Entrance, lerp, ramp } from "../components/Anim";
import { GradeLadder, Pill } from "../components/Cards";
import { DrawIcon, ICON } from "../components/Icons";
import { Bracket, Callout, Kidney, mixShape, SHAPES } from "../components/Kidney";
import { ScopePanel } from "../components/ScopePanel";
import { Sfx } from "../components/Sfx";
import { CounterRoll, LineMask } from "../components/Text";
import { theme } from "../theme";
import { useAt } from "../timing";

// Before / After split — Grade 3 vs Grade 4 (cues 25–30)
export const S07Grade4: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt();
  const tHead = at(25, 0);
  const tSep = at(25, 0.55);
  const tInflate = at(26, 0);
  const tGone = at(26, 0.45);
  const tMm = at(27, 0.45);
  const tFlat = at(28, 0.25);
  const tThin = at(29, 0);
  const tMm2 = at(29, 0.5);
  const tBanner = at(30, 0);

  const p1 = Math.min(1, spring({ frame: f - tInflate, fps, config: theme.spring.slow }));
  const p2 = ramp(f, tFlat, 34, theme.ease.inOut);
  const right = { ...mixShape(SHAPES[3], SHAPES[4], p1), cortex: lerp(SHAPES[3].cortex, SHAPES[4].cortex, p2) };
  const heroGlow = ramp(f, tInflate + 12, 16) * (1 - ramp(f, tBanner, 14));
  const chipsOut = 1 - ramp(f, tBanner - 2, 10);

  return (
    <AbsoluteFill>
      <Abs x={96} y={84} style={{ display: "flex", alignItems: "center", gap: 36 }}>
        <LineMask delay={tHead} size={theme.type.h1}>Grade 4</LineMask>
        <Entrance delay={tHead + 8} cfg="bouncy" scaleFrom={0.7} dist={20}>
          <Pill size={40} tone="dim">Severe</Pill>
        </Entrance>
      </Abs>
      <Abs x={1384} y={118}>
        <GradeLadder active={4} delay={tHead + 6} />
      </Abs>

      <Abs x={96} y={262}>
        <Entrance delay={tHead + 2} from="left" dist={70} scaleFrom={0.96}>
          <ScopePanel w={840} h={604} caption="Grade 3 (Moderate)" captionColor={theme.colors.textDim}>
            <Kidney shape={SHAPES[3]} uid="s7a" opacity={0.8} />
          </ScopePanel>
        </Entrance>
      </Abs>
      <Abs x={984} y={262}>
        <Entrance delay={tHead + 6} from="right" dist={70} scaleFrom={0.96}>
          <ScopePanel w={840} h={604} caption="Grade 4 (Severe)">
            <Kidney shape={right} uid="s7b" heroGlow={heroGlow}>
              <Bracket x={150} y1={-206} y2={-199 - 8 * (1 - p2)} delay={tThin} tone="red" />
              <Callout from={[-230, -258]} to={[-90, -207]} label="Cortical Thinning" tone="red" delay={tThin + 4} anchor="middle" size={40} />
            </Kidney>
          </ScopePanel>
        </Entrance>
      </Abs>

      {/* stats row */}
      <Abs x={96} y={892} w={840} style={{ opacity: chipsOut }}>
        <Entrance delay={tSep} dist={30}>
          <Pill tone="dim" size={34}>সব calyx-এর সীমানা আলাদা</Pill>
        </Entrance>
      </Abs>
      <Abs x={984} y={884} w={840} style={{ display: "flex", gap: 22, alignItems: "center", opacity: chipsOut }}>
        <Entrance delay={tGone} dist={30}>
          <Pill tone="dim" size={34}>সীমানা মুছে যায়</Pill>
        </Entrance>
        <Entrance delay={tMm} dist={30} cfg="bouncy" scaleFrom={0.8}>
          <span style={{ display: "inline-flex", alignItems: "baseline", gap: 8, fontFamily: theme.fonts.display, fontWeight: 700, color: theme.colors.text, fontSize: 52 }}>
            <span style={{ color: theme.colors.textDim }}>&gt;</span>
            <CounterRoll to={20} delay={tMm} size={64} color={theme.colors.accent} minWidth={64} />
            <span style={{ fontSize: 36, color: theme.colors.textDim }}>mm</span>
          </span>
        </Entrance>
        <Entrance delay={tMm2} dist={30} cfg="bouncy" scaleFrom={0.8}>
          <span style={{ display: "inline-flex", alignItems: "baseline", gap: 8, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40, color: theme.colors.text }}>
            Cortex <span style={{ color: theme.colors.textDim }}>&lt;</span>
            <CounterRoll to={7} delay={tMm2} size={64} color={theme.colors.accent} minWidth={36} />
            <span style={{ fontSize: 36, color: theme.colors.textDim }}>mm</span>
          </span>
        </Entrance>
      </Abs>

      {/* final banner */}
      <Abs x={96} y={884} w={1728}>
        <Entrance delay={tBanner} from="down" dist={40} cfg="bouncy" scaleFrom={0.96}>
          <div
            style={{
              height: 102, borderRadius: theme.radius.card, background: theme.colors.primary, display: "flex", alignItems: "center",
              justifyContent: "center", gap: 28, boxShadow: `0 0 70px ${theme.colors.glow}`,
            }}
          >
            <DrawIcon paths={ICON.warn} delay={tBanner + 4} size={64} color={theme.colors.text} stroke={5} />
            <span style={{ fontFamily: theme.fonts.display, fontSize: 56, fontWeight: 700, color: theme.colors.text, letterSpacing: 0 }}>
              কিডনির স্থায়ী ক্ষতি শুরু
            </span>
          </div>
        </Entrance>
      </Abs>

      <Sfx name="whoosh" at={tHead} vol={0.22} rate={0.96} />
      <Sfx name="pop" at={tSep} rate={1.0} />
      <Sfx name="whoosh" at={tInflate} vol={0.24} rate={1.06} />
      <Sfx name="thud" at={tInflate + 12} vol={0.2} />
      <Sfx name="click" at={tMm + 4} rate={1.02} />
      <Sfx name="pop" at={tFlat} rate={0.94} />
      <Sfx name="click" at={tMm2 + 4} rate={0.96} />
      <Sfx name="thud" at={tBanner} />
      <Sfx name="chime" at={tBanner + 4} rate={0.9} />
    </AbsoluteFill>
  );
};
