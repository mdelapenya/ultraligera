"use client";

import { useEffect, useState } from "react";

export type CoverBubble = {
  /** Apple CDN URL (or any image source). */
  cover: string;
  /** Used only for the `alt` attribute. */
  title: string;
};

type Layout = {
  size: number;
  x: number;
  y: number;
  dur: number;
  delay: number;
  blur: number;
  path: [number, number][];
};

/**
 * Deterministic pseudo-random in [0, 1), seeded by two integers plus an
 * optional per-request session seed. Stable between server and client
 * (no hydration mismatches) but the session seed lets each 404 render
 * shuffle the layout — without it, the page always looked identical.
 */
function rand(seed: number, salt: number, session: number): number {
  const x =
    Math.sin((seed + 1) * (salt + 1) * (session + 1) * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * 1D Halton sequence — a low-discrepancy quasi-random distribution that
 * spreads points across [0, 1] without clusters or visible patterns.
 * Pairing two coprime bases (2, 3) gives an organic 2D layout that
 * doesn't read as a grid the way uniform jitter does.
 */
function halton(i: number, base: number): number {
  let f = 1;
  let r = 0;
  let idx = i + 1; // shift past the trivial first point
  while (idx > 0) {
    f /= base;
    r += f * (idx % base);
    idx = Math.floor(idx / base);
  }
  return r;
}

function generateLayout(i: number, session: number): Layout {
  // Shift the Halton sequence by the session seed so each request gets a
  // different distribution. Halton is deterministic per index, so we change
  // the index itself instead of the algorithm.
  const haltonShift = session % 997; // 997 = prime, gives 997 distinct shifts
  const baseX = halton(i + haltonShift, 2) * 88 + 6;
  const baseY = halton(i + haltonShift, 3) * 80 + 8;
  // Small residual jitter to soften the few near-collisions Halton produces
  // when the sequence revisits a region.
  const jitterX = rand(i, 2, session) * 4 - 2;
  const jitterY = rand(i, 3, session) * 4 - 2;

  const size = 180 + Math.floor(rand(i, 1, session) * 140); // 180-319
  return {
    size,
    x: baseX + jitterX,
    y: baseY + jitterY,
    dur: 34 + Math.floor(rand(i, 4, session) * 22), // 34-55s
    delay: Math.floor(rand(i, 5, session) * 14),
    blur: size < 215 ? 2 : size < 260 ? 1 : 0,
    path: [
      [Math.floor(rand(i, 8, session) * 24 - 12), Math.floor(rand(i, 9, session) * 20 - 10)],
      [Math.floor(rand(i, 10, session) * 24 - 12), Math.floor(rand(i, 11, session) * 20 - 10)],
      [Math.floor(rand(i, 12, session) * 24 - 12), Math.floor(rand(i, 13, session) * 20 - 10)],
      [Math.floor(rand(i, 14, session) * 24 - 12), Math.floor(rand(i, 15, session) * 20 - 10)],
    ],
  };
}

export function CoverBubbles({
  covers,
  seed = 0,
}: {
  covers: CoverBubble[];
  /** Per-request seed from the server. Shuffles positions, sizes, durations
   *  and drift paths so the page doesn't look identical on every reload. */
  seed?: number;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const layouts = covers.map((_, i) => generateLayout(i, seed));

  const keyframes = layouts
    .map((l, i) => {
      const [p1, p2, p3, p4] = l.path;
      return `@keyframes ul-bubble-${i} {
        0%   { transform: translate(0vw, 0vh); }
        20%  { transform: translate(${p1[0]}vw, ${p1[1]}vh); }
        40%  { transform: translate(${p2[0]}vw, ${p2[1]}vh); }
        60%  { transform: translate(${p3[0]}vw, ${p3[1]}vh); }
        80%  { transform: translate(${p4[0]}vw, ${p4[1]}vh); }
        100% { transform: translate(0vw, 0vh); }
      }`;
    })
    .join("\n");

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      <style>{keyframes}</style>
      {covers.map((c, i) => {
        const l = layouts[i];
        // Responsive sizing: design size anchored at a 1280px viewport,
        // shrinks proportionally on smaller screens, never scales above the
        // design size on larger ones (avoids cartoonish blow-ups on 4K).
        const designVw = ((l.size / 1280) * 100).toFixed(2);
        const sizeClamp = `clamp(60px, ${designVw}vw, ${l.size}px)`;
        return (
          <div
            key={i}
            className="absolute rounded-full overflow-hidden"
            style={{
              width: sizeClamp,
              height: sizeClamp,
              // Rounded to 2dp — full IEEE precision triggered hydration
              // warnings because the browser normalizes inline percentages.
              left: `${l.x.toFixed(2)}%`,
              top: `${l.y.toFixed(2)}%`,
              filter: l.blur ? `blur(${l.blur}px)` : undefined,
              opacity: mounted ? 0.62 : 0,
              transition: "opacity 2s ease-out",
              animation: `ul-bubble-${i} ${l.dur}s ease-in-out ${l.delay}s infinite`,
              willChange: "transform",
              boxShadow:
                "0 0 40px color-mix(in srgb, var(--accent) 10%, transparent), 0 0 20px rgba(0,0,0,0.6)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.cover}
              alt=""
              className="w-full h-full object-cover"
              loading="eager"
              draggable={false}
            />
          </div>
        );
      })}
    </div>
  );
}
