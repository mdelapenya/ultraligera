import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale, getDict, type Locale } from "@/lib/i18n";
import {
  ALBUMS_AND_EPS,
  BAND,
  SINGLES,
  SOCIAL,
  type Release,
  type ReleaseKind,
} from "@/lib/content";
import { buildAlternates } from "@/lib/seo";
import { breadcrumbsSchema, discographySchema } from "@/lib/schema";
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
    title: d.music.title,
    description: d.descriptions.music,
    alternates: buildAlternates(locale, "/musica"),
  };
}

export default async function MusicPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l: Locale = locale;
  const d = getDict(l);

  const kindLabel = (k: ReleaseKind) =>
    k === "album" ? d.music.album : k === "ep" ? d.music.ep : d.music.single;

  return (
    <>
      <JsonLd data={discographySchema()} />
      <JsonLd
        data={breadcrumbsSchema(l, [
          { name: BAND.name, path: "" },
          { name: d.music.title, path: "/musica" },
        ])}
      />
      <article className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
      <header className="mb-16 md:mb-24 max-w-4xl">
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)] mb-4">
          {l === "es" ? "Discografía" : "Discography"}
        </p>
        <h1 className="display text-7xl md:text-[10rem] leading-[0.85] mb-8">
          {d.music.title}
        </h1>
        <p className="text-lg md:text-xl text-white/75 leading-relaxed">{d.music.intro}</p>
        <p className="mt-6 text-xs font-mono uppercase tracking-widest text-white/40 max-w-2xl">
          {d.music.artworkSource}
        </p>
      </header>

      {/* Albums + EPs: rich zig-zag layout */}
      <section className="space-y-20 md:space-y-28 mb-24 md:mb-32">
        <ul className="space-y-20 md:space-y-28">
          {ALBUMS_AND_EPS.map((r, i) => (
            <li
              key={r.appleId ?? r.slug}
              className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${
                i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <ReleaseSleeve r={r} kindLabel={kindLabel(r.kind)} eager={i === 0} large />

              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-white/50 mb-3">
                  {kindLabel(r.kind)} · {r.year}
                </p>
                <h2 className="display text-6xl md:text-8xl mb-6">{r.title}</h2>
                {r.highlights?.length ? (
                  <ul className="space-y-2 mb-8">
                    {r.highlights.map((h) => (
                      <li key={h} className="flex gap-3 text-white/80">
                        <span className="text-[color:var(--accent)]">▮</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <p className="text-xs uppercase tracking-widest text-white/45 mb-3">
                  {d.music.listenOn}
                </p>
                <div className="flex flex-wrap gap-3 text-sm">
                  {r.appleMusicUrl ? (
                    <ExtBtn href={r.appleMusicUrl}>Apple Music</ExtBtn>
                  ) : (
                    <ExtBtn href={SOCIAL.appleMusic}>Apple Music</ExtBtn>
                  )}
                  <ExtBtn href={SOCIAL.spotify}>Spotify</ExtBtn>
                  {r.youtubeId ? (
                    <ExtBtn href={`https://www.youtube.com/watch?v=${r.youtubeId}`}>
                      YouTube ▶
                    </ExtBtn>
                  ) : (
                    <ExtBtn href={SOCIAL.youtube}>YouTube</ExtBtn>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Singles: compact grid */}
      {SINGLES.length > 0 && (
        <section className="border-t border-[color:var(--border)] pt-16">
          <header className="mb-10 flex items-baseline gap-4">
            <h2 className="display text-5xl md:text-7xl">
              {l === "es" ? "Singles" : "Singles"}
            </h2>
            <span className="font-mono text-sm text-white/45">
              {SINGLES.length.toString().padStart(2, "0")}
            </span>
          </header>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-6">
            {SINGLES.map((r) => (
              <li key={r.appleId ?? r.slug}>
                <a
                  href={r.appleMusicUrl ?? SOCIAL.appleMusic}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <ReleaseSleeve r={r} kindLabel="" small />
                  <div className="mt-3">
                    <p className="display text-lg md:text-xl leading-tight group-hover:text-[color:var(--accent)] transition-colors line-clamp-2">
                      {r.title}
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-white/45">
                      {r.releaseDate?.slice(0, 4) ?? r.year ?? ""}
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
      </article>
    </>
  );
}

function ReleaseSleeve({
  r,
  kindLabel,
  eager,
  large,
  small,
}: {
  r: Release;
  kindLabel: string;
  eager?: boolean;
  large?: boolean;
  small?: boolean;
}) {
  return (
    <div className="aspect-square w-full rounded-sm relative overflow-hidden border border-white/10 group bg-zinc-900">
      {r.cover ? (
        <>
          <Image
            src={r.cover}
            alt={`${r.title}${kindLabel ? ` — ${kindLabel}` : ""}${r.year ? ` (${r.year})` : ""}`}
            fill
            priority={eager}
            sizes={
              small
                ? "(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                : "(min-width: 768px) 50vw, 95vw"
            }
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 pointer-events-none" />
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[color:var(--accent)] via-rose-700 to-zinc-900">
          <span
            className={`display text-white/95 leading-none mix-blend-overlay ${
              small ? "text-5xl" : "text-[20vw] md:text-[10rem]"
            }`}
          >
            {r.title.split(" ")[0]}
          </span>
        </div>
      )}
      {large && kindLabel ? (
        <div className="absolute top-4 left-4 font-mono text-xs uppercase tracking-widest text-white bg-black/40 backdrop-blur-sm px-2 py-1">
          {kindLabel}
        </div>
      ) : null}
      {large && r.year ? (
        <div className="absolute bottom-4 right-4 font-mono text-xs uppercase tracking-widest text-white bg-black/40 backdrop-blur-sm px-2 py-1">
          {r.year}
        </div>
      ) : null}
    </div>
  );
}

function ExtBtn({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="px-4 py-2 border border-white/20 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] uppercase tracking-widest text-xs inline-flex items-center gap-1"
    >
      {children}
    </a>
  );
}
