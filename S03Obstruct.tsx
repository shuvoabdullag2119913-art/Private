import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Abs, Entrance, lerp, ramp } from "../components/Anim";
import { Pill } from "../components/Cards";
import { Callout, Kidney, mixShape, SHAPES } from "../components/Kidney";
import { Sfx } from "../components/Sfx";
import { LineMask } from "../components/Text";
import { theme, withAlpha } from "../theme";
import { useAt } from "../timing";

const TUBE_X0 = 800;
const TUBE_X1 = 1530;
const TUBE_Y = 520;
const BLOCK_X = 1170;

// Timeline / process flow — obstruction → dilation (cues 6–8)
export const S03Obstruct: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt();
  const tTitle = at(6, 0);
  const tBlock = at(6, 0.55);
  const tDilate = at(7, 0.25);
  const tName = at(8, 0);

  const inflate = spring({ frame: f - tDilate, fps, config: theme.spring.slow });
  const shape = mixShape(SHAPES[0], SHAPES[2], Math.min(1, inflate));
  const heroGlow = ramp(f, tDilate + 10, 16) * (1 - ramp(f, tName + 4, 14));
  const blockP = spring({ frame: f - tBlock, fps, config: theme.spring.bouncy });
  const line1 = ramp(f, tBlock, 30, theme.ease.inOut);
  const line2 = ramp(f, tDilate, 30, theme.ease.inOut);

  // urine droplets: flow until the block lands, then pile up behind it
  const N = 9;
  const dots = Array.from({ length: N }).map((_, i) => {
    const raw = TUBE_X0 + 20 + ((f * 5 + i * ((TUBE_X1 - TUBE_X0) / N)) % (TUBE_X1 - TUBE_X0 - 40));
    const slot = BLOCK_X - 34 - (i % N) * 17;
    const blocked = f > tBlock + 4;
    const x = blocked && raw < BLOCK_X ? Math.min(raw, slot) : raw;
    return { x, i };
  });
  const level = lerp(0.12, 0.5, ramp(f, 0, tBlock + 4, theme.ease.inOut));

  return (
    <AbsoluteFill>
      <Abs x={96} y={92}>
        <LineMask delay={tTitle} size={theme.type.h1}>প্রস্রাবের পথে বাধা</LineMask>
      </Abs>

      {/* kidney */}
      <Abs x={50} y={262} w={780} h={503}>
        <Entrance delay={2} from="left" dist={60}>
          <div style={{ width: 780, height: 503 }}>
            <Kidney shape={shape} uid="s3" drawIn={ramp(f, 4, 36, theme.ease.inOut)} heroGlow={heroGlow}>
              <Callout from={[0, -262]} to={[30, -52]} label="Pelvic calyceal system" tone="red" delay={tDilate + 10} anchor="middle" />
            </Kidney>
          </div>
        </Entrance>
      </Abs>

      {/* ureter + bladder + block */}
      <AbsoluteFill>
        <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
          <rect x={TUBE_X0} y={TUBE_Y - 16} width={TUBE_X1 - TUBE_X0} height={32} rx={16} fill={theme.colors.surfaceHi} stroke={theme.colors.line} strokeWidth="2" />
          {/* bladder */}
          <ellipse cx={1655} cy={TUBE_Y} rx={140} ry={126} fill={theme.colors.surface} stroke={theme.colors.line} strokeWidth="3" />
          <clipPath id="bl"><ellipse cx={1655} cy={TUBE_Y} rx={136} ry={122} /></clipPath>
          <rect x={1500} y={TUBE_Y + 126 - 252 * level} width={320} height={260} fill={withAlpha(theme.colors.accent, 0.26)} clipPath="url(#bl)" />
          {/* droplets */}
          {dots.map((d) => (
            <circle key={d.i} cx={d.x} cy={TUBE_Y} r={7.5} fill={theme.colors.accent} opacity={interpolate(f, [8, 20], [0, 0.95], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
          ))}
          {/* block (stone-like obstruction) */}
          <g transform={`translate(${BLOCK_X}, ${TUBE_Y - (1 - Math.min(1, blockP)) * 130}) scale(${Math.max(0.001, blockP)})`} opacity={Math.min(1, blockP * 2)}>
            <polygon points="-26,-20 4,-34 30,-12 22,20 -8,32 -32,12" fill={theme.colors.us.cortexHi} stroke={theme.colors.text} strokeWidth="3.5" strokeLinejoin="round" />
          </g>
          <text x={BLOCK_X} y={TUBE_Y - 70} textAnchor="middle" fontFamily={theme.fonts.display} fontSize="44" fontWeight="700" fill={theme.colors.accent} opacity={Math.min(1, Math.max(0, blockP))} style={{ letterSpacing: 0 }}>বাধা</text>
          <text x={(TUBE_X0 + TUBE_X1) / 2 - 120} y={TUBE_Y + 66} textAnchor="middle" fontFamily={theme.fonts.body} fontSize="30" fontWeight="500" fill={theme.colors.textDim} style={{ letterSpacing: 0 }}>Ureter</text>
          <text x={1655} y={TUBE_Y + 176} textAnchor="middle" fontFamily={theme.fonts.body} fontSize="30" fontWeight="500" fill={theme.colors.textDim} style={{ letterSpacing: 0 }}>Bladder</text>
        </svg>
      </AbsoluteFill>

      {/* process timeline */}
      <Abs x={0} y={812} w={1920} h={200}>
        <svg width="1920" height="200" style={{ position: "absolute", inset: 0 }}>
          <line x1="360" y1="40" x2="1560" y2="40" stroke={theme.colors.line} strokeWidth="4" />
          <line x1="360" y1="40" x2={360 + 600 * line1} y2="40" stroke={theme.colors.accent} strokeWidth="4" strokeLinecap="round" />
          <line x1="960" y1="40" x2={960 + 600 * line2} y2="40" stroke={theme.colors.accent} strokeWidth="4" strokeLinecap="round" />
          {[360, 960, 1560].map((x, i) => {
            const t = [tBlock, tDilate, tName][i];
            const p = Math.min(1, Math.max(0, spring({ frame: f - t, fps, config: theme.spring.bouncy })));
            return (
              <g key={x} transform={`translate(${x},40) scale(${p})`}>
                <circle r="22" fill={i === 2 ? theme.colors.primary : theme.colors.bg} stroke={i === 2 ? theme.colors.primary : theme.colors.accent} strokeWidth="5" />
                {i < 2 && <circle r="8" fill={theme.colors.accent} />}
              </g>
            );
          })}
        </svg>
        <Abs x={110} y={84} w={500} style={{ textAlign: "center" }}>
          <Entrance delay={tBlock + 4} dist={24}>
            <div style={{ fontFamily: theme.fonts.body, fontSize: 30, fontWeight: 600, color: theme.colors.textDim }}>01</div>
            <div style={{ fontFamily: theme.fonts.display, fontSize: 42, fontWeight: 700, color: theme.colors.text }}>প্রস্রাবের পথে বাধা</div>
          </Entrance>
        </Abs>
        <Abs x={710} y={84} w={500} style={{ textAlign: "center" }}>
          <Entrance delay={tDilate + 4} dist={24}>
            <div style={{ fontFamily: theme.fonts.body, fontSize: 30, fontWeight: 600, color: theme.colors.textDim }}>02</div>
            <div style={{ fontFamily: theme.fonts.display, fontSize: 42, fontWeight: 700, color: theme.colors.text }}>pelvic calyceal system dilated</div>
          </Entrance>
        </Abs>
        <Abs x={1310} y={84} w={500} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Entrance delay={tName + 2} dist={24} cfg="bouncy" scaleFrom={0.8}>
            <div style={{ fontFamily: theme.fonts.body, fontSize: 30, fontWeight: 600, color: theme.colors.textDim, textAlign: "center" }}>03</div>
            <Pill tone="hero" size={44} style={{ boxShadow: `0 0 50px ${theme.colors.glow}` }}>Hydronephrosis</Pill>
          </Entrance>
        </Abs>
      </Abs>

      <Sfx name="whoosh" at={tTitle} vol={0.22} rate={0.95} />
      <Sfx name="thud" at={tBlock + 2} vol={0.2} />
      <Sfx name="pop" at={tBlock + 3} rate={0.92} />
      <Sfx name="whoosh" at={tDilate} vol={0.24} rate={1.08} />
      <Sfx name="pop" at={tDilate + 4} rate={1.04} />
      <Sfx name="chime" at={tName} />
    </AbsoluteFill>
  );
};
