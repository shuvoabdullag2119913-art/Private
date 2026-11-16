import React from "react";
import { AbsoluteFill } from "remotion";
import { Abs, Breathe, Entrance, ramp } from "../components/Anim";
import { CardSub, GlassCard, Pill } from "../components/Cards";
import { DrawIcon, ICON } from "../components/Icons";
import { Sfx } from "../components/Sfx";
import { LineMask } from "../components/Text";
import { theme } from "../theme";
import { useAt } from "../timing";
import { useCurrentFrame } from "remotion";

// Statement card — first-line treatment (cues 35–36)
export const S09Meds: React.FC = () => {
  const f = useCurrentFrame();
  const at = useAt();
  const tHead = at(35, 0);
  const tA = at(35, 0.55);
  const tB = at(36, 0);
  const plus = ramp(f, tB - 4, 16);

  const Card: React.FC<{ x: number; t: number; icon: string[]; name: string; sub: string }> = ({ x, t, icon, name, sub }) => (
    <Abs x={x} y={410} w={660}>
      <Entrance delay={t} from="up" dist={70} cfg="bouncy" scaleFrom={0.9}>
        <GlassCard h={480} pad={36} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Breathe amp={5}>
            <DrawIcon paths={icon} delay={t + 6} size={210} color={theme.colors.accent} stroke={3.8} />
          </Breathe>
          <div style={{ fontFamily: theme.fonts.display, fontSize: 84, fontWeight: 700, color: theme.colors.text, marginTop: 14, letterSpacing: 0, lineHeight: 1.25 }}>{name}</div>
          <CardSub size={42}>{sub}</CardSub>
        </GlassCard>
      </Entrance>
    </Abs>
  );

  return (
    <AbsoluteFill>
      <Abs x={0} y={96} w={1920} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <LineMask delay={tHead} size={theme.type.hero * 0.62}>চিকিৎসার শুরুতে</LineMask>
        <Entrance delay={at(35, 0.3)} dist={24}>
          <Pill size={40}>ব্যথা ও infection কমাতে</Pill>
        </Entrance>
      </Abs>
      <Card x={170} t={tA} icon={ICON.pill} name="Analgesics" sub="ব্যথা কমাতে" />
      <Card x={1090} t={tB} icon={ICON.shield} name="Antibiotics" sub="infection কমাতে" />
      <Abs x={880} y={600} w={160} h={160} style={{ display: "flex", alignItems: "center", justifyContent: "center", opacity: plus, transform: `scale(${0.6 + 0.4 * plus}) rotate(${(1 - plus) * -90}deg)` }}>
        <svg width="110" height="110" viewBox="0 0 110 110">
          <path d="M55 14 V96 M14 55 H96" stroke={theme.colors.text} strokeWidth="12" strokeLinecap="round" />
        </svg>
      </Abs>

      <Sfx name="whoosh" at={tHead} vol={0.22} rate={0.96} />
      <Sfx name="pop" at={at(35, 0.3)} rate={1.04} vol={0.22} />
      <Sfx name="pop" at={tA} rate={1.0} />
      <Sfx name="chime" at={tB} rate={1.0} />
    </AbsoluteFill>
  );
};
