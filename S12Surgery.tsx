import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Abs, Entrance, clampX, ramp } from "../components/Anim";
import { CardSub, CardTitle, GlassCard, Pill } from "../components/Cards";
import { Pyelo, TURP } from "../components/Diagrams";
import { Kidney, SHAPES } from "../components/Kidney";
import { Sfx } from "../components/Sfx";
import { HighlightWord, LineMask, WordReveal } from "../components/Text";
import { theme } from "../theme";
import { cEnd, useAt, useSceneStart } from "../timing";

// Permanent fixes (cues 41–42) → calm recap grid in the tail
export const S12Surgery: React.FC = () => {
  const f = useCurrentFrame();
  const at = useAt();
  const start = useSceneStart();
  const tHead = at(41, 0);
  const tTurp = at(41, 0.2);
  const tPyelo = at(41, 0.75);
  const tHi = at(42, 0.1);
  const tRecap = cEnd(42) - start + 4;

  const bodyOut = 1 - ramp(f, tRecap - 12, 12, theme.ease.in);
  const items = [
    { g: 1, label: "Renal pelvis", hero: false },
    { g: 2, label: "+ Calyces", hero: false },
    { g: 3, label: "Bear paw", hero: false },
    { g: 4, label: "Balloon · Cortical thinning", hero: true },
  ];

  return (
    <AbsoluteFill>
      {/* phase A — surgery cards */}
      <AbsoluteFill style={{ opacity: bodyOut, display: f > tRecap + 4 ? "none" : "block" }}>
        <Abs x={96} y={84}>
          <Entrance delay={tHead} dist={24}>
            <span style={{ display: "inline-flex", alignItems: "center" }}>
              <HighlightWord delay={tHi} size={theme.type.h1}>স্থায়ী সমাধান</HighlightWord>
            </span>
          </Entrance>
        </Abs>

        <Abs x={96} y={300} w={820}>
          <Entrance delay={tTurp} from="left" dist={70}>
            <GlassCard h={680} pad={34}>
              <CardTitle size={84}>TURP</CardTitle>
              <CardSub size={36}>prostate-এর চিকিৎসা</CardSub>
              <div style={{ height: 440, marginTop: 6 }}>
                <TURP t0={tTurp + 8} />
              </div>
            </GlassCard>
          </Entrance>
        </Abs>
        <Abs x={1004} y={300} w={820}>
          <Entrance delay={tPyelo} from="right" dist={70}>
            <GlassCard h={680} pad={34}>
              <CardTitle size={84}>Pyeloplasty</CardTitle>
              <CardSub size={36}>operation</CardSub>
              <div style={{ height: 440, marginTop: 6 }}>
                <Pyelo t0={tPyelo + 8} />
              </div>
            </GlassCard>
          </Entrance>
        </Abs>
      </AbsoluteFill>

      {/* phase B — recap grid (tail) */}
      <Abs x={0} y={96} w={1920} style={{ display: "flex", justifyContent: "center" }}>
        <WordReveal text="Hydronephrosis · Grade 1–4" delay={tRecap + 2} size={theme.type.h2} align="center" accent={["Grade", "1–4"]} per={5} />
      </Abs>
      <Abs x={96} y={300} w={1728} style={{ display: "flex", gap: 32 }}>
        {items.map((it, i) => (
          <div key={it.g} style={{ width: 408 }}>
            <Entrance delay={tRecap + 10 + i * 5} from="up" dist={60} cfg="bouncy" scaleFrom={0.9}>
              <GlassCard h={600} pad={26} glow={it.hero ? theme.colors.primary : undefined} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 356, height: 230, marginTop: 40 }}>
                  <Kidney shape={SHAPES[it.g]} uid={`rc${it.g}`} />
                </div>
                <div style={{ fontFamily: theme.fonts.display, fontSize: 64, fontWeight: 700, color: theme.colors.accent, marginTop: 48, letterSpacing: 0 }}>Grade {it.g}</div>
                <div style={{ fontFamily: theme.fonts.display, fontSize: 40, fontWeight: 600, color: theme.colors.text, marginTop: 12, textAlign: "center", lineHeight: 1.3, letterSpacing: 0 }}>{it.label}</div>
              </GlassCard>
            </Entrance>
          </div>
        ))}
      </Abs>

      <Sfx name="whoosh" at={tHead} vol={0.22} rate={1.02} />
      <Sfx name="pop" at={tTurp} rate={1.0} />
      <Sfx name="click" at={tTurp + 40} rate={1.04} />
      <Sfx name="pop" at={tPyelo} rate={1.06} />
      <Sfx name="click" at={tHi + 6} rate={0.96} />
      <Sfx name="chime" at={tHi + 8} rate={1.0} />
      <Sfx name="whoosh" at={tRecap} vol={0.22} rate={0.94} />
      <Sfx name="pop" at={tRecap + 10} rate={1.0} vol={0.24} />
      <Sfx name="pop" at={tRecap + 15} rate={1.05} vol={0.24} />
      <Sfx name="pop" at={tRecap + 20} rate={0.96} vol={0.24} />
      <Sfx name="chime" at={tRecap + 25} rate={0.9} vol={0.22} />
    </AbsoluteFill>
  );
};
