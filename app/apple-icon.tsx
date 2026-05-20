import { ImageResponse } from "next/og";
import { COLORS } from "@/lib/theme";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon — same mark as the favicon, scaled up for iOS home
 *  screen. Background matches the theme so it doesn't look transparent. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: COLORS.background,
          color: COLORS.accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 140,
          fontWeight: 900,
          fontFamily:
            "Impact, 'Arial Narrow Bold', 'Helvetica Neue Condensed', sans-serif",
          letterSpacing: "-0.05em",
          lineHeight: 1,
        }}
      >
        U
      </div>
    ),
    { ...size },
  );
}
