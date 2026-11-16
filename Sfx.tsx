import React, { useEffect, useState } from "react";
import { Audio, continueRender, delayRender, getRemotionEnvironment, Sequence, staticFile } from "remotion";
import { INCLUDE_VOICEOVER_IN_RENDER, PLAY_VOICEOVER_IN_PREVIEW } from "../config";

export type SfxName = "pop" | "click" | "whoosh" | "swipe" | "chime" | "thud";

// Level-matched (files are peak-normalised; these balance perceived loudness). All ≤ 0.35.
const VOL: Record<SfxName, number> = { pop: 0.28, click: 0.32, whoosh: 0.3, swipe: 0.3, chime: 0.26, thud: 0.24 };
const SFX_LEAD = 2; // start 2 frames BEFORE the visual lands

export const Sfx: React.FC<{ name: SfxName; at: number; vol?: number; rate?: number }> = ({ name, at, vol, rate = 1 }) => (
  <Sequence from={Math.max(0, Math.round(at) - SFX_LEAD)} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol ?? VOL[name]} playbackRate={rate} />
  </Sequence>
);

/** Voiceover for preview sync. Plays public/voiceover.mp3 if present; silently skipped if not. */
export const PreviewAudio: React.FC = () => {
  const { isRendering } = getRemotionEnvironment();
  const enabled = isRendering ? INCLUDE_VOICEOVER_IN_RENDER : PLAY_VOICEOVER_IN_PREVIEW;
  const [handle] = useState(() => (enabled ? delayRender("voiceover-check") : null));
  const [exists, setExists] = useState(false);

  useEffect(() => {
    if (!enabled || handle === null) return;
    fetch(staticFile("voiceover.mp3"), { method: "HEAD" })
      .then((r) => {
        const ct = r.headers.get("content-type") || "";
        setExists(r.ok && !ct.includes("text/html"));
      })
      .catch(() => setExists(false))
      .finally(() => continueRender(handle));
  }, [enabled, handle]);

  if (!enabled || !exists) return null;
  return <Audio src={staticFile("voiceover.mp3")} />;
};
