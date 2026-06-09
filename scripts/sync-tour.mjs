#!/usr/bin/env node
// Fetch the band's tour page, parse upcoming gigs, and merge new entries into
// data/gigs.json. Only adds; never removes (a human reviews the PR).
//
// Runs in CI on a schedule. Locally: `node scripts/sync-tour.mjs [--dry-run]`.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const TOUR_URL = "https://www.ultraligera.com/tour";
const UA =
  "Mozilla/5.0 (compatible; ultraligera-fan-site-sync/1.0; +https://github.com)";

const __dirname = dirname(fileURLToPath(import.meta.url));
const GIGS_PATH = resolve(__dirname, "..", "data", "gigs.json");

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");

/** Match a raw date token like 16.5.26, 30.7/1.8.26, 13/15.8.26, 9.10.26 */
const DATE_RE = /\d+(?:[./]\d+)*\.\d+(?:[./]\d+)*\.\d{2}/g;

/** Parse a raw date token to {iso, display}. Returns null on failure. */
function parseDateToken(token) {
  const groups = token.split("/");
  const lastParts = groups[groups.length - 1].split(".");
  const yearStr = lastParts[lastParts.length - 1];
  if (!/^\d{2}$/.test(yearStr)) return null;
  const year = 2000 + parseInt(yearStr, 10);

  const firstParts = groups[0].split(".");
  let day, month;
  if (firstParts.length >= 2) {
    day = parseInt(firstParts[0], 10);
    month = parseInt(firstParts[1], 10);
  } else {
    day = parseInt(firstParts[0], 10);
    if (lastParts.length < 2) return null;
    month = parseInt(lastParts[lastParts.length - 2], 10);
  }

  if (!Number.isFinite(day) || !Number.isFinite(month)) return null;
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  // Preserve the original token as the display string. The site sometimes
  // adds spaced en-dashes for multi-day ranges; we keep whatever they shipped.
  return { iso, display: token };
}

// Minimal named-entity table — enough for Spanish content.
const NAMED_ENTITIES = {
  nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'",
  aacute: "á", eacute: "é", iacute: "í", oacute: "ó", uacute: "ú",
  Aacute: "Á", Eacute: "É", Iacute: "Í", Oacute: "Ó", Uacute: "Ú",
  ntilde: "ñ", Ntilde: "Ñ",
  iuml: "ï", uuml: "ü", Iuml: "Ï", Uuml: "Ü",
  ouml: "ö", auml: "ä", Ouml: "Ö", Auml: "Ä",
  iquest: "¿", iexcl: "¡",
  ldquo: "“", rdquo: "”", lsquo: "‘", rsquo: "’",
  ndash: "–", mdash: "—", hellip: "…", middot: "·", bull: "•",
};

function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&([a-zA-Z]+);/g, (m, name) =>
      Object.prototype.hasOwnProperty.call(NAMED_ENTITIES, name)
        ? NAMED_ENTITIES[name]
        : m,
    );
}

/** Strip <script>/<style> and tags, decode entities, collapse whitespace. */
function htmlToText(html) {
  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
    .replace(/<[^>]+>/g, " ");
  return decodeEntities(stripped).replace(/\s+/g, " ").trim();
}

/**
 * Parse the tour-page text into a list of {rawDate, date, venue}.
 *
 * The page is a Wix dump where the gig section appears as:
 *   "TOUR 2026 16.5.26 - Festival X 23.5.26 - Festival Y ... 17.10.26 - Last - Entradas - - Entradas - ..."
 * After the last gig, a long run of "- Entradas -" / "- Entrada libre -" buttons
 * follows. We slice from the first date marker up to that ticket-button run.
 */
