// prints scene start frames & cue frames (debug helper)
import fs from "node:fs";
const txt = fs.readFileSync(new URL("../src/cues.generated.ts", import.meta.url), "utf8");
const c = JSON.parse(txt.split("export const cues: Cue[] = ")[1].replace(/;\s*$/, ""));
const F = 30, cs = (n) => Math.round(c[n - 1].start * F), ce = (n) => Math.round(c[n - 1].end * F);
const firsts = [1, 3, 6, 9, 14, 19, 25, 31, 35, 37, 39, 41];
console.log("total", ce(42) + 120);
firsts.forEach((n, i) => console.log("scene", i + 1, "start", i === 0 ? 0 : cs(n) - 8, "firstCue", n, cs(n)));
