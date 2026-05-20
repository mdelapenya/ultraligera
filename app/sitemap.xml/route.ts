import { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n";
import { SITE_URL } from "@/lib/seo";

const PATHS = [
  "",
  "/tour",
  "/musica",
  "/banda",
  "/media",
  "/aviso-legal",
] as const;

/**
 * Custom sitemap handler that mirrors what Next.js' MetadataRoute.Sitemap
 * would produce, but adds an `<?xml-stylesheet?>` instruction pointing to
 * `/sitemap.xsl`. Crawlers ignore the stylesheet and parse the XML; humans
 * opening the URL in a browser see a styled, readable table.
 *
 * Pre-rendered at build time (no per-request work).
 */
export const dynamic = "force-static";

export async function GET() {
  const lastmod = new Date().toISOString().slice(0, 10);

  const urls = LOCALES.flatMap((locale) =>
    PATHS.map((path) => {
      const loc = `${SITE_URL}/${locale}${path}`;
      const changefreq = path === "/tour" ? "daily" : "weekly";
      const priority = path === "" ? "1.0" : "0.7";

      const alternates = [
        ...LOCALES.map(
          (l) =>
            `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE_URL}/${l}${path}"/>`,
        ),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/${DEFAULT_LOCALE}${path}"/>`,
      ].join("\n");

      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${alternates}
  </url>`;
    }),
  ).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
