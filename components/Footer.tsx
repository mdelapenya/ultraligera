import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDict } from "@/lib/i18n";
import { SITE, SOCIAL } from "@/lib/content";

type Props = { locale: Locale };

const socialLinks = [
  { label: "Instagram", href: SOCIAL.instagram },
  { label: "TikTok", href: SOCIAL.tiktok },
  { label: "YouTube", href: SOCIAL.youtube },
  { label: "Spotify", href: SOCIAL.spotify },
  { label: "Apple Music", href: SOCIAL.appleMusic },
];

export function Footer({ locale }: Props) {
  const d = getDict(locale);

  return (
    <footer className="mt-20 border-t border-[color:var(--border)] bg-[#0d0d0d]/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <div className="display text-4xl">{SITE.hashtag}</div>
            <p className="mt-3 text-white/60 text-sm max-w-md">{d.disclaimer.short}</p>
            <p className="mt-3 text-white/40 text-xs max-w-md">
              {locale === "es" ? "Sitio oficial:" : "Official site:"}{" "}
              <a
                href={`https://www.${SITE.officialDomain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white"
              >
                {SITE.officialDomain}
              </a>
            </p>
          </div>

          <div className="md:justify-self-end">
            <h3 className="text-xs uppercase tracking-[0.2em] text-white/50 mb-3">
              {d.footer.follow}
            </h3>
            <ul className="space-y-2 text-sm">
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/85 hover:text-[color:var(--accent)] transition-colors"
                  >
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hairline my-10" />

        <p className="text-xs text-white/45 leading-relaxed max-w-4xl">
          {d.disclaimer.long}
        </p>

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-xs text-white/45">
          <p>
            © {SITE.copyrightYear} {d.footer.rights}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <Link href={`/${locale}/aviso-legal`} className="hover:text-white transition-colors">
                {d.footer.legal}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
