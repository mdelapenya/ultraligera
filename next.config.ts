import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    // Cache HTML pages at the Vercel edge despite dynamic rendering.
    // `proxy.ts` reads x-pathname to set `<html lang>` per locale via
    // headers() in the root layout, which by default makes Next.js mark
    // every response as `Cache-Control: private, no-cache`. Setting an
    // explicit public s-maxage overrides that — the edge serves cached
    // HTML for 60s and a stale copy for up to a day while revalidating.
    // Content updates (gigs/videos syncs run nightly) propagate well
    // within these windows.
    return [
      {
        source: "/:locale(es|en)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/:locale(es|en)/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
  images: {
    // Whitelist the external image hosts we render through next/image.
    // Anything not in this list returns 400 from the optimizer.
    remotePatterns: [
      {
        // Apple Music CDN — album/EP/single cover artwork (sourced from
        // iTunes Search API in data/discography.json).
        protocol: "https",
        hostname: "is1-ssl.mzstatic.com",
        pathname: "/image/thumb/**",
      },
      {
        // YouTube thumbnails — used by the /media page for the video grid.
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
};

export default nextConfig;