function parseGigs(text) {
  // Anchor the section. If "TOUR 2026" isn't present, bail.
  const anchor = text.indexOf("TOUR 2026");
  let section = anchor >= 0 ? text.slice(anchor) : text;
  // Cut at the first ticket-button run, which only appears after all gigs.
  const ticketRun = section.search(/-\s*(?:Entradas|Entrada libre)\s*-/);
  if (ticketRun > 0) section = section.slice(0, ticketRun);

  // Find every date and capture the venue between this date and the next.
  const matches = [...section.matchAll(DATE_RE)];
  const gigs = [];
  for (let i = 0; i < matches.length; i++) {
    const dateMatch = matches[i];
    const start = dateMatch.index + dateMatch[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : section.length;
    const between = section.slice(start, end);
    // venue chunk starts with " - " separator
    const venue = between
      .replace(/^\s*[-–—]\s*/, "")
      .replace(/\s*[-–—]\s*$/, "")
      .replace(/\s+/g, " ")
      .trim();
    if (!venue) continue;

    const parsed = parseDateToken(dateMatch[0]);
    if (!parsed) continue;

    gigs.push({ rawDate: parsed.iso, date: parsed.display, venue });
  }
  return gigs;
}

function gigKey(g) {
  return `${g.rawDate}|${g.venue.toLowerCase().replace(/\s+/g, " ").trim()}`;
}

/** Extract every ticket-button anchor: returns [{url, isFree}, ...] in document order. */
function parseTicketAnchors(html) {
  // Wix renders each button as: <a href="..." aria-label="- Entradas -" ...>
  // Use lookaheads so we don't care about attribute order.
  const re =
    /<a\b(?=[^>]*\bhref="([^"]+)")(?=[^>]*\baria-label="-\s*(Entradas|Entrada libre)\s*-")[^>]*>/gi;
  const out = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    out.push({ url: decodeEntities(m[1]), isFree: /libre/i.test(m[2]) });
  }
  return out;
}

