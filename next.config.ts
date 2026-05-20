import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
