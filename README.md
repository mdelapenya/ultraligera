# Ultraligera — sitio de fans

Sitio web **no oficial** de fans sobre la banda [Ultraligera](https://www.ultraligera.com).
Construido con Next.js 16 (App Router), React 19, TypeScript y Tailwind CSS v4.
Estático en su totalidad — deploy en Vercel sin configuración.

> Este sitio no está afiliado con la banda ni con su representación. Ver
> `/aviso-legal` para el disclaimer completo.

## Estructura

```
app/
  layout.tsx               # fuentes, metadatos globales, inyección del theme
  page.tsx                 # redirección a /es
  not-found.tsx            # 404 con burbujas de portadas
  icon.tsx, apple-icon.tsx # favicon + apple touch icon generados al vuelo
  robots.ts                # /robots.txt
  sitemap.xml/route.ts     # /sitemap.xml (con XSL stylesheet en /public)
  [locale]/                # rutas localizadas (ES por defecto, EN como alterna)
    layout.tsx             # header + footer
    page.tsx               # home: hero, último lanzamiento, próximos shows
    banda/                 # biografía + formación + FAQ
    musica/                # discografía
    tour/                  # gira (lee data/gigs.json)
    media/                 # vídeos del canal oficial + estadísticas
    contacto/              # canales oficiales + feedback (GitHub issue)
    aviso-legal/           # disclaimer + datos personales + takedown
components/                # Header, Footer, Marquee, Search, VideoGrid,
                           # ViewsChart, CoverBubbles, JsonLd
lib/
  content.ts               # datos canónicos: SITE, BAND, miembros, releases…
  i18n.ts                  # diccionarios ES/EN (un solo tipo Dict comparte)
  theme.ts                 # tokens de color (única fuente de verdad)
  seo.ts                   # SITE_URL + helper canonical/hreflang
  schema.ts                # JSON-LD: MusicGroup, MusicAlbum, MusicEvent, FAQ…
  search.ts                # índice del search palette
data/
  gigs.json                # fechas de gira (sync nocturno → commit directo)
  videos.json              # stats de YouTube (sync nocturno → commit directo)
  videos-history.json      # snapshots diarios para la gráfica de trending
  discography.json         # discografía + carátulas (Apple Music)
  featured-videos.json     # vídeos curados manualmente para la tab Featured
proxy.ts                   # propaga x-pathname para que el root layout sepa
                           # el locale activo (next.js 16 file convention)
scripts/
  sync-tour.mjs            # scraper de fechas de gira
  sync-youtube.mjs         # YouTube Data API → views, likes, duración
  sync-discography.mjs     # iTunes Search API → discografía + carátulas
.github/workflows/
  sync-tour.yml            # cron 03:00 UTC → commit directo si hay fechas nuevas
  sync-youtube.yml         # cron 03:30 UTC → commit directo (requiere API key)
  sync-discography.yml     # cron 04:00 UTC → commit directo (API pública)
```

## Desarrollo

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # build de producción
npm run start        # servir el build
npm run lint
```

## Sincronización automática de la gira

Cada noche a las 03:00 UTC, un GitHub Action hace scraping de la página de
tour del sitio oficial y, si detecta fechas nuevas, hace **commit directo a
`main`** sobre `data/gigs.json`.

- **Política**: solo añade entradas. Nunca borra ni modifica las existentes.
- **Si la web cambia layout** y el scraper no parsea ninguna fecha, el job
  termina en rojo (exit code 2) y no se commitea nada.
- **Sin cambios** = sin commit. El action `git-auto-commit-action` salta
  silenciosamente si el working tree está limpio.
- **Disparo manual**: pestaña *Actions* del repo → *Sync tour dates* →
  *Run workflow*.

### Local

```bash
npm run sync:tour:dry   # ver qué añadiría sin escribir nada
npm run sync:tour       # escribir cambios a data/gigs.json
```

### Notas de configuración

Los tres workflows programados corren desde la rama por defecto (`main`) y
commitean directamente con el `GITHUB_TOKEN` que GitHub provee por defecto
— no hace falta un PAT.

## Sincronización de stats de YouTube

Cada noche a las 03:30 UTC se refrescan reproducciones y likes de cada vídeo
del canal oficial en `data/videos.json`, y se añade un snapshot diario a
`data/videos-history.json` (para la gráfica de trending). La página `/media`
los muestra ordenables por **más vistos / más likes / más recientes**, con
una tab adicional de **trending** que dibuja la evolución día a día.

- **Política**: commit directo a `main` (no PR — el ruido de revisar PRs de
  "+150 views" no aporta). El workflow se salta el commit si los datos no
  cambian de forma significativa (≥0,5% en views o cambio de ranking).
- **Si la API falla** (key inválida, channel cambia, cuota agotada), el job
  termina en rojo y no commitea.
- **Quota**: cada ejecución gasta ~3–5 unidades de las 10.000 diarias gratis.

### Setup (una vez)

1. **Crear API key** en Google Cloud Console:
   - Crea o reutiliza un proyecto en <https://console.cloud.google.com/>.
   - APIs & Services → Library → busca **YouTube Data API v3** → Enable.
   - APIs & Services → Credentials → Create Credentials → API key.
   - Edita la key → Application restrictions: **None** (las acciones de GH no
     tienen IP fija) → API restrictions: **Restrict key** → marca solo
     *YouTube Data API v3* → Save. Esto limita lo que la key puede hacer si
     se filtra.

2. **Añadir el secret al repo**:
   - Settings → Secrets and variables → Actions → New repository secret.
   - Name: `YOUTUBE_API_KEY`. Value: la key del paso 1.

3. **Disparar una primera ejecución manual** para poblar `data/videos.json`:
   - Actions → *Sync YouTube stats* → Run workflow → Run.
   - O en local: `YOUTUBE_API_KEY=... npm run sync:youtube`.

### Local

```bash
export YOUTUBE_API_KEY=AIza...           # o pásalo en línea
npm run sync:youtube:dry                  # ver qué actualizaría sin escribir
npm run sync:youtube                      # escribir data/videos.json
```

## Sincronización de la discografía

Cada noche a las 04:00 UTC, `sync-discography.mjs` consulta el API público
de iTunes Search y refresca `data/discography.json` (títulos, años, fechas
de release, carátulas y URLs de Apple Music). Sin API key — el endpoint es
público. Política idéntica a YouTube: commit directo a `main` solo si hay
cambio real. La capa editorial (highlights por release, ID de YouTube para
el videoclip de cada disco) vive en `lib/content.ts` y se preserva a través
de cada sync.

```bash
npm run sync:disco:dry                    # ver qué cambiaría sin escribir
npm run sync:disco                        # escribir data/discography.json
```

## Deploy a Vercel

1. Push del repo a GitHub.
2. En Vercel: **New Project → Import** ese repositorio.
3. Framework Preset detectado automáticamente como **Next.js**. No tocar nada.
4. Deploy.

Para deploy desde CLI:

```bash
npm i -g vercel
vercel              # primer deploy (preview)
vercel --prod       # promover a producción
```

### Dominio

Para usar `ultraligera.vercel.app` (o el slug que prefieras), pon ese
nombre como **Project Name** en Vercel al importar.

## Próximos pasos sugeridos

- **OG image** (1200×630) — el único item del audit SEO que falta. Se
  generaría programáticamente con `app/opengraph-image.tsx` + `next/og`,
  igual que el favicon.
- **Spotify embed**: cambiar el botón externo por el `iframe` del reproductor
  cuando se decida qué track destacar.
