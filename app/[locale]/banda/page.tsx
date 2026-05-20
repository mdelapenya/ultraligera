import { notFound } from "next/navigation";
import { isLocale, getDict, type Locale } from "@/lib/i18n";
import { BAND, MEMBERS } from "@/lib/content";
import { buildAlternates } from "@/lib/seo";
import { breadcrumbsSchema, musicGroupSchema } from "@/lib/schema";
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
    title: d.band.title,
    description: d.descriptions.band,
    alternates: buildAlternates(locale, "/banda"),
  };
}

export default async function BandPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l: Locale = locale;
  const d = getDict(l);

  return (
    <>
      <JsonLd data={musicGroupSchema()} />
      <JsonLd
        data={breadcrumbsSchema(l, [
          { name: BAND.name, path: "" },
          { name: d.band.title, path: "/banda" },
        ])}
      />
      <article className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
      <header className="mb-16 md:mb-24">
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)] mb-4">
          {l === "es" ? "Quiénes son" : "Who they are"}
        </p>
        <h1 className="display text-7xl md:text-[11rem] leading-[0.85]">
          {d.band.title}
        </h1>
      </header>

      {/* Members — core (studio) lineup. Touring-only collaborators are
          listed as a footnote so wide layouts don't end up with a half-row. */}
      <section className="mb-20 md:mb-28">
        <h2 className="display text-3xl md:text-5xl mb-8">{d.band.membersTitle}</h2>
        {(() => {
          const core = MEMBERS.filter((m) => !m.liveOnly);
          const live = MEMBERS.filter((m) => m.liveOnly);
          return (
            <>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[color:var(--border)] border border-[color:var(--border)]">
                {core.map((m) => (
                  <li
                    key={m.name}
                    className="bg-black p-6 md:p-8 flex flex-col gap-2 hover:bg-[color:var(--accent)] group transition-colors"
                  >
                    <span className="font-mono text-xs uppercase tracking-widest text-white/45 group-hover:text-white/85">
                      {d.roles[m.roleKey]}
                    </span>
                    <span className="display text-3xl md:text-4xl lg:text-3xl xl:text-4xl">
                      {m.name}
                    </span>
                  </li>
                ))}
              </ul>
              {live.length > 0 ? (
                <p className="mt-6 text-xs font-mono uppercase tracking-widest text-white/45">
                  {d.band.liveLineupNote}{" "}
                  {live
                    .map((m) => `${m.name} (${d.roles[m.roleKey]})`)
                    .join(", ")}
                </p>
              ) : null}
            </>
          );
        })()}
      </section>

      {/* Bio */}
      <section className="grid md:grid-cols-[260px_1fr] gap-10 md:gap-16 mb-20 md:mb-28">
        <h2 className="display text-3xl md:text-5xl">{d.band.bioTitle}</h2>
        <div className="space-y-5 text-lg leading-relaxed text-white/85 max-w-3xl">
          {d.band.bio.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* Disco de oro — único reconocimiento con fuente primaria confirmada */}
      <section className="grid md:grid-cols-[260px_1fr] gap-10 md:gap-16">
        <h2 className="display text-3xl md:text-5xl">
          {l === "es" ? "Hito" : "Milestone"}
        </h2>
        <div className="text-white/85 leading-relaxed max-w-3xl">
          <p className="text-base md:text-lg">
            {l === "es"
              ? "En abril de 2026, la banda recibió su primer disco de oro por «Matanza en el Hotel» (Pelo de foca)."
              : "In April 2026, the band received their first gold record for «Matanza en el Hotel» (Pelo de foca)."}
          </p>
          <p className="mt-3 text-xs font-mono uppercase tracking-widest text-white/45">
            {l === "es" ? "Fuente" : "Source"}:{" "}
            <a
              href="https://www.diariodeunrockero.es/actualidad/noticias/ultraligera-recibe-su-primer-disco-de-oro/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[color:var(--accent)] normal-case"
            >
              Diario de un Rockero ↗
            </a>
          </p>
        </div>
      </section>
      </article>
    </>
  );
}
