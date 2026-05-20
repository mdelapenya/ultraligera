/**
 * Single source of truth for visual design tokens.
 *
 * - CSS-only consumers should use the custom properties declared in
 *   `app/globals.css`, which mirror this file. Tailwind 4 exposes them as
 *   utilities (e.g. `bg-surface`, `text-foreground`) via the `@theme inline`
 *   block, so most JSX uses Tailwind classes — not these constants.
 *
 * - Import from here when CSS isn't an option: Next.js metadata
 *   (`themeColor`), inline SVG `style` attributes, chart series colors
 *   generated at render time, etc.
 *
 * - The CSS file and this module must stay in sync by hand. If you swap a
 *   palette, edit both.
 */

export const COLORS = {
  /** Body background — sampled from the "Mírame" cover art (rgb 25,25,25). */
  background: "#191919",
  /**
   * Primary text color. Pure white #fff mixed 9.8% toward black — same
   * transform that takes #000 to the #191919 body background and #ef3b2c
   * to the softened accent. Tailwind's `white` token is aliased to this
   * via the @theme inline block in globals.css, so all `text-white*` and
   * `bg-white*` utilities (including alpha variants) pick up the softer
   * tone without sweeping the codebase.
   */
  foreground: "#e6e6e6",
  muted: "#a3a3a3",
  /**
   * Brand red, used for the accent dot, CTAs, and selection highlight.
   * Lifted from the punchier #ef3b2c by mixing 9.8% toward white — the same
   * transform that takes pure black to the #191919 body background.
   */
  accent: "#f14e41",
  /**
   * Elevated black for sticky/anchored chrome (header, footer overlay).
   * Sits ~6-8 perceptual points below `background` so the UI reads as
   * "fixed layer" instead of content.
   */
  surface: "#0d0d0d",
  border: "rgba(255, 255, 255, 0.08)",
} as const;

export const CHART = {
  /** Channel total — single fixed series, matches the brand-adjacent gold. */
  channelTotalColor: "#f5b700",
  /**
   * Per-video lines on the trending chart. Colors are generated procedurally
   * with a golden-angle hue rotation so adjacent slots stay visually distinct
   * and the sequence doesn't repeat within one rotation. Saturation and
   * lightness are fixed for cohesion on a dark background.
   */
  palette: {
    hueOffset: 45,
    goldenAngle: 137.508,
    saturation: 72,
    lightness: 58,
  },
} as const;

export function chartSlotColor(slot: number): string {
  const { hueOffset, goldenAngle, saturation, lightness } = CHART.palette;
  const hue = (hueOffset + slot * goldenAngle) % 360;
  return `hsl(${hue.toFixed(1)}, ${saturation}%, ${lightness}%)`;
}

/**
 * Renders the COLORS object as a CSS :root block. Inject into a <style> tag
 * in app/layout.tsx so this file is the only place hex values live.
 */
export function themeStyleBlock(): string {
  const decls = Object.entries(COLORS)
    .map(([k, v]) => `--${k}:${v}`)
    .join(";");
  return `:root{${decls}}`;
}
