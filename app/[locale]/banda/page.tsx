import { notFound } from "next/navigation";
import { isLocale, getDict, type Locale } from "@/lib/i18n";
import { MEMBERS } from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDict(locale).band.title };
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
    <article className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
      <header className="mb-16 md:mb-24">
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)] mb-4">
          {l === "es" ? "Quiénes son" : "Who they are"}
        </p>
        <h1 className="display text-7xl md:text-[11rem] leading-[0.85]">
          {d.band.title}
        </h1>
      </header>

      {/* Members */}
      <section className="mb-20 md:mb-28">
        <h2 className="display text-3xl md:text-5xl mb-8">{d.band.membersTitle}</h2>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[color:var(--border)] border border-[color:var(--border)]">
          {MEMBERS.map((m) => (
            <li
              key={m.name}
              className="bg-black p-6 md:p-8 flex flex-col gap-2 hover:bg-[color:var(--accent)] group transition-colors"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-white/45 group-hover:text-white/85">
                {d.roles[m.roleKey]}
                {m.liveOnly ? ` — ${d.roles.liveOnly}` : ""}
              </span>
              <span className="display text-4xl md:text-5xl">{m.name}</span>
            </li>
          ))}
        </ul>
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
  );
}
