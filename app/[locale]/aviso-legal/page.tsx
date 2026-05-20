import { notFound } from "next/navigation";
import { isLocale, getDict, type Locale } from "@/lib/i18n";
import { BAND, SITE } from "@/lib/content";
import { buildAlternates } from "@/lib/seo";
import { breadcrumbsSchema } from "@/lib/schema";
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
    title: d.footer.legal,
    description: d.descriptions.legal,
    alternates: buildAlternates(locale, "/aviso-legal"),
  };
}

export default async function LegalPage({
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
      <JsonLd
        data={breadcrumbsSchema(l, [
          { name: BAND.name, path: "" },
          { name: d.footer.legal, path: "/aviso-legal" },
        ])}
      />
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
      <header className="mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)] mb-4">
          {d.home.eyebrow}
        </p>
        <h1 className="display text-6xl md:text-8xl leading-[0.85]">{d.footer.legal}</h1>
      </header>

      <div className="prose prose-invert max-w-none text-white/80 leading-relaxed space-y-6">
        <h2 className="display text-2xl md:text-3xl text-white">
          {l === "es" ? "Naturaleza del sitio" : "About this site"}
        </h2>
        <p>{d.disclaimer.long}</p>

        <h2 className="display text-2xl md:text-3xl text-white">
          {l === "es" ? "Sitio oficial de la banda" : "The band's official site"}
        </h2>
        <p>
          {l === "es"
            ? "Para información oficial, comunicaciones y compras directas con la banda, visita su web oficial: "
            : "For official information, communications and direct purchases, please visit the band's official website: "}
          <a
            href={`https://www.${SITE.officialDomain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[color:var(--accent)]"
          >
            {SITE.officialDomain}
          </a>
          .
        </p>

        <h2 className="display text-2xl md:text-3xl text-white">
          {l === "es" ? "Datos personales" : "Personal data"}
        </h2>
        <p>
          {l === "es"
            ? "Este sitio es estático y, a día de hoy, no recopila, almacena ni procesa datos personales de quienes lo visitan. Los formularios visibles (newsletter) son ilustrativos y no envían información a ningún servidor. Si en el futuro se conectaran a un backend real, se actualizará este aviso."
            : "This site is static and, as of today, does not collect, store or process any personal data from visitors. The visible forms (newsletter) are illustrative and do not send any information to any server. If they are wired to a real backend in the future, this notice will be updated."}
        </p>

        <h2 className="display text-2xl md:text-3xl text-white">
          {l === "es" ? "Marcas y obras de terceros" : "Third-party trademarks and works"}
        </h2>
        <p>
          {l === "es"
            ? "«Ultraligera», los nombres de sus integrantes, los títulos de sus discos, canciones y cualquier otro signo distintivo de la banda son propiedad de sus respectivos titulares. Su uso aquí es estrictamente factual y editorial. No se reproducen letras, audio, vídeo, fotografía ni texto promocional propiedad de la banda."
            : "«Ultraligera», their members' names, album and track titles, and any other distinctive sign of the band are the property of their respective owners. Their use here is strictly factual and editorial. No band-owned lyrics, audio, video, photography or promotional text is reproduced."}
        </p>

        <h2 className="display text-2xl md:text-3xl text-white">
          {l === "es" ? "Retirada de contenido" : "Takedown"}
        </h2>
        <p>
          {l === "es"
            ? "Si eres titular de derechos sobre algún contenido enlazado o referido en este sitio y deseas su retirada o modificación, contacta con quien mantiene el repositorio del proyecto y se atenderá la solicitud."
            : "If you hold rights over any content linked or referenced on this site and would like it removed or modified, please contact whoever maintains the project repository and the request will be addressed."}
        </p>

        <h2 className="display text-2xl md:text-3xl text-white">
          {l === "es" ? "Sin garantías" : "No warranties"}
        </h2>
        <p>
          {l === "es"
            ? "La información (fechas de gira, premios, lanzamientos) se recopila de fuentes públicas y puede contener errores u omisiones. Para datos oficiales, acude a los canales oficiales de la banda."
            : "Information (tour dates, awards, releases) is gathered from public sources and may contain errors or omissions. For official data, please refer to the band's official channels."}
        </p>
      </div>
      </article>
    </>
  );
}
