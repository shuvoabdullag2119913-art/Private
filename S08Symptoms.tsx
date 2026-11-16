import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Abs, Breathe, Entrance, clampX } from "../components/Anim";
import { CardSub, CardTitle, GlassCard, Pill } from "../components/Cards";
import { DrawIcon, ICON } from "../components/Icons";
import { Sfx } from "../components/Sfx";
import { LineMask } from "../components/Text";
import { theme, withAlpha } from "../theme";
import { useAt } from "../timing";

// Four-column symptom cards (cues 31–34)
export const S08Symptoms: React.FC = () => {
  const f = useCurrentFrame();
  const at = useAt();
  const tHead = at(31, 0);
  // equal spacing for items that share one cue
  const t = [at(31, 0, 1), at(32, 0, 2), at(32, 1, 2), at(33, 0.3, 1)];

  const items = [
    { icon: ICON.flank, title: "কোমরে তীব্র ব্যথা", term: "Renal colic", hero: false },
    { icon: ICON.droplet, title: "প্রস্রাবের সাথে রক্ত", term: "Hematuria", hero: false },
    { icon: ICON.thermometer, title: "জ্বরসহ UTI", term: "Fever + UTI", hero: false },
    { icon: ICON.kidneyX, title: "কিডনি বিকল", term: "Renal failure", hero: true },
  ];

  return (
    <AbsoluteFill>
      <Abs x={96} y={92}>
        <LineMask delay={tHead} size={theme.type.h1}>রোগীর লক্ষণ ও ঝুঁকি</LineMask>
      </Abs>
      <Abs x={96} y={286} w={1728} style={{ display: "flex", gap: 32 }}>
        {items.map((it, i) => {
          const ring = interpolate((f - t[i] + 90) % 90, [0, 90], [0, 1], clampX);
          return (
            <div key={i} style={{ width: 408 }}>
              <Entrance delay={t[i]} from="up" dist={70} cfg="bouncy" scaleFrom={0.88}>
                <GlassCard h={600} pad={30} glow={it.hero ? theme.colors.primary : undefined} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ position: "relative", width: 250, height: 250, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 24 }}>
                    <div
                      style={{
                        position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid ${withAlpha(it.hero ? theme.colors.primary : theme.colors.accent, 0.5 * (1 - ring))}`,
                        transform: `scale(${0.7 + ring * 0.45})`,
                      }}
                    />
                    <div style={{ position: "absolute", inset: 30, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: `1.5px solid ${theme.colors.line}` }} />
                    <Breathe amp={4} phase={i * 20}>
                      <DrawIcon paths={it.icon} delay={t[i] + 6} size={170} color={it.hero ? theme.colors.primary : theme.colors.accent} stroke={4.2} />
                    </Breathe>
                  </div>
                  <div style={{ marginTop: 40, textAlign: "center" }}>
                    <CardTitle size={50}>{it.title}</CardTitle>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <CardSub size={36} color={it.hero ? theme.colors.text : theme.colors.accent}>{it.term}</CardSub>
                  </div>
                  {it.hero && (
                    <div style={{ marginTop: 22 }}>
                      <Pill tone="hero" size={28}>দীর্ঘদিন থাকলে ঝুঁকি</Pill>
                    </div>
                  )}
                </GlassCard>
              </Entrance>
            </div>
          );
        })}
      </Abs>

      <Sfx name="whoosh" at={tHead} vol={0.22} rate={1.04} />
      <Sfx name="pop" at={t[0]} rate={1.0} />
      <Sfx name="pop" at={t[1]} rate={1.06} />
      <Sfx name="pop" at={t[2]} rate={0.96} />
      <Sfx name="thud" at={t[3]} vol={0.2} />
      <Sfx name="chime" at={t[3] + 3} rate={0.9} />
    </AbsoluteFill>
  );
};
