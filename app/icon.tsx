import { ImageResponse } from "next/og";
import { COLORS } from "@/lib/theme";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Programmatic favicon — a brand-red "U" on the theme background.
 * Avoids hosting the band's actual logo as a static asset: cleaner for
 * trademark posture and means a palette swap in lib/theme.ts cascades
 * automatically.
 */
export default function Icon() {
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
          fontSize: 24,
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
