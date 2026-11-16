import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Abs, Breathe, Entrance, ramp } from "../components/Anim";
import { CardSub, CardTitle, CheckBadge, GlassCard, GradeLadder, Pill } from "../components/Cards";
import { DrawIcon, ICON } from "../components/Icons";
import { Kidney, mixShape, SHAPES } from "../components/Kidney";
import { Sfx } from "../components/Sfx";
import { CounterRoll, LineMask } from "../components/Text";
import { theme, withAlpha } from "../theme";
import { useAt } from "../timing";

// Hub & spoke — Grade 3 / bear paw (cues 19–24)
const KX = 500, KY = 338, KW = 920, KH = 593;
const sx = (X: number) => KX + ((X + 450) * KW) / 900;
const sy = (Y: number) => KY + ((Y + 290) * KH) / 580;

export const S06Grade3: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt();
  const tHead = at(19, 0);
  const tMorph = at(19, 0.3);
  const tPaw = at(20, 0.1);
  const tAll = at(21, 0.1);
  const tBlunt = at(22, 0);
  const tMm = at(22, 0.45);
  const tCortex = at(23, 0.3);
  const tChk = at(24, 0);

  const p = Math.min(1, spring({ frame: f - tMorph, fps, config: theme.spring.slow }));
  const shape = mixShape(SHAPES[2], SHAPES[3], p);
  const heroGlow = ramp(f, tPaw, 18) * (1 - 0.8 * ramp(f, tCortex, 18));
  const spoke = (x1: number, y1: number, x2: number, y2: number, t: number) => {
    const q = ramp(f, t + 4, 18);
    return (
      <g opacity={Math.min(1, q * 2)}>
        <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * q} y2={y1 + (y2 - y1) * q} stroke={theme.colors.accent} strokeWidth="3.5" strokeDasharray="10 8" strokeLinecap="round" />
        <circle cx={x2} cy={y2} r={9 * q} fill={theme.colors.accent} />
      </g>
    );
  };

  return (
    <AbsoluteFill>
      <Abs x={96} y={84} style={{ display: "flex", alignItems: "center", gap: 36 }}>
        <LineMask delay={tHead} size={theme.type.h1}>Grade 3</LineMask>
        <Entrance delay={tHead + 8} cfg="bouncy" scaleFrom={0.7} dist={20}>
          <Pill size={40} tone="dim">Moderate</Pill>
        </Entrance>
      </Abs>
      <Abs x={1384} y={118}>
        <GradeLadder active={3} delay={tHead + 6} />
      </Abs>

      {/* paw backdrop */}
      <Abs x={680} y={330} w={560} h={560} style={{ opacity: ramp(f, tPaw, 20) * 0.9 }}>
        <Breathe amp={5} scale={0.02}>
          <DrawIcon paths={ICON.paw} delay={tPaw} size={560} color={withAlpha(theme.colors.accent, 0.3)} stroke={2.2} />
        </Breathe>
      </Abs>

      {/* hub */}
      <Abs x={KX} y={KY} w={KW} h={KH}>
        <Entrance delay={tHead + 2} scaleFrom={0.92} dist={30}>
          <div style={{ width: KW, height: KH }}>
            <Kidney shape={shape} uid="s6" heroGlow={heroGlow} />
          </div>
        </Entrance>
      </Abs>

      {/* spokes */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <svg width="1920" height="1080">
          {spoke(520, 388, sx(34), sy(12), tPaw)}
          {spoke(1404, 388, sx(209), sy(-74), tAll)}
          {spoke(520, 858, sx(-225), sy(64), tBlunt)}
          {spoke(1404, 858, sx(391), sy(0), tCortex)}
        </svg>
      </AbsoluteFill>

      {/* satellites */}
      <Abs x={96} y={296} w={424}>
        <Entrance delay={tPaw} from="left" dist={70}>
          <GlassCard h={186} pad={26}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <DrawIcon paths={ICON.paw} delay={tPaw + 4} size={92} color={theme.colors.accent} stroke={4} />
              <div>
                <CardTitle size={40}>Bear paw appearance</CardTitle>
                <CardSub size={30}>ভাল্লুকের থাবা</CardSub>
              </div>
            </div>
          </GlassCard>
        </Entrance>
      </Abs>
      <Abs x={1400} y={296} w={424}>
        <Entrance delay={tAll} from="right" dist={70}>
          <GlassCard h={186} pad={26}>
            <CardTitle size={40}>সব calyces সমানভাবে ফোলা</CardTitle>
            <CardSub size={30}>pelvis + major + minor</CardSub>
          </GlassCard>
        </Entrance>
      </Abs>
      <Abs x={96} y={766} w={424}>
        <Entrance delay={tBlunt} from="left" dist={70}>
          <GlassCard h={186} pad={26}>
            <CardTitle size={40}>Blunted calyces</CardTitle>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <CounterRoll to={15} delay={tMm} size={64} color={theme.colors.accent} minWidth={76} />
              <span style={{ fontFamily: theme.fonts.display, fontSize: 48, color: theme.colors.textDim }}>–</span>
              <CounterRoll to={20} delay={tMm + 3} size={64} color={theme.colors.accent} minWidth={76} />
              <span style={{ fontFamily: theme.fonts.display, fontSize: 38, color: theme.colors.textDim }}>mm</span>
            </div>
          </GlassCard>
        </Entrance>
      </Abs>
      <Abs x={1400} y={766} w={424}>
        <Entrance delay={tCortex} from="right" dist={70}>
          <GlassCard h={186} pad={26}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <CheckBadge delay={tChk} size={62} />
              <CardTitle size={40}>Cortex এখনো স্বাভাবিক</CardTitle>
            </div>
          </GlassCard>
        </Entrance>
      </Abs>

      <Sfx name="whoosh" at={tHead} vol={0.22} rate={1.0} />
      <Sfx name="chime" at={tPaw} rate={0.94} />
      <Sfx name="pop" at={tAll} rate={1.05} />
      <Sfx name="pop" at={tBlunt} rate={0.96} />
      <Sfx name="click" at={tMm + 4} />
      <Sfx name="pop" at={tCortex} rate={1.02} />
      <Sfx name="click" at={tChk + 4} rate={1.05} />
    </AbsoluteFill>
  );
};
