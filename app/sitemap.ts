import type { MetadataRoute } from "next";
import { LOCALES } from "@/lib/i18n";
import { SITE_URL } from "@/lib/seo";

/** Every public route, locale-prefixed. Mirror of what's in NAV plus the
 *  routes that don't show in nav (home, aviso-legal). Keep this list in
 *  sync when adding new pages — the audit explicitly flagged the missing
 *  sitemap as a high-impact SEO miss. */
const PATHS = [
  "",
  "/tour",
  "/musica",
  "/banda",
  "/media",
  "/aviso-legal",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const path of PATHS) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified,
        changeFrequency: path === "/tour" ? "daily" : "weekly",
        priority: path === "" ? 1.0 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${SITE_URL}/${l}${path}`]),
          ),
        },
      });
    }
  }

  return entries;
}
