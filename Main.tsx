import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Sequence } from "remotion";
import { Grade, Grain, Hud, BgMesh, Vignette } from "./components/Layers";
import { Enter, SceneShell } from "./components/SceneShell";
import { PreviewAudio } from "./components/Sfx";
import { loadFonts } from "./fonts";
import { SCENES, SceneId } from "./timing";
import { theme } from "./theme";
import { S01Hook } from "./scenes/S01Hook";
import { S02Normal } from "./scenes/S02Normal";
import { S03Obstruct } from "./scenes/S03Obstruct";
import { S04Grade1 } from "./scenes/S04Grade1";
import { S05Grade2 } from "./scenes/S05Grade2";
import { S06Grade3 } from "./scenes/S06Grade3";
import { S07Grade4 } from "./scenes/S07Grade4";
import { S08Symptoms } from "./scenes/S08Symptoms";
import { S09Meds } from "./scenes/S09Meds";
import { S10Drain } from "./scenes/S10Drain";
import { S11Stone } from "./scenes/S11Stone";
import { S12Surgery } from "./scenes/S12Surgery";

const REGISTRY: Record<SceneId, { C: React.FC | null; enter: Enter }> = {
  hook: { C: S01Hook, enter: "none" },
  normal: { C: S02Normal, enter: "whip" },
  obstruct: { C: S03Obstruct, enter: "scale" },
  g1: { C: S04Grade1, enter: "whip" },
  g2: { C: S05Grade2, enter: "rise" },
  g3: { C: S06Grade3, enter: "scale" },
  g4: { C: S07Grade4, enter: "whip" },
  symptoms: { C: S08Symptoms, enter: "rise" },
  meds: { C: S09Meds, enter: "scale" },
  drain: { C: S10Drain, enter: "whip" },
  stone: { C: S11Stone, enter: "rise" },
  surgery: { C: S12Surgery, enter: "scale" },
};

export const Main: React.FC = () => {
  const [handle] = useState(() => delayRender("fonts"));
  useEffect(() => {
    loadFonts().then(() => continueRender(handle)).catch((e) => { console.error(e); continueRender(handle); });
  }, [handle]);

  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      {/* L1 background */}
      <BgMesh />
      {/* L2–L3 assets + graphics (per scene) */}
      {SCENES.map((s) => {
        const { C, enter } = REGISTRY[s.id];
        if (!C) return null;
        return (
          <Sequence key={s.id} from={s.start} durationInFrames={s.dur} layout="none">
            <SceneShell start={s.start} enter={enter} isFirst={s.isFirst} isLast={s.isLast}>
              <C />
            </SceneShell>
          </Sequence>
        );
      })}
      <Hud />
      {/* L4 grade, L5 grain + vignette */}
      <Grade />
      <Grain />
      <Vignette />
      <PreviewAudio />
    </AbsoluteFill>
  );
};
