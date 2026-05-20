"use client";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { getDict } from "@/lib/i18n";
import type { FeaturedVideo, Video, VideoHistorySnapshot } from "@/lib/content";
import { ViewsChart, type ChartSeries } from "@/components/ViewsChart";

type SortKey = "views" | "likes" | "date";
type TypeKey = "featured" | "videos" | "shorts" | "trending";

const TYPE_KEYS: readonly TypeKey[] = ["featured", "videos", "shorts", "trending"];

const TOP_VIDEO_COLORS = ["#f5b700", "#ef476f", "#06d6a0", "#118ab2", "#c77dff"];

const DEFAULT_ACTIVE_VIDEOS = 5;
const VISIBLE_CHIPS_DEFAULT = 20;

/** Trim the "Ultraligera - X (Videoclip Oficial)" noise down to just "X". */
function cleanTrackTitle(title: string): string {
  return title
    .replace(/^\s*Ultraligera\s*[-–—]\s*/i, "")
    .replace(/\s*\([^)]*\)\s*$/, "")
    .trim();
}

function typeFromHash(hash: string): TypeKey | null {
  const slug = hash.replace(/^#/, "");
  return (TYPE_KEYS as readonly string[]).includes(slug) ? (slug as TypeKey) : null;
}

function durationSeconds(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  const h = parseInt(m[1] ?? "0", 10);
  const min = parseInt(m[2] ?? "0", 10);
  const s = parseInt(m[3] ?? "0", 10);
  return h * 3600 + min * 60 + s;
}

function formatDuration(iso: string): string {
  const total = durationSeconds(iso);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function VideoGrid({
  videos,
  locale,
  history,
  featured,
}: {
  videos: Video[];
  locale: Locale;
  history: VideoHistorySnapshot[];
  featured: FeaturedVideo[];
}) {
  const d = getDict(locale);
  const [type, setType] = useState<TypeKey>("videos");
  const [sort, setSort] = useState<SortKey>("views");

  // Keep the tab in sync with the URL hash so reloads and shared links land on
  // the right view. We can't read window.location during render (SSR), so we
  // sync after mount and on subsequent hashchange events.
  useEffect(() => {
    const apply = () => {
      const fromHash = typeFromHash(window.location.hash);
      if (fromHash) setType(fromHash);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  function selectType(next: TypeKey) {
    setType(next);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${next}`);
      // history.* doesn't trigger hashchange. Fire one so other components
      // (e.g. the language switcher in Header) can re-read the hash.
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  }

  const { videosLong, shorts } = useMemo(() => {
    const longs: Video[] = [];
    const shorts: Video[] = [];
    for (const v of videos) {
      (v.isShort ? shorts : longs).push(v);
    }
    return { videosLong: longs, shorts };
  }, [videos]);

  const counts = { videos: videosLong.length, shorts: shorts.length };

  const filtered = useMemo(() => {
    const arr = [...(type === "videos" ? videosLong : shorts)];
    if (sort === "views") arr.sort((a, b) => b.viewCount - a.viewCount);
    else if (sort === "likes")
      arr.sort((a, b) => (b.likeCount ?? -1) - (a.likeCount ?? -1));
    else arr.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    return arr;
  }, [videosLong, shorts, type, sort]);

  const nf = useMemo(
    () => new Intl.NumberFormat(locale === "es" ? "es-ES" : "en-US"),
    [locale],
  );
  const dateFmt = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-US", {
        year: "numeric",
        month: "short",
      }),
    [locale],
  );

  const isShorts = type === "shorts";
  const isTrending = type === "trending";
  const isFeatured = type === "featured";

  const videosByViews = useMemo(
    () => [...videos].sort((a, b) => b.viewCount - a.viewCount),
    [videos],
  );

  // Stable color slots: deactivating a video leaves its slot empty so the
  // remaining lines keep their colors. Activating fills the lowest empty slot.
  const [activeSlots, setActiveSlots] = useState<(string | null)[]>(() =>
    videosByViews.slice(0, DEFAULT_ACTIVE_VIDEOS).map((v) => v.id),
  );
  const [chipsExpanded, setChipsExpanded] = useState(false);

  function toggleVideoSlot(id: string) {
    setActiveSlots((prev) => {
      const idx = prev.indexOf(id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = null;
        while (next.length && next[next.length - 1] === null) next.pop();
        return next;
      }
      const emptyAt = prev.indexOf(null);
      if (emptyAt >= 0) {
        const next = [...prev];
        next[emptyAt] = id;
        return next;
      }
      return [...prev, id];
    });
  }

  const topVideoSeries: ChartSeries[] = useMemo(() => {
    const out: ChartSeries[] = [];
    activeSlots.forEach((id, slotIdx) => {
      if (!id) return;
      const v = videos.find((x) => x.id === id);
      if (!v) return;
      out.push({
        name: cleanTrackTitle(v.title),
        color: TOP_VIDEO_COLORS[slotIdx % TOP_VIDEO_COLORS.length],
        points: history
          .map((snap) => {
            const hit = snap.videos.find((x) => x.id === v.id);
            return hit ? { date: snap.date, value: hit.views } : null;
          })
          .filter((p): p is { date: string; value: number } => p !== null),
      });
    });
    return out;
  }, [videos, history, activeSlots]);

  const channelTotalSeries: ChartSeries[] = useMemo(
    () => [
      {
        name: d.media.channelTotalLabel,
        color: "#f5b700",
        points: history.map((s) => ({ date: s.date, value: s.totalViews })),
      },
    ],
    [history, d.media.channelTotalLabel],
  );

  const types: { key: TypeKey; label: string; count: number | null }[] = [
    { key: "featured", label: d.media.typeFeatured, count: featured.length || null },
    { key: "videos", label: d.media.typeVideos, count: counts.videos },
    { key: "shorts", label: d.media.typeShorts, count: counts.shorts },
    { key: "trending", label: d.media.typeTrending, count: history.length || null },
  ];

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "views", label: d.media.sortByViews },
    { key: "likes", label: d.media.sortByLikes },
    { key: "date", label: d.media.sortByDate },
  ];

  return (
    <div>
      {/* Type selector (Videos / Shorts) — mimics YouTube channel layout */}
      <div role="tablist" className="flex gap-6 border-b border-[color:var(--border)] mb-6">
        {types.map((t) => {
          const active = type === t.key;
          return (
            <button
              key={t.key}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => selectType(t.key)}
              className={`relative pb-3 pt-1 display text-2xl md:text-3xl tracking-wide transition-colors ${
                active
                  ? "text-white"
                  : "text-white/35 hover:text-white/70"
              }`}
            >
              {t.label}
              {t.count != null && (
                <>
                  {" "}
                  <span className="font-mono text-xs align-middle text-white/40">
                    {t.count}
                  </span>
                </>
              )}
              {active && (
                <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-[color:var(--accent)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Sort selector — hidden on tabs whose order is editorial, not data-driven */}
      {!isTrending && !isFeatured && (
        <div role="tablist" className="flex flex-wrap gap-2 mb-8">
          {sortOptions.map((o) => {
            const active = sort === o.key;
            return (
              <button
                key={o.key}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => setSort(o.key)}
                className={`px-4 py-2 text-xs uppercase tracking-[0.18em] border transition-colors ${
                  active
                    ? "bg-[color:var(--accent)] text-white border-[color:var(--accent)]"
                    : "border-white/15 text-white/70 hover:border-white/40 hover:text-white"
                }`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      )}

      {isFeatured ? (
        featured.length === 0 ? (
          <p className="text-white/55 text-base py-12 text-center">
            {d.media.noFeatured}
          </p>
        ) : (
          <ul className="grid gap-8 md:gap-10 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((v, i) => (
              <li key={v.id} className="group">
                <a
                  href={`https://www.youtube.com/watch?v=${v.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="relative bg-zinc-900 border border-[color:var(--border)] overflow-hidden aspect-video">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                      alt={v.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition"
                      loading={i < 6 ? "eager" : "lazy"}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="w-12 h-12 rounded-full bg-[color:var(--accent)] flex items-center justify-center text-white text-lg">
                        ▶
                      </span>
                    </div>
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-mono uppercase tracking-widest px-2 py-1">
                      #{String(i + 1).padStart(2, "0")}
                    </div>
                  </div>

                  <div className="mt-3">
                    <h3 className="display leading-tight group-hover:text-[color:var(--accent)] transition-colors text-xl md:text-2xl">
                      {v.title}
                    </h3>
                    <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs font-mono text-white/55">
                      <li>
                        {d.media.featuredAuthorBy}{" "}
                        <span className="text-white/85">{v.author}</span>
                      </li>
                      <li>
                        <time dateTime={v.addedAt}>
                          {dateFmt.format(new Date(v.addedAt))}
                        </time>
                      </li>
                    </ul>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )
      ) : isTrending ? (
        <div>
          <p className="text-sm md:text-base text-white/70 max-w-2xl mb-6 md:mb-8">
            {d.media.trendingSubtitle}
          </p>
          <div className="flex flex-col gap-8 md:gap-10">
            <div className="flex flex-col gap-4">
              <ViewsChart
                title={d.media.topVideosLabel}
                subtitle={d.media.topVideosSubtitle}
                emptyLabel={d.media.notEnoughHistory}
                locale={locale}
                series={topVideoSeries}
                height={320}
              />
              <VideoSelector
                videos={videosByViews}
                activeSlots={activeSlots}
                expanded={chipsExpanded}
                onToggle={toggleVideoSlot}
                onToggleExpand={() => setChipsExpanded((e) => !e)}
                moreLabel={d.media.videoSelectorMore}
                hideLabel={d.media.videoSelectorHide}
              />
            </div>
            <ViewsChart
              title={d.media.channelTotalLabel}
              subtitle={d.media.channelTotalSubtitle}
              emptyLabel={d.media.notEnoughHistory}
              locale={locale}
              series={channelTotalSeries}
              height={260}
            />
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-white/55 text-base py-12 text-center">
          {isShorts ? d.media.noShorts : d.media.noVideos}
        </p>
      ) : (
        <ul
          className={
            isShorts
              ? "grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
              : "grid gap-8 md:gap-10 md:grid-cols-2 lg:grid-cols-3"
          }
        >
          {filtered.map((v, i) => (
            <li key={v.id} className="group">
              <a
                href={
                  isShorts
                    ? `https://www.youtube.com/shorts/${v.id}`
                    : `https://www.youtube.com/watch?v=${v.id}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div
                  className={`relative bg-zinc-900 border border-[color:var(--border)] overflow-hidden ${
                    isShorts ? "aspect-[9/16]" : "aspect-video"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                    alt={v.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition"
                    loading={i < 6 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="w-12 h-12 rounded-full bg-[color:var(--accent)] flex items-center justify-center text-white text-lg">
                      ▶
                    </span>
                  </div>
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-mono uppercase tracking-widest px-2 py-1">
                    #{String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5">
                    {formatDuration(v.duration)}
                  </div>
                </div>

                <div className="mt-3">
                  <h3
                    className={`display leading-tight group-hover:text-[color:var(--accent)] transition-colors ${
                      isShorts ? "text-base md:text-lg" : "text-xl md:text-2xl"
                    }`}
                  >
                    {v.title}
                  </h3>
                  <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs font-mono text-white/55">
                    <li>
                      <span className="text-white/85">{nf.format(v.viewCount)}</span>{" "}
                      {d.media.views}
                    </li>
                    {!isShorts && (
                      <li>
                        {v.likeCount != null ? (
                          <>
                            <span className="text-white/85">{nf.format(v.likeCount)}</span>{" "}
                            {d.media.likes}
                          </>
                        ) : (
                          <span className="italic text-white/35">{d.media.likesHidden}</span>
                        )}
                      </li>
                    )}
                    <li>
                      <time dateTime={v.publishedAt}>
                        {dateFmt.format(new Date(v.publishedAt))}
                      </time>
                    </li>
                  </ul>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function VideoSelector({
  videos,
  activeSlots,
  expanded,
  onToggle,
  onToggleExpand,
  moreLabel,
  hideLabel,
}: {
  videos: Video[];
  activeSlots: (string | null)[];
  expanded: boolean;
  onToggle: (id: string) => void;
  onToggleExpand: () => void;
  moreLabel: string;
  hideLabel: string;
}) {
  const visible = expanded ? videos : videos.slice(0, VISIBLE_CHIPS_DEFAULT);
  const hiddenCount = Math.max(0, videos.length - VISIBLE_CHIPS_DEFAULT);

  return (
    <div>
      <ul className="flex flex-wrap gap-2">
        {visible.map((v) => {
          const slotIdx = activeSlots.indexOf(v.id);
          const active = slotIdx >= 0;
          const color = active
            ? TOP_VIDEO_COLORS[slotIdx % TOP_VIDEO_COLORS.length]
            : null;
          return (
            <li key={v.id}>
              <button
                type="button"
                onClick={() => onToggle(v.id)}
                aria-pressed={active}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs border transition-colors ${
                  active
                    ? "text-white"
                    : "border-white/10 text-white/40 hover:border-white/30 hover:text-white/80"
                }`}
                style={active && color ? { borderColor: color } : undefined}
              >
                {color && (
                  <span
                    aria-hidden
                    className="inline-block w-2 h-2 rounded-full shrink-0"
                    style={{ background: color }}
                  />
                )}
                <span>{cleanTrackTitle(v.title)}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={onToggleExpand}
          className="mt-3 text-xs font-mono uppercase tracking-widest text-white/45 hover:text-white"
        >
          {expanded ? hideLabel : `+ ${hiddenCount} ${moreLabel}`}
        </button>
      )}
    </div>
  );
}
