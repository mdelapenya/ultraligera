import type { Locale } from "./i18n";
import { SITE_URL } from "./seo";
import {
  BAND,
  GIGS,
  MEMBERS,
  RELEASES,
  SITE,
  SOCIAL,
  type Gig,
  type Release,
} from "./content";

/**
 * JSON-LD schema payloads. Each helper returns a plain object ready to
 * be JSON-stringified into a <script type="application/ld+json"> tag.
 *
 * Audit recommendation #8: structured data is the single highest-leverage
 * SEO/GEO/AEO win for this site. The content already maps cleanly to
 * schema.org music types — this file does the mapping.
 */

const OFFICIAL_URL = `https://${SITE.officialDomain}`;

const sameAsLinks = [
  OFFICIAL_URL,
  SOCIAL.spotify,
  SOCIAL.appleMusic,
  SOCIAL.youtube,
  SOCIAL.instagram,
  SOCIAL.tiktok,
];

export function websiteSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${BAND.name} fan site`,
    url: SITE_URL,
    description:
      "Unofficial fan site about Ultraligera: tour dates, discography and official links.",
    inLanguage: ["es", "en"],
    about: {
      "@type": "MusicGroup",
      name: BAND.name,
      url: OFFICIAL_URL,
    },
  };
}

/**
 * Full MusicGroup entity. Use on the home and band pages. `member` includes
 * only the canonical recording lineup (live-only collaborators excluded,
 * since they don't represent the studio entity).
 */
export function musicGroupSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: BAND.name,
    url: OFFICIAL_URL,
    logo: BAND.logo,
    image: BAND.logo,
    foundingDate: String(BAND.foundingYear),
    foundingLocation: {
      "@type": "Place",
      name: BAND.foundingLocation,
    },
    sameAs: sameAsLinks,
    member: MEMBERS.filter((m) => !m.liveOnly).map((m) => ({
      "@type": "Person",
      name: m.name,
    })),
    album: RELEASES.filter((r) => r.kind === "album").map((r) => ({
      "@type": "MusicAlbum",
      name: r.title,
      ...(r.releaseDate ? { datePublished: r.releaseDate } : {}),
      ...(r.cover ? { image: r.cover } : {}),
      ...(r.appleMusicUrl ? { url: r.appleMusicUrl } : {}),
    })),
  };
}

export function musicAlbumSchema(release: Release): object {
  return {
    "@context": "https://schema.org",
    "@type": "MusicAlbum",
    name: release.title,
    byArtist: {
      "@type": "MusicGroup",
      name: BAND.name,
      url: OFFICIAL_URL,
    },
    ...(release.releaseDate
      ? { datePublished: release.releaseDate }
      : release.year != null
        ? { datePublished: String(release.year) }
        : {}),
    ...(release.cover ? { image: release.cover } : {}),
    ...(release.appleMusicUrl ? { url: release.appleMusicUrl } : {}),
    ...(release.trackCount != null ? { numTracks: release.trackCount } : {}),
    albumProductionType:
      release.kind === "album"
        ? "https://schema.org/StudioAlbum"
        : release.kind === "ep"
          ? "https://schema.org/EPAlbum"
          : "https://schema.org/SingleAlbum",
  };
}

/**
 * ItemList wrapping each release as a MusicAlbum. Used on /musica so the
 * whole discography is exposed as a single structured payload.
 */
export function discographySchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: RELEASES.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: musicAlbumSchema(r),
    })),
  };
}

export function musicEventSchema(gig: Gig): object {
  return {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: `${BAND.name} — ${gig.venue}`,
    startDate: gig.rawDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: gig.venue,
      ...(gig.city
        ? {
            address: {
              "@type": "PostalAddress",
              addressLocality: gig.city,
              addressCountry: "ES",
            },
          }
        : {}),
    },
    performer: {
      "@type": "MusicGroup",
      name: BAND.name,
      url: OFFICIAL_URL,
    },
    ...(gig.ticketUrl
      ? {
          offers: {
            "@type": "Offer",
            url: gig.ticketUrl,
            availability: "https://schema.org/InStock",
            price: gig.freeEntry ? "0" : undefined,
            priceCurrency: "EUR",
          },
        }
      : {}),
  };
}

/** ItemList of upcoming gigs. Past gigs are omitted — engines reward
 *  forward-looking event data. */
export function upcomingToursSchema(): object {
  const today = new Date();
  const upcoming = GIGS.filter((g) => new Date(g.rawDate) >= today);
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: upcoming.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: musicEventSchema(g),
    })),
  };
}

export function breadcrumbsSchema(
  locale: Locale,
  trail: { name: string; path: string }[],
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}/${locale}${item.path}`,
    })),
  };
}
