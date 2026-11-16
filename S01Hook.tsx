import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Abs, Breathe, Entrance, ramp, clampX } from "../components/Anim";
import { GradeLadder, Pill } from "../components/Cards";
import { Kidney, SHAPES } from "../components/Kidney";
import { Sfx } from "../components/Sfx";
import { LineMask } from "../components/Text";
import { theme, withAlpha } from "../theme";
import { useAt } from "../timing";

// Kinetic Typography hook (cues 1–2)
export const S01Hook: React.FC = () => {
  const f = useCurrentFrame();
  const at = useAt();
  const tTitle = at(1, 0);
  const tChip1 = at(1, 0.5);
  const tChip2 = at(1, 0.82);
  const tChip3 = at(2, 0);
  const tScan = at(2, 0.55);

  const scanX = interpolate(f, [tScan, tScan + 36], [-260, 2200], { easing: theme.ease.inOut, ...clampX });
  const underline = ramp(f, tTitle + 14, 22);

  return (
    <AbsoluteFill>
      {/* ultrasound ping rings */}
      {[0, 1, 2].map((i) => {
        const r = (f * 3.4 + i * 300) % 900;
        const o = interpolate(r, [0, 900], [0.2, 0], clampX);
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: 960 - r, top: 540 - r * 0.6, width: r * 2, height: r * 1.2, borderRadius: "50%",
              border: `2px solid ${withAlpha(theme.colors.text, o)}`,
            }}
          />
        );
      })}

      {/* ghost kidney */}
      <Abs x={330} y={170} w={1260} h={812}>
        <Breathe amp={6} scale={0.015}>
          <Kidney shape={SHAPES[0]} uid="s1" drawIn={ramp(f, 0, 60, theme.ease.inOut)} opacity={0.2} />
        </Breathe>
      </Abs>

      {/* title block */}
      <Abs x={0} y={250} w={1920} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <LineMask delay={tTitle} size={50} weight={600} color={theme.colors.textDim}>
          আমরা আজ জানব
        </LineMask>
        <LineMask delay={tTitle + 5} size={theme.type.hero} weight={700}>
          Hydronephrosis
        </LineMask>
        <div style={{ width: 760, height: 10, borderRadius: 5, marginTop: 6, overflow: "hidden" }}>
          <div
            style={{
              width: "100%", height: "100%", background: theme.colors.primary, transformOrigin: "left center",
              transform: `scaleX(${underline})`, boxShadow: `0 0 40px ${theme.colors.glow}, 0 0 90px ${withAlpha(theme.colors.primary, 0.2)}`,
            }}
          />
        </div>
      </Abs>

      {/* chips */}
      <Abs x={0} y={690} w={1920} style={{ display: "flex", justifyContent: "center", gap: 36 }}>
        <Entrance delay={tChip1} cfg="bouncy" scaleFrom={0.7} dist={36}>
          <Pill size={46}>Grade-এর পার্থক্য</Pill>
        </Entrance>
        <Entrance delay={tChip2} cfg="bouncy" scaleFrom={0.7} dist={36}>
          <Pill size={46}>সমস্যা</Pill>
        </Entrance>
        <Entrance delay={tChip3} cfg="bouncy" scaleFrom={0.7} dist={36}>
          <Pill size={46}>Treatment</Pill>
        </Entrance>
      </Abs>
      <Abs x={0} y={830} w={1920} style={{ display: "flex", justifyContent: "center" }}>
        <GradeLadder active={0} delay={tChip1 + 8} />
      </Abs>

      {/* Ultrasound scan sweep → sets up scene 2 */}
      <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute", top: 0, bottom: 0, left: scanX - 300, width: 300,
            background: `linear-gradient(90deg, transparent, ${withAlpha(theme.colors.accent, 0.16)})`,
          }}
        />
        <div style={{ position: "absolute", top: 0, bottom: 0, left: scanX, width: 5, background: theme.colors.accent, boxShadow: `0 0 40px ${theme.colors.accentGlow}` }} />
      </AbsoluteFill>
      <Abs x={0} y={950} w={1920} style={{ display: "flex", justifyContent: "center" }}>
        <Entrance delay={tScan + 4} dist={24}>
          <span style={{ fontFamily: theme.fonts.body, fontSize: 36, fontWeight: 600, color: theme.colors.accent, letterSpacing: 0 }}>
            Ultrasound · Longitudinal view
          </span>
        </Entrance>
      </Abs>

      <Sfx name="whoosh" at={tTitle + 2} rate={0.96} />
      <Sfx name="thud" at={tTitle + 16} />
      <Sfx name="pop" at={tChip1} rate={1.0} />
      <Sfx name="pop" at={tChip2} rate={1.07} />
      <Sfx name="pop" at={tChip3} rate={0.95} />
      <Sfx name="whoosh" at={tScan} rate={1.1} vol={0.22} />
    </AbsoluteFill>
  );
};
