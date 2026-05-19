#!/usr/bin/env node
// Sync stats for every video on the band's official YouTube channel into
// data/videos.json. Uses YouTube Data API v3.
//
// Required env:
//   YOUTUBE_API_KEY  — API key restricted to YouTube Data API v3
// Optional env:
//   YOUTUBE_HANDLE   — channel handle without the '@' (default: ULTRALIGERA)
//
// Local use:
//   YOUTUBE_API_KEY=AIza... npm run sync:youtube[:dry]

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const VIDEOS_PATH = resolve(__dirname, "..", "data", "videos.json");

const DRY_RUN = process.argv.includes("--dry-run");
const API_KEY = process.env.YOUTUBE_API_KEY;
const HANDLE = process.env.YOUTUBE_HANDLE || "ULTRALIGERA";

if (!API_KEY) {
  console.error("[sync-youtube] missing YOUTUBE_API_KEY env var");
  process.exit(1);
}

const API = "https://www.googleapis.com/youtube/v3";

async function ytFetch(path, params) {
  const url = new URL(`${API}/${path}`);
  for (const [k, v] of Object.entries({ ...params, key: API_KEY })) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  }
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`YouTube API ${path} HTTP ${res.status}: ${body.slice(0, 500)}`);
  }
  return res.json();
}

async function getChannel(handle) {
  const data = await ytFetch("channels", {
    part: "contentDetails,snippet",
    forHandle: `@${handle}`,
  });
  const ch = data.items?.[0];
  if (!ch) throw new Error(`No channel found for handle @${handle}`);
  return {
    id: ch.id,
    title: ch.snippet.title,
    uploadsPlaylistId: ch.contentDetails.relatedPlaylists.uploads,
  };
}

async function listUploadIds(playlistId) {
  const ids = [];
  let pageToken;
  do {
    const data = await ytFetch("playlistItems", {
      part: "contentDetails",
      maxResults: 50,
      playlistId,
      pageToken,
    });
    for (const item of data.items ?? []) {
      if (item.contentDetails?.videoId) ids.push(item.contentDetails.videoId);
    }
    pageToken = data.nextPageToken;
  } while (pageToken);
  return ids;
}

async function fetchStats(videoIds) {
  const out = [];
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);
    const data = await ytFetch("videos", {
      part: "snippet,statistics,contentDetails,status",
      id: batch.join(","),
    });
    for (const v of data.items ?? []) {
      // Skip videos that aren't publicly viewable (private/unlisted/deleted)
      if (v.status && v.status.privacyStatus && v.status.privacyStatus !== "public") {
        continue;
      }
      out.push({
        id: v.id,
        title: v.snippet.title,
        publishedAt: v.snippet.publishedAt,
        duration: v.contentDetails.duration, // ISO-8601 PTxxMxxS
        viewCount: parseInt(v.statistics.viewCount ?? "0", 10),
        likeCount:
          v.statistics.likeCount != null
            ? parseInt(v.statistics.likeCount, 10)
            : null,
        commentCount:
          v.statistics.commentCount != null
            ? parseInt(v.statistics.commentCount, 10)
            : null,
      });
    }
  }
  return out;
}

/**
 * Detect whether a YouTube video is a Short by querying the public oembed
 * endpoint, which returns the canonical iframe `width` and `height`. Shorts
 * are vertical (height > width); regular videos are horizontal. This is
 * ground truth from YouTube, not a heuristic — the v3 Data API has no
 * `isShort` field as of writing.
 */
async function isShort(videoId) {
  const url = `https://www.youtube.com/oembed?url=https%3A%2F%2Fwww.youtube.com%2Fshorts%2F${videoId}&format=json`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) {
    // oembed 404 for private/region-locked/embed-disabled videos. Fall back to
    // "not a Short" rather than failing the whole sync.
    return false;
  }
  const data = await res.json();
  const w = Number(data.width);
  const h = Number(data.height);
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return false;
  return h > w;
}

