import React from "react";
import { AbsoluteFill } from "remotion";
import { Abs, Entrance } from "../components/Anim";
import { CardSub, CardTitle, GlassCard } from "../components/Cards";
import { DJStent, PCN } from "../components/Diagrams";
import { Sfx } from "../components/Sfx";
import { WordReveal } from "../components/Text";
import { theme } from "../theme";
import { useAt } from "../timing";

// Two-panel diagrams — emergency drainage (cues 37–38)
export const S10Drain: React.FC = () => {
  const at = useAt();
  const tHead = at(37, 0);
  const tDJ = at(37, 0.2);
  const tPCN = at(38, 0);
  const tFlow = at(38, 0.5);

  return (
    <AbsoluteFill>
      <Abs x={96} y={88} w={1500}>
        <WordReveal text="গুরুতর অবস্থায় জরুরি drainage" delay={tHead} size={theme.type.h2 - 4} accent={["drainage"]} per={5} />
      </Abs>

      <Abs x={96} y={286} w={840}>
        <Entrance delay={tDJ} from="left" dist={70}>
          <GlassCard h={690} pad={34}>
            <CardTitle size={60}>DJ stenting</CardTitle>
            <CardSub size={34}>ureter-এর ভেতরে stent</CardSub>
            <div style={{ height: 470, marginTop: 8 }}>
              <DJStent t0={tDJ + 6} tFlow={tFlow} />
            </div>
          </GlassCard>
        </Entrance>
      </Abs>
      <Abs x={984} y={286} w={840}>
        <Entrance delay={tPCN} from="right" dist={70}>
          <GlassCard h={690} pad={34}>
            <CardTitle size={60}>Percutaneous nephrostomy</CardTitle>
            <CardSub size={34}>PCN — পিঠের দিক থেকে নল</CardSub>
            <div style={{ height: 470, marginTop: 8 }}>
              <PCN t0={tPCN + 6} tFlow={tFlow} />
            </div>
          </GlassCard>
        </Entrance>
      </Abs>

      <Sfx name="whoosh" at={tHead} vol={0.22} rate={0.98} />
      <Sfx name="pop" at={tDJ} rate={1.0} />
      <Sfx name="click" at={tDJ + 30} rate={1.05} />
      <Sfx name="pop" at={tPCN} rate={1.06} />
      <Sfx name="click" at={tPCN + 30} rate={0.96} />
      <Sfx name="chime" at={tFlow} rate={1.04} vol={0.2} />
    </AbsoluteFill>
  );
};
