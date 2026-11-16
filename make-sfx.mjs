// Synthesises the SFX kit (soft, modern UI / motion-graphics sounds) into public/sfx/*.wav
// Deterministic (seeded noise). Run: node scripts/make-sfx.mjs
import fs from "node:fs";
import path from "node:path";

const SR = 48000;
const OUT = new URL("../public/sfx/", import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });

let seed = 1337;
const rnd = () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const noise = () => rnd() * 2 - 1;

// --- RBJ biquad -------------------------------------------------------------
const biquad = (type, f0, Q) => {
  const w0 = (2 * Math.PI * f0) / SR, c = Math.cos(w0), s = Math.sin(w0), a = s / (2 * Q);
  let b0, b1, b2, a0 = 1 + a, a1 = -2 * c, a2 = 1 - a;
  if (type === "lp") { b0 = (1 - c) / 2; b1 = 1 - c; b2 = (1 - c) / 2; }
  else if (type === "hp") { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = (1 + c) / 2; }
  else { b0 = a; b1 = 0; b2 = -a; } // bp (constant peak gain)
  return { b0: b0 / a0, b1: b1 / a0, b2: b2 / a0, a1: a1 / a0, a2: a2 / a0, x1: 0, x2: 0, y1: 0, y2: 0 };
};
const run = (f, x) => {
  const y = f.b0 * x + f.b1 * f.x1 + f.b2 * f.x2 - f.a1 * f.y1 - f.a2 * f.y2;
  f.x2 = f.x1; f.x1 = x; f.y2 = f.y1; f.y1 = y; return y;
};
const filt = (arr, type, f0, Q = 0.707) => { const f = biquad(type, f0, Q); return arr.map((x) => run(f, x)); };

// small, soft reverb (decaying-noise impulse response, ~70 ms) mixed lightly
const smallVerb = (arr, mix = 0.12) => {
  const n = Math.floor(SR * 0.07);
  const ir = Array.from({ length: n }, (_, i) => noise() * Math.exp((-6 * i) / n));
  const out = new Array(arr.length).fill(0);
  for (let i = 0; i < arr.length; i++) {
    if (Math.abs(arr[i]) < 1e-5) continue;
    for (let k = 0; k < n && i + k < out.length; k += 3) out[i + k] += arr[i] * ir[k] * 0.35;
  }
  return arr.map((x, i) => x * (1 - mix) + out[i] * mix * 3);
};

const fade = (arr, inMs, outMs) => arr.map((x, i) => {
  const t = i / SR, T = arr.length / SR;
  const a = Math.min(1, t / (inMs / 1000));
  const b = Math.min(1, (T - t) / (outMs / 1000));
  return x * Math.max(0, a) * Math.max(0, b);
});

const gen = (dur, fn) => Array.from({ length: Math.floor(SR * dur) }, (_, i) => fn(i / SR, i));

// --- Sounds -----------------------------------------------------------------
const sounds = {
  // soft pop: sine with fast downward pitch + small envelope
  pop: () => {
    let ph = 0;
    const raw = gen(0.22, (t) => {
      const f = 170 + 360 * Math.exp(-t / 0.028);
      ph += (2 * Math.PI * f) / SR;
      const env = Math.min(1, t / 0.003) * Math.exp(-t / 0.05);
      return (Math.sin(ph) + 0.22 * Math.sin(2 * ph)) * env;
    });
    return fade(smallVerb(filt(raw, "lp", 4200)), 2, 40);
  },
  // crisp click: tiny high-passed noise burst with soft body
  click: () => {
    let ph = 0;
    const raw = gen(0.12, (t) => {
      const n = noise() * Math.exp(-t / 0.006) * Math.min(1, t / 0.0006);
      ph += (2 * Math.PI * 1900) / SR;
      return n * 0.85 + Math.sin(ph) * Math.exp(-t / 0.012) * 0.3;
    });
    return fade(smallVerb(filt(filt(raw, "hp", 2200, 0.8), "lp", 9000), 0.08), 1, 30);
  },
  // soft whoosh: band-pass noise sweep, fade in / out (text & title entries)
  whoosh: () => {
    const dur = 0.6;
    const raw = gen(dur, () => noise());
    const out = new Array(raw.length);
    const f = biquad("bp", 500, 0.9);
    for (let i = 0; i < raw.length; i++) {
      const t = i / SR, p = t / dur;
      if (i % 48 === 0) Object.assign(f, { ...biquad("bp", 450 + 2300 * Math.pow(p, 1.4), 0.9), x1: f.x1, x2: f.x2, y1: f.y1, y2: f.y2 });
      out[i] = run(f, raw[i]) * Math.pow(Math.sin(Math.PI * Math.min(1, p * 1.15)), 2);
    }
    return fade(smallVerb(filt(out, "lp", 5200), 0.1), 20, 150);
  },
  // swipe: short smooth transition whoosh, descending sweep
  swipe: () => {
    const dur = 0.5;
    const raw = gen(dur, () => noise());
    const out = new Array(raw.length);
    const f = biquad("bp", 3000, 1.1);
    for (let i = 0; i < raw.length; i++) {
      const t = i / SR, p = t / dur;
      if (i % 48 === 0) Object.assign(f, { ...biquad("bp", 3200 - 2300 * Math.pow(p, 0.8), 1.1), x1: f.x1, x2: f.x2, y1: f.y1, y2: f.y2 });
      out[i] = run(f, raw[i]) * Math.pow(Math.sin(Math.PI * Math.pow(p, 0.7)), 2);
    }
    return fade(smallVerb(filt(out, "lp", 6000), 0.1), 15, 120);
  },
  // chime / pluck: short soft decay with gentle overtones
  chime: () => {
    const parts = [[880, 1, 0.16], [1320, 0.32, 0.11], [1760, 0.14, 0.07], [2217, 0.06, 0.05]];
    const raw = gen(0.5, (t) => {
      let s = 0;
      for (const [f, a, tau] of parts) s += a * Math.sin(2 * Math.PI * f * t + 0.3 * Math.sin(2 * Math.PI * 4 * t)) * Math.exp(-t / tau);
      return s * Math.min(1, t / 0.004);
    });
    return fade(smallVerb(filt(raw, "lp", 6500), 0.14), 3, 90);
  },
  // very soft thud (hook / key message): low sine thump, restrained
  thud: () => {
    let ph = 0;
    const raw = gen(0.35, (t) => {
      const f = 52 + 70 * Math.exp(-t / 0.05);
      ph += (2 * Math.PI * f) / SR;
      return Math.sin(ph) * Math.min(1, t / 0.006) * Math.exp(-t / 0.09);
    });
    return fade(smallVerb(filt(raw, "lp", 420), 0.06), 4, 90);
  },
};

// --- write 16-bit mono WAV, peak-normalised to a common level ----------------
const TARGET_PEAK = 0.7;
for (const [name, make] of Object.entries(sounds)) {
  const x = make();
  const peak = Math.max(...x.map(Math.abs));
  const g = TARGET_PEAK / peak;
  const buf = Buffer.alloc(44 + x.length * 2);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + x.length * 2, 4); buf.write("WAVE", 8);
  buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(x.length * 2, 40);
  x.forEach((v, i) => buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v * g)) * 32767), 44 + i * 2));
  fs.writeFileSync(path.join(OUT, `${name}.wav`), buf);
  console.log(name.padEnd(7), (x.length / SR).toFixed(3) + "s");
}
