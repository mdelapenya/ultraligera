"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { getDict } from "@/lib/i18n";
import { NAV, SOCIAL } from "@/lib/content";
import { SearchTrigger } from "./Search";

type Props = { locale: Locale };

export function Header({ locale }: Props) {
  const d = getDict(locale);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const otherLocale: Locale = locale === "es" ? "en" : "es";
  const otherHref = pathname.replace(/^\/(es|en)/, `/${otherLocale}`);

  const isActive = (href: string) => {
    const full = `/${locale}${href}`;
    return pathname === full || pathname.startsWith(`${full}/`);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-black/60 border-b border-[color:var(--border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-6">
          <Link
            href={`/${locale}`}
            className="display text-2xl tracking-tight hover:text-[color:var(--accent)] transition-colors"
            aria-label="Ultraligera"
          >
            Ultraligera
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-[13px] font-medium uppercase tracking-[0.12em]">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className={
                  isActive(item.href)
                    ? "text-[color:var(--accent)]"
                    : "text-white/85 hover:text-[color:var(--accent)] transition-colors"
                }
              >
                {d.nav[item.labelKey]}
              </Link>
            ))}
            <a
              href={SOCIAL.shop}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/85 hover:text-[color:var(--accent)] transition-colors inline-flex items-center gap-1"
              title={locale === "es" ? "Tienda oficial de la banda" : "Band's official shop"}
            >
              {d.nav.shop} <span className="text-[10px] opacity-60">↗</span>
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-2 text-xs">
            <SearchTrigger locale={locale} />
            <Link
              href={otherHref}
              prefetch={false}
              className="font-mono uppercase tracking-wider text-white/60 hover:text-white transition-colors px-2"
              aria-label={`Switch to ${otherLocale.toUpperCase()}`}
            >
              {locale === "es" ? "EN" : "ES"}
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-1">
            <SearchTrigger locale={locale} />
            <button
              type="button"
              aria-label="Menu"
              aria-expanded={open}
              className="inline-flex flex-col gap-1.5 p-2 -mr-2"
              onClick={() => setOpen((o) => !o)}
            >
            <span
              className={`block h-[2px] w-6 bg-white transition-transform ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-6 bg-white transition-opacity ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-6 bg-white transition-transform ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden pb-6 pt-2 flex flex-col gap-3 text-base uppercase tracking-wider">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                onClick={() => setOpen(false)}
                className={
                  isActive(item.href)
                    ? "text-[color:var(--accent)]"
                    : "text-white/90 hover:text-[color:var(--accent)]"
                }
              >
                {d.nav[item.labelKey]}
              </Link>
            ))}
            <a
              href={SOCIAL.shop}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/90 hover:text-[color:var(--accent)]"
            >
              {d.nav.shop} ↗
            </a>
            <Link
              href={otherHref}
              prefetch={false}
              onClick={() => setOpen(false)}
              className="text-white/60 font-mono"
            >
              {locale === "es" ? "EN" : "ES"}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
