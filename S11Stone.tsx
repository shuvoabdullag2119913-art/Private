import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Abs, Entrance } from "../components/Anim";
import { GlassCard, Pill } from "../components/Cards";
import { ESWL, PCNL, URS } from "../components/Diagrams";
import { Sfx } from "../components/Sfx";
import { CounterRoll, LineMask } from "../components/Text";
import { theme } from "../theme";
import { useAt } from "../timing";

// 3-item carousel with 01 / 03 counter — stone removal (cues 39–40)
export const S11Stone: React.FC = () => {
  const f = useCurrentFrame();
  const at = useAt();
  const tHead = at(39, 0);
  const t1 = at(39, 0.7); // URS (end of cue 39)
  const t2 = at(40, 1, 4); // PCNL — two names in one cue → equal intervals
  const t3 = at(40, 3, 4); // ESWL
  const n = f >= t3 ? 3 : f >= t2 ? 2 : f >= t1 ? 1 : 0;

  const cards = [
    { t: t1, name: "URS", D: URS },
    { t: t2, name: "PCNL", D: PCNL },
    { t: t3, name: "ESWL", D: ESWL },
  ];

  return (
    <AbsoluteFill>
      <Abs x={96} y={96} style={{ display: "flex", flexDirection: "column" }}>
        <Entrance delay={tHead} dist={24}>
          <Pill size={34}>মূল কারণ অনুযায়ী</Pill>
        </Entrance>
        <LineMask delay={tHead + 4} size={theme.type.h1}>পাথর অপসারণ</LineMask>
      </Abs>
      <Abs x={1500} y={170} w={324} style={{ display: "flex", justifyContent: "flex-end", alignItems: "baseline", gap: 8, fontFamily: theme.fonts.display, fontWeight: 700 }}>
        <Entrance delay={t1} dist={20}>
          <span style={{ display: "inline-flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontSize: 84, color: theme.colors.accent, fontVariantNumeric: "tabular-nums" }}>{`0${Math.max(1, n)}`}</span>
            <span style={{ fontSize: 44, color: theme.colors.textDim }}>/ 03</span>
          </span>
        </Entrance>
      </Abs>

      <Abs x={96} y={376} w={1728} style={{ display: "flex", gap: 54 }}>
        {cards.map((c, i) => (
          <div key={c.name} style={{ width: 540 }}>
            <Entrance delay={c.t} from="up" dist={80} cfg="bouncy" scaleFrom={0.88}>
              <GlassCard h={580} pad={30} style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: theme.fonts.display, fontSize: 110, fontWeight: 700, color: theme.colors.text, letterSpacing: 0, lineHeight: 1.2 }}>{c.name}</span>
                  <span style={{ fontFamily: theme.fonts.body, fontSize: 40, fontWeight: 600, color: theme.colors.textDim }}>{`0${i + 1}`}</span>
                </div>
                <div style={{ flex: 1, marginTop: 14 }}>
                  <c.D t0={c.t + 8} />
                </div>
              </GlassCard>
            </Entrance>
          </div>
        ))}
      </Abs>

      <Sfx name="whoosh" at={tHead} vol={0.22} rate={1.0} />
      <Sfx name="chime" at={t1} rate={1.0} />
      <Sfx name="chime" at={t2} rate={1.12} />
      <Sfx name="chime" at={t3} rate={0.94} />
      <Sfx name="click" at={t1 + 70} rate={1.0} />
      <Sfx name="click" at={t2 + 62} rate={1.06} />
      <Sfx name="pop" at={t3 + 48} rate={0.9} />
    </AbsoluteFill>
  );
};
