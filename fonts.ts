// Offline fonts: Hind Siliguri (Bengali + Latin subsets) bundled in public/fonts.
import { staticFile } from "remotion";

const BN =
  "U+0951-0952,U+0964-0965,U+0980-09FE,U+1CD0,U+1CD2,U+1CD5-1CD6,U+1CD8,U+1CE1,U+1CEA,U+1CED,U+1CF2,U+1CF5-1CF7,U+200C-200D,U+20B9,U+25CC,U+A8F1";
const LATIN =
  "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";

export const loadFonts = async () => {
  const faces: FontFace[] = [];
  for (const w of [500, 600, 700]) {
    for (const [subset, range] of [["bengali", BN], ["latin", LATIN]] as const) {
      faces.push(
        new FontFace(
          "Hind Siliguri",
          `url(${staticFile(`fonts/hind-siliguri-${subset}-${w}-normal.woff2`)}) format("woff2")`,
          { weight: String(w), unicodeRange: range }
        )
      );
    }
  }
  await Promise.all(
    faces.map(async (f) => {
      await f.load();
      (document.fonts as unknown as { add: (f: FontFace) => void }).add(f);
    })
  );
};
