// Global switches & constants (no timing values from the script live here).
export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Voiceover (public/voiceover.mp3) — preview only by default.
export const PLAY_VOICEOVER_IN_PREVIEW = true;
export const INCLUDE_VOICEOVER_IN_RENDER = false;

// Visuals enter this many frames BEFORE the spoken words (brief: 4–6).
export const LEAD_FRAMES = 5;
// A scene starts this many frames before its first cue; the cross-transition lasts OVERLAP frames.
export const SCENE_LEAD = 8;
export const OVERLAP = 10;
// Calm closing recap after the last cue.
export const TAIL_SEC = 4;