function normalizeForMatch(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function venueTokens(venue) {
  // Tokens >= 3 chars carry signal; shorter ones (de, la, el, en) don't.
  return normalizeForMatch(venue)
    .split(" ")
    .filter((t) => t.length >= 3);
}

function scoreMatch(url, venue) {
  const u = normalizeForMatch(url);
  return venueTokens(venue).filter((t) => u.includes(t)).length;
}

/**
 * Match each ticket button to the gig it most likely belongs to.
 *
 * Strategy: greedy best-token-score. For every ticket URL we scan all
 * unassigned gigs and pick the one whose venue name shares the most tokens
 * with the URL slug. Only assigns when score > 0 — if no gig shares any
 * token with the URL the ticket is logged as unmatched (needs manual review).
 *
 * This is safer than walking in parallel document order because Wix does not
 * guarantee that ticket buttons appear in the same DOM order as the gig text.
 * A positional fallback silently produces wrong data when a new gig is
 * inserted or a URL slug uses a city name instead of the venue name.
 */
function assignTickets(gigs, tickets) {
  const out = gigs.map((g) => ({ ...g }));
  const assigned = new Set(); // gig indices already matched

  for (const ticket of tickets) {
    let bestScore = 0;
    let bestIdx = -1;
    for (let i = 0; i < out.length; i++) {
      if (assigned.has(i)) continue;
      const s = scoreMatch(ticket.url, out[i].venue);
      if (s > bestScore) {
        bestScore = s;
        bestIdx = i;
      }
    }
    if (bestIdx >= 0) {
      out[bestIdx].ticketUrl = ticket.url;
      if (ticket.isFree) out[bestIdx].freeEntry = true;
      assigned.add(bestIdx);
    } else {
      // No venue name tokens appear anywhere in this URL. Don't guess —
      // a wrong URL is worse than a missing one. Flag for manual review.
      console.warn(
        `[sync-tour] unmatched ticket (no token overlap with any gig) — needs manual review: ${ticket.url}`,
      );
    }
  }
  return out;
}

/** Build a gig object with fields in a canonical order so JSON diffs stay clean. */
function canonicalize(g) {
  const o = { rawDate: g.rawDate, date: g.date, venue: g.venue };
  if (g.city) o.city = g.city;
  if (g.ticketUrl) o.ticketUrl = g.ticketUrl;
  if (g.freeEntry) o.freeEntry = true;
  return o;
}

async function main() {
  console.log(`[sync-tour] fetching ${TOUR_URL}`);
  const res = await fetch(TOUR_URL, {
    headers: {
      "User-Agent": UA,
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
    },
    redirect: "follow",
  });
  if (!res.ok) {
    console.error(`[sync-tour] fetch failed: HTTP ${res.status}`);
    process.exit(1);
  }
  const html = await res.text();
  const text = htmlToText(html);
  const parsedGigs = parseGigs(text);

  if (parsedGigs.length === 0) {
    console.error("[sync-tour] parsed 0 gigs — site layout likely changed. Aborting.");
    process.exit(2);
  }
  console.log(`[sync-tour] parsed ${parsedGigs.length} gigs from the official site`);

  const tickets = parseTicketAnchors(html);
  console.log(`[sync-tour] parsed ${tickets.length} ticket button(s)`);

  const scraped = assignTickets(parsedGigs, tickets);
  const withTickets = scraped.filter((g) => g.ticketUrl).length;
  console.log(`[sync-tour] paired ${withTickets} gig(s) with ticket URLs`);

  const current = JSON.parse(await readFile(GIGS_PATH, "utf8"));
  const existing = Array.isArray(current.gigs) ? current.gigs : [];
  const scrapedByKey = new Map(scraped.map((g) => [gigKey(g), g]));
  const existingKeys = new Set(existing.map(gigKey));

  // Update existing gigs with newly-scraped ticketUrl / freeEntry.
  const updated = [];
  const mergedExisting = existing.map((ex) => {
    const s = scrapedByKey.get(gigKey(ex));
    if (!s) return ex;
    const next = { ...ex };
    let changed = false;
    if (s.ticketUrl && s.ticketUrl !== ex.ticketUrl) {
      next.ticketUrl = s.ticketUrl;
      changed = true;
    }
    if (s.freeEntry && !ex.freeEntry) {
      next.freeEntry = true;
      changed = true;
    }
    if (changed) updated.push(next);
    return next;
  });

  const additions = scraped.filter((g) => !existingKeys.has(gigKey(g)));

  if (additions.length === 0 && updated.length === 0) {
    console.log("[sync-tour] no new gigs, no ticket-URL changes");
    return;
  }

  if (additions.length) {
    console.log(`[sync-tour] adding ${additions.length} new gig(s):`);
    for (const g of additions)
      console.log(`  + ${g.rawDate}  ${g.venue}${g.ticketUrl ? "  [→ " + g.ticketUrl + "]" : ""}`);
  }
  if (updated.length) {
    console.log(`[sync-tour] updating ${updated.length} existing gig(s):`);
    for (const g of updated) console.log(`  ~ ${g.rawDate}  ${g.venue}`);
  }

  const merged = [...mergedExisting, ...additions]
    .map(canonicalize)
    .sort((a, b) => a.rawDate.localeCompare(b.rawDate));

  const next = {
    ...current,
    syncedAt: new Date().toISOString(),
    gigs: merged,
  };

  if (DRY_RUN) {
    console.log("[sync-tour] --dry-run: not writing file");
    return;
  }

  await writeFile(GIGS_PATH, JSON.stringify(next, null, 2) + "\n", "utf8");
  console.log(`[sync-tour] wrote ${GIGS_PATH}`);

  // Emit a summary for the workflow to include in the PR body.
  const lines = [];
  if (additions.length) {
    lines.push("### New gigs", ...additions.map((g) => `- \`${g.rawDate}\` · ${g.venue}`));
  }
  if (updated.length) {
    if (lines.length) lines.push("");
    lines.push("### Updated ticket links", ...updated.map((g) => `- \`${g.rawDate}\` · ${g.venue}`));
  }
  const summary = lines.join("\n");
  const totalChanges = additions.length + updated.length;
  if (process.env.GITHUB_OUTPUT) {
    await writeFile(
      process.env.GITHUB_OUTPUT,
      `added=${additions.length}\nupdated=${updated.length}\nchanges=${totalChanges}\nsummary<<__EOF__\n${summary}\n__EOF__\n`,
      { flag: "a" },
    );
  }
}

main().catch((err) => {
  console.error("[sync-tour] error:", err);
  process.exit(1);
});
