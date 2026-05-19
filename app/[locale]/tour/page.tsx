import { notFound } from "next/navigation";
import { isLocale, getDict, type Locale } from "@/lib/i18n";
import { GIGS, type Gig } from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDict(locale).tour.title };
}

export default async function TourPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l: Locale = locale;
  const d = getDict(l);

  const today = new Date();
  const upcoming: Gig[] = [];
  const past: Gig[] = [];
  for (const g of GIGS) {
    if (new Date(g.rawDate) >= today) upcoming.push(g);
    else past.push(g);
  }

  return (
    <article className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
      <header className="mb-16 md:mb-20">
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)] mb-4">
          {d.nav.tour}
        </p>
        <h1 className="display text-[20vw] md:text-[14rem] leading-[0.85]">
          {d.tour.title}
        </h1>
        <p className="mt-6 text-lg md:text-xl text-white/75 max-w-2xl">{d.tour.subtitle}</p>
      </header>

      <section className="mb-20">
        <div className="flex items-baseline gap-4 mb-6">
          <h2 className="display text-3xl md:text-5xl">{d.tour.upcoming}</h2>
          <span className="font-mono text-sm text-white/45">
            {upcoming.length.toString().padStart(2, "0")}
          </span>
        </div>
        {upcoming.length ? (
          <ul className="divide-y divide-[color:var(--border)] border-y border-[color:var(--border)]">
            {upcoming.map((g) => (
              <GigRow key={g.rawDate + g.venue} gig={g} ticketsLabel={d.tour.tickets} freeLabel={d.tour.freeEntry} />
            ))}
          </ul>
        ) : (
          <p className="text-white/60">{d.tour.noUpcoming}</p>
        )}
      </section>

      {past.length ? (
        <section>
          <div className="flex items-baseline gap-4 mb-6">
            <h2 className="display text-3xl md:text-5xl text-white/40">{d.tour.past}</h2>
            <span className="font-mono text-sm text-white/45">
              {past.length.toString().padStart(2, "0")}
            </span>
          </div>
          <ul className="divide-y divide-[color:var(--border)] border-y border-[color:var(--border)] opacity-60">
            {past.map((g) => (
              <GigRow key={g.rawDate + g.venue} gig={g} past ticketsLabel={d.tour.tickets} freeLabel={d.tour.freeEntry} />
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}

function GigRow({
  gig,
  past,
  ticketsLabel,
  freeLabel,
}: {
  gig: Gig;
  past?: boolean;
  ticketsLabel: string;
  freeLabel: string;
}) {
  return (
    <li className="grid grid-cols-[110px_1fr_auto] md:grid-cols-[160px_1fr_auto] items-center gap-4 py-5 group">
      <span className="font-mono text-sm md:text-base text-white/70">{gig.date}</span>
      <span className="display text-2xl md:text-4xl group-hover:text-[color:var(--accent)] transition-colors">
        {gig.venue}
      </span>
      {past ? (
        <span className="text-xs uppercase tracking-wider text-white/40">—</span>
      ) : gig.ticketUrl ? (
        <a
          href={gig.ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs md:text-sm uppercase tracking-wider text-white/70 hover:text-[color:var(--accent)]"
        >
          {gig.freeEntry ? freeLabel : ticketsLabel} →
        </a>
      ) : (
        <span className="text-xs md:text-sm uppercase tracking-wider text-white/50">
          {gig.freeEntry ? freeLabel : ticketsLabel}
        </span>
      )}
    </li>
  );
}
