import { notFound } from "next/navigation";
import { isLocale, getDict, type Locale } from "@/lib/i18n";
import {
  SOCIAL,
  VIDEOS,
  VIDEOS_SYNCED_AT,
  VIDEOS_CHANNEL_TITLE,
  VIDEOS_HISTORY,
} from "@/lib/content";
import { VideoGrid } from "@/components/VideoGrid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDict(locale).media.title };
}

export default async function MediaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l: Locale = locale;
  const d = getDict(l);

  const hasVideos = VIDEOS.length > 0;
  const syncedAt = VIDEOS_SYNCED_AT
    ? new Intl.DateTimeFormat(l === "es" ? "es-ES" : "en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(VIDEOS_SYNCED_AT))
    : null;

  return (
    <article className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
      <header className="mb-12 md:mb-16 max-w-4xl">
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)] mb-4">
          {l === "es" ? "Canal de YouTube" : "YouTube channel"}
        </p>
        <h1 className="display text-7xl md:text-[10rem] leading-[0.85] mb-6">
          {d.media.title}
        </h1>
        <p className="text-lg md:text-xl text-white/75">{d.media.subtitle}</p>
        <p className="mt-6 text-xs font-mono uppercase tracking-widest text-white/40 max-w-2xl">
          {d.media.dataSource}
        </p>
        {syncedAt ? (
          <p className="mt-2 text-xs font-mono text-white/40 uppercase tracking-widest">
            {d.media.syncedAt}: {syncedAt}
            {VIDEOS_CHANNEL_TITLE ? ` · ${VIDEOS_CHANNEL_TITLE}` : ""}
          </p>
        ) : null}
      </header>

      {hasVideos ? (
        <VideoGrid videos={VIDEOS} locale={l} history={VIDEOS_HISTORY} />
      ) : (
        <div className="border border-[color:var(--border)] p-8 md:p-12 text-center">
          <p className="display text-2xl md:text-3xl text-white/70 max-w-xl mx-auto leading-tight">
            {d.media.noVideos}
          </p>
          <a
            href={SOCIAL.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block text-sm uppercase tracking-[0.18em] underline underline-offset-4 hover:text-[color:var(--accent)]"
          >
            youtube.com/@ULTRALIGERA →
          </a>
        </div>
      )}

      <section className="mt-16 border-t border-[color:var(--border)] pt-12">
        <p className="text-xs uppercase tracking-[0.3em] text-white/45 mb-3">
          {l === "es" ? "Canal oficial" : "Official channel"}
        </p>
        <a
          href={SOCIAL.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="display text-3xl md:text-5xl hover:text-[color:var(--accent)] inline-flex items-center gap-3"
        >
          youtube.com/@ULTRALIGERA →
        </a>
        <p className="mt-4 text-xs text-white/40 max-w-2xl">
          {l === "es"
            ? "Los vídeos enlazan al canal oficial de YouTube de la banda. No se aloja audio ni vídeo en este sitio."
            : "Videos link to the band's official YouTube channel. No audio or video is hosted on this site."}
        </p>
      </section>
    </article>
  );
}
