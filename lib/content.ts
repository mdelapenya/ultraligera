export const SITE = {
  name: "Ultraligera",
  officialDomain: "ultraligera.com",
  hashtag: "#Ultraligera",
  unofficial: true as const,
  copyrightYear: new Date().getFullYear(),
};

export const SOCIAL = {
  instagram: "https://www.instagram.com/ultraligeraoficial/",
  tiktok: "https://www.tiktok.com/@ultraligeraoficial",
  youtube: "https://www.youtube.com/@ULTRALIGERA",
  spotify: "https://open.spotify.com/intl-es/artist/5Vv5llyiK1nlME2UNDzPBB",
  appleMusic: "https://music.apple.com/es/artist/ultraligera/1588276787",
  shop: "https://merchandtour.com/collections/ultraligera",
};

export type Member = {
  name: string;
  roleKey: "vocals" | "guitar" | "bass" | "drums" | "rhythmGuitar";
  liveOnly?: boolean;
};

export const MEMBERS: Member[] = [
  { name: "Gisme", roleKey: "vocals" },
  { name: "Coque Fernández", roleKey: "guitar" },
  { name: "Santi Urruela", roleKey: "bass" },
  { name: "Martín Aparicio", roleKey: "drums" },
  { name: "Mario", roleKey: "rhythmGuitar", liveOnly: true },
];

export type ReleaseKind = "album" | "ep" | "single";

export type Release = {
  /** Stable slug derived from title. */
  slug: string;
  title: string;
  year: number | null;
  releaseDate: string | null;
  kind: ReleaseKind;
  cover: string | null;
  appleMusicUrl?: string | null;
  appleId?: number | null;
  trackCount?: number | null;
  /** YouTube videoclip id (curated manually for the lead releases). */
  youtubeId?: string;
  /** Editorial highlights for the lead releases. */
  highlights?: string[];
};

import discoData from "@/data/discography.json";

/**
 * Curated editorial overlay merged on top of the iTunes-synced data, keyed by
 * Apple collection id (most stable). YouTube IDs and highlights live here so
 * that the nightly sync never clobbers them.
 */
const EDITORIAL: Record<
  number,
  Pick<Release, "youtubeId" | "highlights">
> = {
  // Pelo de foca (album, appleId 1797834200 — adjust if iTunes changes)
  // Europa - EP
  // Lapsus (single) — used as the lead artwork until the album drops
};

// Manually keyed lookup by title slug since Apple IDs might change. This makes
// the editorial overlay robust to id renumbering.
const EDITORIAL_BY_TITLE: Record<string, Pick<Release, "youtubeId" | "highlights">> = {
  "pelo de foca": {
    youtubeId: "z6EMjnT-rrk",
    highlights: ["Disco de oro: Matanza en el Hotel", "7× La Riviera (Madrid)"],
  },
  "europa": {
    youtubeId: "QggqPbBm-iM",
  },
  "lapsus": {
    youtubeId: "ojShHLUv_WY",
  },
};

function normalizeTitle(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export const RELEASES: Release[] = (
  discoData.releases as Omit<Release, "youtubeId" | "highlights">[]
)
  .map((r) => {
    const ed = EDITORIAL[r.appleId ?? -1] ?? EDITORIAL_BY_TITLE[normalizeTitle(r.title)];
    return { ...r, ...(ed ?? {}) } as Release;
  })
  // Newest first
  .sort((a, b) => (b.releaseDate ?? "").localeCompare(a.releaseDate ?? ""));

export const ALBUMS_AND_EPS = RELEASES.filter((r) => r.kind !== "single");
export const SINGLES = RELEASES.filter((r) => r.kind === "single");

export type Gig = {
  date: string;
  rawDate: string;
  venue: string;
  city?: string;
  ticketUrl?: string;
  freeEntry?: boolean;
};

import gigsData from "@/data/gigs.json";

export const GIGS: Gig[] = (gigsData.gigs as Gig[]).slice().sort((a, b) =>
  a.rawDate.localeCompare(b.rawDate),
);

export type Video = {
  id: string;
  title: string;
  publishedAt: string;
  duration: string;
  viewCount: number;
  likeCount: number | null;
  commentCount: number | null;
  /** True if YouTube reports the video with vertical orientation (Short). */
  isShort?: boolean;
};

import videosData from "@/data/videos.json";

export const VIDEOS: Video[] = (videosData.videos as Video[]) ?? [];
export const VIDEOS_SYNCED_AT: string | null = videosData.syncedAt ?? null;
export const VIDEOS_CHANNEL_TITLE: string | null = videosData.channelTitle ?? null;

export type NavItem = { href: string; labelKey: NavKey };
export type NavKey = "tour" | "music" | "band" | "media" | "gallery" | "contact" | "shop";

export const NAV: NavItem[] = [
  { href: "/tour", labelKey: "tour" },
  { href: "/musica", labelKey: "music" },
  { href: "/banda", labelKey: "band" },
  { href: "/media", labelKey: "media" },
  { href: "/galeria", labelKey: "gallery" },
];

/**
 * Disclaimer: this is an unofficial fan-built site about the band Ultraligera.
 * It is not affiliated with, endorsed by, or representing the band, their
 * management, or any associated legal entity. All third-party trademarks,
 * names and works belong to their respective owners. Factual references
 * (member names, release titles, public tour dates, awards) are used here
 * editorially. No band-owned text, lyrics, artwork or audio is reproduced.
 */
