import type { Metadata } from "next";
import { LOCALES, DEFAULT_LOCALE, type Locale } from "./i18n";

/** Absolute origin used for canonical, hreflang and metadataBase. */
export const SITE_URL = "https://ultraligera.vercel.app";

/**
 * Build `alternates.canonical` + `alternates.languages` for a given page.
 * URLs are returned as paths (relative to metadataBase) so this helper is
 * environment-agnostic.
 *
 * @param locale  active locale for this render
 * @param path    path WITHOUT the locale prefix (e.g. "", "/banda", "/tour")
 */
export function buildAlternates(
  locale: Locale,
  path: string,
): NonNullable<Metadata["alternates"]> {
  const norm =
    path === "" || path === "/"
      ? ""
      : path.startsWith("/")
        ? path
        : `/${path}`;

  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = `/${l}${norm}`;
  }
  // Tell crawlers which version to surface when no locale match is possible.
  languages["x-default"] = `/${DEFAULT_LOCALE}${norm}`;

  return {
    canonical: `/${locale}${norm}`,
    languages,
  };
}
