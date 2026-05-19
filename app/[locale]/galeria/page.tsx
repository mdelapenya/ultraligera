import { notFound } from "next/navigation";
import { isLocale, getDict, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDict(locale).gallery.title };
}

const PHOTOS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  hue: (i * 37) % 360,
  caption: ["La Riviera, Madrid", "Festival Cruïlla", "Backstage", "Mallorca Live", "FIB", "Río Babel"][i % 6],
}));

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l: Locale = locale;
  const d = getDict(l);

  return (
    <article className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
      <header className="mb-16 md:mb-20 max-w-4xl">
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)] mb-4">
          Photo
        </p>
        <h1 className="display text-7xl md:text-[10rem] leading-[0.85] mb-6">
          {d.gallery.title}
        </h1>
        <p className="text-lg md:text-xl text-white/75">{d.gallery.subtitle}</p>
      </header>

      <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
        {PHOTOS.map((p, i) => (
          <li
            key={p.id}
            className={`relative overflow-hidden group ${
              i % 5 === 0 ? "md:col-span-2 md:row-span-2 aspect-square" : "aspect-[4/5]"
            }`}
          >
            <div
              className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
              style={{
                background: `linear-gradient(135deg, hsl(${p.hue}deg 60% 20%), hsl(${
                  (p.hue + 60) % 360
                }deg 40% 8%))`,
              }}
              aria-hidden
            />
            <div className="absolute inset-0 flex items-end p-4 md:p-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/60 mb-1">
                  N.º {p.id.toString().padStart(2, "0")}
                </p>
                <p className="display text-xl md:text-2xl text-white">{p.caption}</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
          </li>
        ))}
      </ul>

      <p className="mt-8 text-xs text-white/40 font-mono uppercase tracking-widest">
        © {new Date().getFullYear()} Ultraligera. {l === "es" ? "Pronto: fotografías reales del directo." : "Coming soon: real live photography."}
      </p>
    </article>
  );
}
