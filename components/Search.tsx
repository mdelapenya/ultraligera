"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { getDict } from "@/lib/i18n";
import {
  buildSearchIndex,
  searchItems,
  type SearchItem,
  type SearchKind,
} from "@/lib/search";

const GROUP_ORDER: SearchKind[] = ["page", "gig", "video", "release", "member"];

export function SearchTrigger({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        aria-label={d.search.open}
        title={`${d.search.open} (⌘K)`}
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center w-9 h-9 text-white/70 hover:text-white hover:bg-white/5 transition-colors rounded-sm"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </button>
      {open && <SearchOverlay locale={locale} onClose={() => setOpen(false)} />}
    </>
  );
}

function SearchOverlay({ locale, onClose }: { locale: Locale; onClose: () => void }) {
  const d = getDict(locale);
  const router = useRouter();
  const [q, setQ] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const index = useMemo(() => buildSearchIndex(locale), [locale]);
  const results = useMemo(() => searchItems(index, q), [index, q]);

  // Order results by group, then collapse to a flat array for keyboard nav
  const flat = useMemo(() => {
    const buckets = new Map<SearchKind, SearchItem[]>();
    for (const k of GROUP_ORDER) buckets.set(k, []);
    for (const r of results) buckets.get(r.kind)!.push(r);
    return GROUP_ORDER.flatMap((k) => buckets.get(k)!);
  }, [results]);

  useEffect(() => {
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    itemRefs.current[activeIdx]?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      const item = flat[activeIdx];
      if (!item) return;
      e.preventDefault();
      onClose();
      if (item.external) {
        window.open(item.url, "_blank", "noopener,noreferrer");
      } else {
        router.push(item.url);
      }
    }
  }

  const grouped = useMemo(() => {
    const map = new Map<SearchKind, SearchItem[]>();
    let i = 0;
    for (const item of flat) {
      if (!map.has(item.kind)) map.set(item.kind, []);
      map.get(item.kind)!.push(item);
      i++;
    }
    void i;
    return map;
  }, [flat]);

  const groupLabel = (k: SearchKind) =>
    k === "page"
      ? d.search.groupPages
      : k === "video"
        ? d.search.groupVideos
        : k === "gig"
          ? d.search.groupGigs
          : k === "release"
            ? d.search.groupReleases
            : d.search.groupMembers;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={d.search.open}
      onClick={onClose}
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md flex items-start justify-center pt-[10vh] px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#0a0a0a] border border-[color:var(--border)] shadow-2xl"
      >
        <div className="flex items-center gap-3 px-5 border-b border-[color:var(--border)]">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white/40 shrink-0"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActiveIdx(0);
            }}
            placeholder={d.search.placeholder}
            className="flex-1 py-4 bg-transparent text-base outline-none placeholder:text-white/30"
          />
          <kbd className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-widest text-white/40 border border-white/15 px-1.5 py-0.5">
            Esc
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {q.trim().length < 2 ? (
            <p className="px-6 py-10 text-center text-sm text-white/45">
              {d.search.hint}
            </p>
          ) : flat.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-white/45">
              {d.search.noResults} ·{" "}
              <span className="font-mono text-white/60">«{q}»</span>
            </p>
          ) : (
            (() => {
              let runningIdx = 0;
              return GROUP_ORDER.map((kind) => {
                const items = grouped.get(kind);
                if (!items || items.length === 0) return null;
                return (
                  <section
                    key={kind}
                    className="border-t border-[color:var(--border)] first:border-t-0"
                  >
                    <h3 className="px-5 pt-4 pb-1 text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono">
                      {groupLabel(kind)}
                    </h3>
                    <ul>
                      {items.map((it) => {
                        const idx = runningIdx++;
                        const active = idx === activeIdx;
                        return (
                          <li key={`${it.kind}-${it.url}-${it.title}`}>
                            <ResultRow
                              item={it}
                              active={active}
                              onSelect={onClose}
                              setRef={(el) => {
                                itemRefs.current[idx] = el;
                              }}
                              onMouseMove={() => setActiveIdx(idx)}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                );
              });
            })()
          )}
        </div>

        <div className="hidden sm:flex items-center gap-4 px-5 py-2 border-t border-[color:var(--border)] text-[10px] font-mono uppercase tracking-widest text-white/35">
          <span><kbd className="text-white/55">↑↓</kbd> navegar</span>
          <span><kbd className="text-white/55">⏎</kbd> abrir</span>
          <span><kbd className="text-white/55">esc</kbd> cerrar</span>
        </div>
      </div>
    </div>
  );
}

function ResultRow({
  item,
  active,
  onSelect,
  setRef,
  onMouseMove,
}: {
  item: SearchItem;
  active: boolean;
  onSelect: () => void;
  setRef: (el: HTMLAnchorElement | null) => void;
  onMouseMove: () => void;
}) {
  const cls = `flex items-baseline justify-between gap-4 px-5 py-2.5 transition-colors ${
    active
      ? "bg-[color:var(--accent)] text-white"
      : "hover:bg-white/[0.04]"
  }`;
  const titleCls = `text-sm md:text-base ${active ? "" : "text-white/85"}`;
  const subCls = `text-[11px] font-mono uppercase tracking-widest ${
    active ? "text-white/85" : "text-white/40"
  }`;

  if (item.external) {
    return (
      <a
        ref={setRef}
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onSelect}
        onMouseMove={onMouseMove}
        className={cls}
      >
        <span className={titleCls}>
          {item.title}
          <span aria-hidden className="ml-1 opacity-60 text-xs">↗</span>
        </span>
        {item.subtitle && <span className={subCls}>{item.subtitle}</span>}
      </a>
    );
  }
  return (
    <Link
      ref={setRef}
      href={item.url}
      onClick={onSelect}
      onMouseMove={onMouseMove}
      className={cls}
    >
      <span className={titleCls}>{item.title}</span>
      {item.subtitle && <span className={subCls}>{item.subtitle}</span>}
    </Link>
  );
}
