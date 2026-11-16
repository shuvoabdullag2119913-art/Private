// All timing is derived from the SRT (via cues.generated.ts). Nothing is hand-placed in seconds.
import React, { createContext, useContext } from "react";
import { cues } from "./cues.generated";
import { FPS, LEAD_FRAMES, OVERLAP, SCENE_LEAD, TAIL_SEC } from "./config";

export const cue = (n: number) => cues[n - 1];
export const cStart = (n: number) => Math.round(cue(n).start * FPS);
export const cEnd = (n: number) => Math.round(cue(n).end * FPS);
export const LAST_CUE = cues.length;
export const TOTAL_FRAMES = cEnd(LAST_CUE) + Math.round(TAIL_SEC * FPS);

// Scenes are cut on cue boundaries (first cue of each scene).
export const SCENE_DEFS = [
  { id: "hook", first: 1 },
  { id: "normal", first: 3 },
  { id: "obstruct", first: 6 },
  { id: "g1", first: 9 },
  { id: "g2", first: 14 },
  { id: "g3", first: 19 },
  { id: "g4", first: 25 },
  { id: "symptoms", first: 31 },
  { id: "meds", first: 35 },
  { id: "drain", first: 37 },
  { id: "stone", first: 39 },
  { id: "surgery", first: 41 },
] as const;

export type SceneId = (typeof SCENE_DEFS)[number]["id"];

export const SCENES = SCENE_DEFS.map((s, i, arr) => {
  const start = i === 0 ? 0 : cStart(s.first) - SCENE_LEAD;
  const last = i === arr.length - 1;
  const nextStart = last ? TOTAL_FRAMES : cStart(arr[i + 1].first) - SCENE_LEAD;
  const end = last ? TOTAL_FRAMES : nextStart + OVERLAP;
  return { ...s, start, dur: end - start, isLast: last, isFirst: i === 0 };
});

export const SceneCtx = createContext<{ start: number }>({ start: 0 });

/**
 * Returns a function: at(cueNo, k, m, lead) -> LOCAL frame inside the current scene
 * where fraction k/m of that cue has elapsed, minus `lead` frames (default LEAD_FRAMES).
 * Several items named in ONE cue are spread at equal intervals: at(n, i, count).
 */
export const useAt = () => {
  const { start } = useContext(SceneCtx);
  return (n: number, k = 0, m = 1, lead = LEAD_FRAMES) =>
    Math.round(cStart(n) + ((cEnd(n) - cStart(n)) * k) / m) - start - lead;
};

export const useSceneStart = () => useContext(SceneCtx).start;
