import { GIGS, MEMBERS, RELEASES, VIDEOS } from "@/lib/content";
import { getDict, type Locale } from "@/lib/i18n";

export type SearchKind = "page" | "video" | "gig" | "release" | "member";

export type SearchItem = {
  kind: SearchKind;
  title: string;
  subtitle?: string;
  url: string;
  external?: boolean;
  /** Pre-normalized search blob (lowercase, no diacritics). */
  keywords: string;
};

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function buildSearchIndex(locale: Locale): SearchItem[] {
  const d = getDict(locale);
  const items: SearchItem[] = [];

  // Pages — let users navigate via search ("tour", "entradas", "fotos", etc.)
  const pageEntries: Array<{
    href: string;
    title: string;
    subtitle: string;
    aliases: string[];
  }> = [
    {
      href: "/tour",
      title: d.nav.tour,
      subtitle: d.tour.subtitle,
      aliases:
        locale === "es"
          ? ["tour", "gira", "fechas", "conciertos", "entradas", "tickets", "festivales"]
          : ["tour", "shows", "dates", "concerts", "tickets", "festivals"],
    },
    {
      href: "/musica",
      title: d.nav.music,
      subtitle: d.music.title,
      aliases:
        locale === "es"
          ? ["musica", "discografia", "discos", "albumes", "ep", "single", "canciones"]
          : ["music", "discography", "albums", "ep", "single", "songs"],
    },
    {
      href: "/banda",
      title: d.nav.band,
      subtitle: d.band.title,
      aliases:
        locale === "es"
          ? ["banda", "miembros", "formacion", "biografia", "bio"]
          : ["band", "members", "line-up", "biography", "bio"],
    },
    {
      href: "/media",
      title: d.nav.media,
      subtitle: d.media.title,
      aliases:
        locale === "es"
          ? ["media", "videos", "shorts", "videoclips", "youtube"]
          : ["media", "videos", "shorts", "youtube"],
    },
    {
      href: "/galeria",
      title: d.nav.gallery,
      subtitle: d.gallery.title,
      aliases: locale === "es" ? ["galeria", "fotos", "photo"] : ["gallery", "photos", "photo"],
    },
  ];
  for (const p of pageEntries) {
    items.push({
      kind: "page",
      title: p.title,
      subtitle: p.subtitle,
      url: `/${locale}${p.href}`,
      keywords: normalize([p.title, ...p.aliases].join(" ")),
    });
  }

  // Members → /banda
  for (const m of MEMBERS) {
    items.push({
      kind: "member",
      title: m.name,
      subtitle: d.roles[m.roleKey],
      url: `/${locale}/banda`,
      keywords: normalize(`${m.name} ${d.roles[m.roleKey]}`),
    });
  }

  // Releases → /musica
  for (const r of RELEASES) {
    const kindLabel =
      r.kind === "album" ? d.music.album : r.kind === "ep" ? d.music.ep : d.music.single;
    items.push({
      kind: "release",
      title: r.title,
      subtitle: `${kindLabel} · ${r.year}`,
      url: `/${locale}/musica`,
      keywords: normalize(`${r.title} ${r.year} ${kindLabel}`),
    });
  }

  // Gigs → ticket URL if available, otherwise /tour. Search matches on venue
  // name and date; we don't add the generic word "entradas" here because that
  // would flood results — searching "entradas" should land on the Tour page
  // (registered above as a page entry).
  for (const g of GIGS) {
    const extraTerms = g.freeEntry
      ? locale === "es"
        ? " entrada libre gratis"
        : " free entry"
      : "";
    items.push({
      kind: "gig",
      title: g.venue,
      subtitle: g.date,
      url: g.ticketUrl ?? `/${locale}/tour`,
      external: !!g.ticketUrl,
      keywords: normalize(`${g.venue} ${g.date} ${g.rawDate}${extraTerms}`),
    });
  }

  // Videos and Shorts → YouTube
  for (const v of VIDEOS) {
    items.push({
      kind: "video",
      title: v.title,
      subtitle: v.isShort ? d.media.typeShorts : d.media.typeVideos,
      url: v.isShort
        ? `https://www.youtube.com/shorts/${v.id}`
        : `https://www.youtube.com/watch?v=${v.id}`,
      external: true,
      keywords: normalize(v.title),
    });
  }

  return items;
}

/**
 * Substring filter over normalized keywords. For ~70 items a linear scan
 * is faster than any indexing.
 */
export function searchItems(index: SearchItem[], query: string, limit = 30): SearchItem[] {
  const q = normalize(query.trim());
  if (q.length < 2) return [];
  const out: SearchItem[] = [];
  for (const item of index) {
    if (item.keywords.includes(q)) {
      out.push(item);
      if (out.length >= limit) break;
    }
  }
  return out;
}