async function annotateShorts(videos) {
  // Run with limited concurrency (avoid hammering oembed; ~31 reqs total is fine).
  const limit = 6;
  let cursor = 0;
  async function worker() {
    while (cursor < videos.length) {
      const idx = cursor++;
      try {
        videos[idx].isShort = await isShort(videos[idx].id);
      } catch (err) {
        console.warn(
          `[sync-youtube] oembed failed for ${videos[idx].id}: ${err.message}`,
        );
        videos[idx].isShort = false;
      }
    }
  }
  await Promise.all(Array.from({ length: limit }, worker));
}

async function main() {
  console.log(`[sync-youtube] discovering channel @${HANDLE}`);
  const channel = await getChannel(HANDLE);
  console.log(`[sync-youtube] channel: ${channel.title} (${channel.id})`);

  const ids = await listUploadIds(channel.uploadsPlaylistId);
  console.log(`[sync-youtube] found ${ids.length} upload(s)`);

  if (ids.length === 0) {
    console.error("[sync-youtube] no uploads — refusing to overwrite existing data");
    process.exit(2);
  }

  const videos = await fetchStats(ids);

  console.log(`[sync-youtube] detecting Shorts via oembed orientation…`);
  await annotateShorts(videos);
  const shortCount = videos.filter((v) => v.isShort).length;
  console.log(`[sync-youtube] flagged ${shortCount} video(s) as Shorts`);

  videos.sort((a, b) => b.viewCount - a.viewCount);

  const totalViews = videos.reduce((s, v) => s + v.viewCount, 0);
  const totalLikes = videos.reduce((s, v) => s + (v.likeCount ?? 0), 0);
  console.log(
    `[sync-youtube] ${videos.length} public video(s) — ${totalViews.toLocaleString()} total views, ${totalLikes.toLocaleString()} total likes`,
  );

  // Show the top 3 for the workflow log.
  for (const v of videos.slice(0, 3)) {
    console.log(
      `  · ${v.viewCount.toLocaleString().padStart(10)} views  |  ${(v.likeCount ?? 0).toLocaleString().padStart(7)} likes  |  ${v.title}`,
    );
  }

  const next = {
    source: `https://www.youtube.com/@${HANDLE}`,
    channelId: channel.id,
    channelTitle: channel.title,
    syncedAt: new Date().toISOString(),
    videos,
  };

  if (DRY_RUN) {
    console.log("[sync-youtube] --dry-run: not writing file");
    return;
  }

  // Skip the write if nothing of substance has changed (avoid noise commits
  // when only the syncedAt timestamp would shift).
  let prev = null;
  try {
    prev = JSON.parse(await readFile(VIDEOS_PATH, "utf8"));
  } catch {
    // first run, file may be missing or invalid
  }

  if (prev && Array.isArray(prev.videos) && videosEqualEnough(prev.videos, videos)) {
    console.log("[sync-youtube] no meaningful change vs previous sync");
    return;
  }

  await writeFile(VIDEOS_PATH, JSON.stringify(next, null, 2) + "\n", "utf8");
  console.log(`[sync-youtube] wrote ${VIDEOS_PATH}`);
}

/**
 * Returns true if the two stat arrays are close enough that we don't want to
 * generate a commit. Heuristic: same set of videos, same ranking by views,
 * and no individual viewCount changed by more than 0.5% (or 100 views,
 * whichever is bigger).
 */
function videosEqualEnough(prev, next) {
  if (prev.length !== next.length) return false;
  const byId = new Map(prev.map((v) => [v.id, v]));
  for (let i = 0; i < next.length; i++) {
    const n = next[i];
    const p = byId.get(n.id);
    if (!p) return false; // new video
    // Any change in the Short flag is meaningful — UI depends on it.
    if ((p.isShort ?? false) !== (n.isShort ?? false)) return false;
    const dv = Math.abs((n.viewCount ?? 0) - (p.viewCount ?? 0));
    const threshold = Math.max(100, (p.viewCount ?? 0) * 0.005);
    if (dv > threshold) return false;
  }
  // Compare rank order
  const prevOrder = [...prev]
    .sort((a, b) => b.viewCount - a.viewCount)
    .map((v) => v.id)
    .join(",");
  const nextOrder = next.map((v) => v.id).join(",");
  return prevOrder === nextOrder;
}

main().catch((err) => {
  console.error("[sync-youtube] error:", err.message || err);
  process.exit(1);
});
