import { ImageResponse } from "next/og";
import { COLORS } from "@/lib/theme";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Ultraligera — unofficial fan site";

/**
 * Social-share image (Open Graph + Twitter Card). Generated programmatically
 * via Next.js' ImageResponse so palette swaps in lib/theme.ts cascade here
 * automatically — no Photoshop required.
 *
 * Mirrors the home hero: small accent-red eyebrow, huge "Ultraligera"
 * wordmark with the second half in accent red, tagline underneath, subtle
 * radial glow in the corner. Impact stands in for Bebas Neue (which would
 * need a runtime font fetch).
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: COLORS.background,
          backgroundImage: `radial-gradient(circle at 85% 5%, ${COLORS.accent}33 0%, transparent 55%)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "Impact, 'Arial Narrow Bold', sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 22,
            color: COLORS.accent,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: "18px",
            fontFamily: "ui-monospace, 'Courier New', monospace",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: COLORS.accent,
              display: "block",
            }}
          />
          Unofficial Fan Site
        </div>
        <div
          style={{
            fontSize: 180,
            color: COLORS.foreground,
            lineHeight: 0.85,
            letterSpacing: "-0.03em",
            display: "flex",
            textTransform: "uppercase",
          }}
        >
          <span>Ultra</span>
          <span style={{ color: COLORS.accent }}>ligera</span>
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#a3a3a3",
            marginTop: "32px",
            maxWidth: "960px",
            textAlign: "center",
            fontFamily: "system-ui, -apple-system, sans-serif",
            lineHeight: 1.3,
            display: "flex",
          }}
        >
          Gira, discografía y enlaces oficiales en un solo sitio
        </div>
      </div>
    ),
    { ...size },
  );
}
