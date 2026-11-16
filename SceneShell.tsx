import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { OVERLAP, SCENE_LEAD } from "../config";
import { theme, withAlpha } from "../theme";
import { SceneCtx } from "../timing";
import { clampX } from "./Anim";
import { Sfx } from "./Sfx";

export type Enter = "whip" | "scale" | "rise" | "none";

/**
 * Scene wrapper: enter transition (14f, ease-out) + faster exit (OVERLAP f, ease-in) + transition SFX.
 * Scenes overlap by OVERLAP frames, so the cut happens while both are moving.
 */
export const SceneShell: React.FC<{
  start: number;
  enter: Enter;
  isLast?: boolean;
  isFirst?: boolean;
  children: React.ReactNode;
}> = ({ start, enter, isLast, isFirst, children }) => {
  const f = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();

  const inP = isFirst ? 1 : interpolate(f, [0, 14], [0, 1], { easing: theme.ease.out, ...clampX });
  const exitLen = isLast ? 22 : OVERLAP;
  const outP = interpolate(f, [d - exitLen, d], [0, 1], { easing: theme.ease.in, ...clampX });

  let tx = 0, sc = 1, ty = 0, blur = 0;
  if (enter === "whip") {
    tx = (1 - inP) * 180 - outP * 240;
    blur = (1 - inP) * 10 + outP * 12;
  } else if (enter === "scale") {
    sc = 0.93 + inP * 0.07 + outP * 0.1;
    blur = (1 - inP) * 6 + outP * 6;
  } else if (enter === "rise") {
    ty = (1 - inP) * 70 - outP * 56;
    blur = (1 - inP) * 6 + outP * 5;
  }
  const opacity = Math.min(inP * 1.4, 1) * (1 - outP);

  // mask sweep streak at the cut (neutral, not a hero colour)
  const sw = interpolate(f, [0, 16], [0, 1], { easing: theme.ease.inOut, ...clampX });

  return (
    <SceneCtx.Provider value={{ start }}>
      <AbsoluteFill style={{ opacity, transform: `translate(${tx}px, ${ty}px) scale(${sc})`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>
        {children}
      </AbsoluteFill>
      {!isFirst && f < 20 && (
        <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
          <div
            style={{
              position: "absolute", top: -100, bottom: -100, width: 380, left: interpolate(sw, [0, 1], [2300, -500]),
              transform: "skewX(-14deg)",
              background: `linear-gradient(90deg, transparent, ${withAlpha(theme.colors.text, 0.09)}, transparent)`,
            }}
          />
        </AbsoluteFill>
      )}
      {!isFirst && <Sfx name="swipe" at={SCENE_LEAD - 6} />}
    </SceneCtx.Provider>
  );
};
