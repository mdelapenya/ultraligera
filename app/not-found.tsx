import Link from "next/link";
import { headers } from "next/headers";
import { DEFAULT_LOCALE, getDict, isLocale, type Locale } from "@/lib/i18n";
import { RELEASES } from "@/lib/content";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CoverBubbles, type CoverBubble } from "@/components/CoverBubbles";

/**
 * Every Ultraligera release with cover art, deduped by image URL so we
 * don't repeat identical visuals (some tracks are reissued as album +
 * single with the same artwork).
 */
function pickBubbleCovers(): CoverBubble[] {
  const seen = new Set<string>();
  const out: CoverBubble[] = [];
  for (const r of RELEASES) {
    if (r.cover && !seen.has(r.cover)) {
      seen.add(r.cover);
      out.push({ title: r.title, cover: r.cover });
    }
  }
  return out;
}

/**
 * Root-level 404. Next.js routes ALL unmatched URLs here, regardless of
 * locale segment. We render the locale's Header/Footer manually since the
 * [locale]/layout.tsx wrapper doesn't apply at this level.
 */
export default async function NotFound() {
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "";
  const segment = pathname.split("/")[1] ?? "";
  const locale: Locale = isLocale(segment) ? segment : DEFAULT_LOCALE;
  const d = getDict(locale);
  const covers = pickBubbleCovers();
  // Fresh shuffle on every 404 render. The page already opts out of static
  // optimization via the headers() call above, so this runs per request.
  const seed = Math.floor(Math.random() * 1_000_000);

  return (
    <>
      <Header locale={locale} />
      <main className="flex-1 flex flex-col">
        <section className="relative flex-1 flex items-center justify-center overflow-hidden">
          <CoverBubbles covers={covers} seed={seed} />

          <div className="relative z-10 text-center max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)] mb-6 font-mono">
              {d.notFound.eyebrow}
            </p>
            <h1 className="display text-[20vw] md:text-[12rem] leading-[0.85] mb-8">
              {d.notFound.title}
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto mb-10 leading-relaxed">
              {d.notFound.body}
            </p>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 bg-[color:var(--accent)] hover:bg-white hover:text-black transition-colors px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] rounded-sm"
            >
              {d.notFound.cta} →
            </Link>
          </div>
        </section>
      </main>
      <Footer locale={locale} flushTop />
    </>
  );
}
