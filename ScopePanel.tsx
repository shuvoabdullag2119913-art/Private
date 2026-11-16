import React from "react";
import { useCurrentFrame } from "remotion";
import { theme, withAlpha } from "../theme";

/** "Glossy UI" ultrasound screen: header tag, black screen with ruler + scan line, caption bar. */
export const ScopePanel: React.FC<{
  w: number;
  h: number;
  tag?: string;
  caption?: string;
  captionColor?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ w, h, tag = "Longitudinal View", caption, captionColor = theme.colors.text, children, style }) => {
  const f = useCurrentFrame();
  const hdr = 62;
  const cap = caption ? 62 : 0;
  const scanY = ((f * 4.2) % (h * 1.6)) - h * 0.3;
  return (
    <div
      style={{
        width: w, height: h, borderRadius: theme.radius.card + 4, overflow: "hidden", position: "relative", boxSizing: "border-box",
        background: `linear-gradient(180deg, ${theme.colors.surface}, ${theme.colors.bgAlt})`,
        border: `1.5px solid ${theme.colors.line}`,
        boxShadow: `${theme.shadow.card}, 0 0 0 6px rgba(255,255,255,0.02)`, ...style,
      }}
    >
      <div style={{ height: hdr, display: "flex", alignItems: "center", padding: "0 28px", gap: 14 }}>
        <span style={{ fontFamily: theme.fonts.display, fontSize: 32, fontWeight: 700, color: theme.colors.accent, letterSpacing: 0 }}>{tag}</span>
        <div style={{ flex: 1 }} />
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: 10, height: 10, borderRadius: 5, background: withAlpha(theme.colors.text, 0.2) }} />
        ))}
      </div>
      <div
        style={{
          position: "absolute", left: 14, right: 14, top: hdr, bottom: cap + 12, borderRadius: 20, overflow: "hidden",
          background: `radial-gradient(ellipse at 50% 35%, #1a1a1f, ${theme.colors.us.voidDark} 75%)`,
          border: `1px solid ${theme.colors.line}`,
        }}
      >
        <div style={{ position: "absolute", inset: 0, padding: "10px 24px" }}>{children}</div>
        {/* depth ruler */}
        <div style={{ position: "absolute", right: 14, top: 18, bottom: 18, width: 22 }}>
          {Array.from({ length: 17 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", right: 0, top: `${(i / 16) * 100}%`, width: i % 4 === 0 ? 20 : 11, height: 2, background: withAlpha(theme.colors.text, 0.28) }} />
          ))}
        </div>
        {/* scan line */}
        <div style={{ position: "absolute", left: 0, right: 0, top: scanY, height: 90, background: `linear-gradient(180deg, transparent, ${withAlpha(theme.colors.text, 0.06)}, transparent)` }} />
      </div>
      {caption && (
        <div
          style={{
            position: "absolute", left: 0, right: 0, bottom: 0, height: cap, display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: theme.fonts.display, fontSize: 36, fontWeight: 700, color: captionColor, letterSpacing: 0,
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
};
