import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, getDict, type Locale } from "@/lib/i18n";
import { BAND, SITE, SOCIAL } from "@/lib/content";
import { buildAlternates } from "@/lib/seo";
import { breadcrumbsSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDict(locale);
  return {
    title: d.contact.title,
    description: d.descriptions.contact,
    alternates: buildAlternates(locale, "/contacto"),
  };
}

const OFFICIAL_CHANNELS = [
  { label: "Instagram", href: SOCIAL.instagram },
  { label: "TikTok", href: SOCIAL.tiktok },
  { label: "YouTube", href: SOCIAL.youtube },
  { label: "Spotify", href: SOCIAL.spotify },
  { label: "Apple Music", href: SOCIAL.appleMusic },
];

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l: Locale = locale;
  const d = getDict(l);

  return (
    <>
      <JsonLd
        data={breadcrumbsSchema(l, [
          { name: BAND.name, path: "" },
          { name: d.contact.title, path: "/contacto" },
        ])}
      />
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <header className="mb-16 md:mb-20">
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)] mb-4">
            {d.nav.contact}
          </p>
          <h1 className="display text-6xl md:text-9xl leading-[0.85]">
            {d.contact.title}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/75">
            {d.contact.subtitle}
          </p>
        </header>

        <section className="mb-16">
          <h2 className="display text-3xl md:text-5xl mb-4">
            {d.contact.officialChannelsTitle}
          </h2>
          <p className="text-white/80 leading-relaxed mb-6">
            {d.contact.officialChannelsBody}
          </p>
          <ul className="space-y-2 text-base">
            {OFFICIAL_CHANNELS.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/85 underline underline-offset-4 hover:text-[color:var(--accent)]"
                >
                  {c.label} ↗
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href={`https://www.${SITE.officialDomain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/85 underline underline-offset-4 hover:text-[color:var(--accent)]"
              >
                {SITE.officialDomain} ↗
              </a>
            </li>
          </ul>
        </section>

        <section className="border-t border-[color:var(--border)] pt-12">
          <h2 className="display text-3xl md:text-5xl mb-4">
            {d.contact.feedbackTitle}
          </h2>
          <p className="text-white/80 leading-relaxed mb-6">
            {d.contact.feedbackBody}
          </p>
          <a
            href={`${SITE.repoUrl}/issues/new`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-white/25 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] px-5 py-3 text-sm uppercase tracking-[0.18em]"
          >
            {l === "es" ? "Abrir un issue en GitHub" : "Open an issue on GitHub"} ↗
          </a>
          <p className="mt-4 text-xs font-mono uppercase tracking-widest text-white/40">
            <Link
              href={`/${l}/aviso-legal`}
              className="hover:text-white transition-colors"
            >
              {d.footer.legal} →
            </Link>
          </p>
        </section>
      </article>
    </>
  );
}
