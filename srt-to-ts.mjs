// SRT -> src/cues.generated.ts  (run: node scripts/srt-to-ts.mjs)
// SRT is the ONLY timing source. If you replace public/script.srt, re-run this.
import fs from "node:fs";

const src = fs
  .readFileSync(new URL("../public/script.srt", import.meta.url), "utf8")
  .replace(/\r/g, "");
const toSec = (s) => {
  const m = s.trim().match(/(\d+):(\d+):(\d+)[,.](\d+)/);
  return +m[1] * 3600 + +m[2] * 60 + +m[3] + +m[4].padEnd(3, "0") / 1000;
};
const cues = src
  .trim()
  .split(/\n\s*\n/)
  .map((b) => {
    const l = b.split("\n");
    const [a, c] = l[1].split("-->");
    return { i: +l[0], start: toSec(a), end: toSec(c), text: l.slice(2).join(" ").trim() };
  });
fs.writeFileSync(
  new URL("../src/cues.generated.ts", import.meta.url),
  `// AUTO-GENERATED from public/script.srt by scripts/srt-to-ts.mjs — do not edit by hand.\nexport type Cue = { i: number; start: number; end: number; text: string };\nexport const cues: Cue[] = ${JSON.stringify(cues, null, 1)};\n`
);
console.log(`cues: ${cues.length}, last end: ${cues[cues.length - 1].end}s`);
