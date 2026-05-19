#!/usr/bin/env node
// Pull the band's discography from the public iTunes Search API and write
// data/discography.json. No auth needed; the API returns Apple-CDN artwork
// URLs that we just link to (never rehost).
//
// Optional env:
//   ITUNES_ARTIST_ID — defaults to 1588276787 (Ultraligera on Apple Music ES)
//   ITUNES_COUNTRY   — defaults to "es"

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(__dirname, "..", "data", "discography.json");

const DRY_RUN = process.argv.includes("--dry-run");
const ARTIST_ID = process.env.ITUNES_ARTIST_ID || "1588276787";
const COUNTRY = process.env.ITUNES_COUNTRY || "es";

const UA =
  "Mozilla/5.0 (compatible; ultraligera-fan-site-sync/1.0; +https://github.com)";

/** Apple thumbnails ship at 100×100. We use 600×600 — sharp enough on Retina. */
function highResArtwork(url) {
  if (!url) return null;
  return url.replace(/\/\d+x\d+(bb)?(?:-[0-9]+)?\.(jpg|png|webp)$/i, "/600x600bb.jpg");
}

function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function classify(c) {
  // iTunes wrapperType=collection, collectionType=Album|EP. Single comes from
  // the name suffix " - Single" or trackCount === 1.
  const name = c.collectionName ?? "";
  if (/-\s*EP$/i.test(name) || c.collectionType === "EP") return "ep";
  if (/-\s*Single$/i.test(name) || c.trackCount === 1) return "single";
  return "album";
}

function cleanTitle(s) {
  return s.replace(/\s*-\s*(EP|Single)\s*$/i, "").trim();
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) {
    throw new Error(`iTunes API ${res.status}: ${url}`);
  }
  return res.json();
}

async function fetchDiscography() {
  // `lookup` with entity=album returns the artist + all their albums/EPs/singles.
  const url = `https://itunes.apple.com/lookup?id=${ARTIST_ID}&entity=album&country=${COUNTRY}&limit=200`;
  const data = await fetchJson(url);
  const artist = data.results?.find((r) => r.wrapperType === "artist");
  const collections = data.results?.filter((r) => r.wrapperType === "collection") ?? [];
  return { artist, collections };
}

async function main() {
  console.log(`[sync-disco] fetching artist ${ARTIST_ID} (country=${COUNTRY})`);
  const { artist, collections } = await fetchDiscography();
  if (!artist) {
    console.error("[sync-disco] no artist found — aborting");
    process.exit(2);
  }
  if (collections.length === 0) {
    console.error("[sync-disco] no collections returned — aborting (would empty the file)");
    process.exit(2);
  }
  console.log(`[sync-disco] ${artist.artistName} — ${collections.length} release(s)`);

  const releases = collections
    .map((c) => {
      const kind = classify(c);
      const title = cleanTitle(c.collectionName);
      const year = c.releaseDate ? Number(c.releaseDate.slice(0, 4)) : null;
      // Append year suffix for singles to keep slugs unique (e.g. two "Europa"
      // singles released in different years).
      const slug =
        slugify(title) +
        (kind === "single" ? `-single${year ? "-" + year : ""}` : "");
      return {
        slug,
        title,
        year,
        releaseDate: c.releaseDate ?? null,
        kind,
        cover: highResArtwork(c.artworkUrl100),
        appleMusicUrl: c.collectionViewUrl ?? null,
        trackCount: c.trackCount ?? null,
        appleId: c.collectionId ?? null,
      };
    })
    .sort((a, b) => (b.releaseDate ?? "").localeCompare(a.releaseDate ?? ""));

  const summary = {
    album: releases.filter((r) => r.kind === "album").length,
    ep: releases.filter((r) => r.kind === "ep").length,
    single: releases.filter((r) => r.kind === "single").length,
  };
  console.log(
    `[sync-disco] album=${summary.album}  ep=${summary.ep}  single=${summary.single}`,
  );
  // Show the 5 most recent
  for (const r of releases.slice(0, 5)) {
    console.log(`  · ${r.releaseDate?.slice(0, 10) ?? "—"}  [${r.kind.padEnd(6)}]  ${r.title}`);
  }

  const next = {
    source: `https://itunes.apple.com/lookup?id=${ARTIST_ID}&entity=album`,
    artistId: ARTIST_ID,
    artistName: artist.artistName,
    country: COUNTRY,
    syncedAt: new Date().toISOString(),
    releases,
  };

  if (DRY_RUN) {
    console.log("[sync-disco] --dry-run: not writing file");
    return;
  }

  // Skip the write if nothing meaningful changed (same releases, same set).
  let prev = null;
  try {
    prev = JSON.parse(await readFile(OUT_PATH, "utf8"));
  } catch {
    /* first run */
  }
  if (prev && releasesEqual(prev.releases ?? [], releases)) {
    console.log("[sync-disco] no changes vs previous sync");
    return;
  }

  await writeFile(OUT_PATH, JSON.stringify(next, null, 2) + "\n", "utf8");
  console.log(`[sync-disco] wrote ${OUT_PATH}`);
}

function releasesEqual(a, b) {
  if (a.length !== b.length) return false;
  const byId = new Map(a.map((r) => [r.appleId, r]));
  for (const r of b) {
    const p = byId.get(r.appleId);
    if (!p) return false;
    if (p.slug !== r.slug) return false;
    if (p.title !== r.title) return false;
    if (p.releaseDate !== r.releaseDate) return false;
    if (p.kind !== r.kind) return false;
    if (p.cover !== r.cover) return false;
  }
  return true;
}

main().catch((err) => {
  console.error("[sync-disco] error:", err.message || err);
  process.exit(1);
});
