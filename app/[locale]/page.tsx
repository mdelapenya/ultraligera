import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, getDict, type Locale } from "@/lib/i18n";
import { GIGS, RELEASES, SOCIAL } from "@/lib/content";
import { buildAlternates } from "@/lib/seo";
import { Marquee } from "@/components/Marquee";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDict(locale);
  return {
    description: d.descriptions.home,
    alternates: buildAlternates(locale, ""),
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l: Locale = locale;
  const d = getDict(l);

  const today = new Date();
  const upcoming = GIGS.filter((g) => new Date(g.rawDate) >= today).slice(0, 4);
  const latest = RELEASES[0];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-block w-2 h-2 rounded-full bg-[color:var(--accent)]" />
            <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">
              {d.home.eyebrow}
            </p>
          </div>
          <h1 className="display text-[18vw] md:text-[12rem] leading-[0.85] tracking-tight">
            Ultra<span className="text-[color:var(--accent)]">ligera</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg md:text-xl text-white/80 leading-relaxed">
            {d.home.tagline}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={`/${l}/tour`}
              className="inline-flex items-center gap-2 bg-[color:var(--accent)] hover:bg-white hover:text-black transition-colors px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] rounded-sm"
            >
              {d.home.ctaTour} →
            </Link>
            <a
              href={SOCIAL.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/25 hover:border-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] rounded-sm"
            >
              {d.home.ctaListen} →
            </a>
          </div>
        </div>
      </section>

      <Marquee
        accent
        items={[
          "TOUR 2026",
          "LAPSUS",
          "PELO DE FOCA",
          "DISCO DE ORO",
          "+800K",
          "7× LA RIVIERA",
          "TOUR 2026",
          "LAPSUS",
        ]}
      />

      {/* LATEST RELEASE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-5 items-end">
          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-[0.3em] text-white/45 mb-3">
              {d.home.latestRelease}
            </p>
            <h2 className="display text-7xl md:text-8xl">{latest.title}</h2>
            <p className="mt-2 text-white/55 font-mono text-sm">
              {latest.kind === "album" ? d.music.album : latest.kind === "ep" ? d.music.ep : d.music.single} · {latest.year}
            </p>
            {latest.highlights?.length ? (
              <ul className="mt-6 space-y-2 text-white/75">
                {latest.highlights.map((h) => (
                  <li key={h} className="flex gap-3">
                    <span className="text-[color:var(--accent)]">▮</span>
                    {h}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-8 flex gap-3">
              <a
                href={SOCIAL.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline underline-offset-4 hover:text-[color:var(--accent)]"
              >
                Spotify
              </a>
              <a
                href={SOCIAL.appleMusic}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline underline-offset-4 hover:text-[color:var(--accent)]"
              >
                Apple Music
              </a>
              <a
                href={SOCIAL.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline underline-offset-4 hover:text-[color:var(--accent)]"
              >
                YouTube
              </a>
            </div>
          </div>
          <div className="md:col-span-3">
            <a
              href={latest.appleMusicUrl ?? SOCIAL.appleMusic}
              target="_blank"
              rel="noopener noreferrer"
              className="block aspect-square w-full rounded-sm relative overflow-hidden border border-white/10 group bg-zinc-900"
              aria-label={`${latest.title} (${latest.year ?? ""}) — abrir en Apple Music`}
            >
              {latest.cover ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={latest.cover}
                    alt={`Portada: ${latest.title}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[color:var(--accent)] via-rose-700 to-zinc-900">
                  <span className="display text-white/95 text-[18vw] md:text-[12rem] leading-none mix-blend-overlay">
                    {latest.title.split(" ")[0]}
                  </span>
                </div>
              )}
              <div className="absolute bottom-4 right-4 font-mono text-xs uppercase tracking-widest text-white bg-black/40 backdrop-blur-sm px-2 py-1">
                {latest.year ?? ""}
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* NEXT SHOWS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 border-t border-[color:var(--border)]">
        <div className="flex items-end justify-between mb-10 gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/45 mb-2">
              {d.home.nextShows}
            </p>
            <h2 className="display text-5xl md:text-7xl">Tour &apos;26</h2>
          </div>
          <Link
            href={`/${l}/tour`}
            className="text-sm uppercase tracking-[0.18em] underline underline-offset-4 hover:text-[color:var(--accent)] whitespace-nowrap"
          >
            {d.home.seeAllShows} →
          </Link>
        </div>
        <ul className="divide-y divide-[color:var(--border)]">
          {upcoming.length ? (
            upcoming.map((g) => {
              const cta = g.freeEntry ? d.tour.freeEntry : d.tour.tickets;
              const inner = (
                <>
                  <span className="font-mono text-sm text-white/70 md:text-base">{g.date}</span>
                  <span className="display text-2xl md:text-3xl group-hover:text-[color:var(--accent)] transition-colors col-span-2 md:col-span-1">
                    {g.venue}
                  </span>
                  <span className="text-xs md:text-sm uppercase tracking-wider text-white/50 group-hover:text-white">
                    {cta} →
                  </span>
                </>
              );
              const rowClass =
                "grid grid-cols-[1fr_auto] md:grid-cols-[140px_1fr_auto] items-center gap-4 py-5 group";
              return (
                <li key={g.rawDate + g.venue}>
                  {g.ticketUrl ? (
                    <a
                      href={g.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={rowClass}
                      aria-label={`${cta}: ${g.venue} — ${g.date}`}
                    >
                      {inner}
                    </a>
                  ) : (
                    <Link href={`/${l}/tour`} className={rowClass}>
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })
          ) : (
            <li className="py-6 text-white/60">{d.tour.noUpcoming}</li>
          )}
        </ul>
      </section>

      {/* ABOUT */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 border-t border-[color:var(--border)]">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <h2 className="display text-5xl md:text-7xl">{d.home.aboutTitle}</h2>
          <div>
            <p className="text-lg leading-relaxed text-white/80">{d.home.aboutLead}</p>
            <Link
              href={`/${l}/banda`}
              className="mt-8 inline-block text-sm uppercase tracking-[0.18em] underline underline-offset-4 hover:text-[color:var(--accent)]"
            >
              {d.home.aboutCta} →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
