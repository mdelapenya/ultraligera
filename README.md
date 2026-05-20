# Ultraligera — sitio de fans

Sitio web **no oficial** de fans sobre la banda [Ultraligera](https://www.ultraligera.com).
Construido con Next.js 16 (App Router), React 19, TypeScript y Tailwind CSS v4.
Estático en su totalidad — deploy en Vercel sin configuración.

> Este sitio no está afiliado con la banda ni con su representación. Ver
> `/aviso-legal` para el disclaimer completo.

## Estructura

```
app/
  layout.tsx               # fuentes, metadatos globales, tema dark
  page.tsx                 # redirección a /es
  [locale]/
    layout.tsx             # header + footer (ES/EN)
    page.tsx               # home: hero, último lanzamiento, próximos shows
    banda/                 # biografía + formación + reconocimientos
    musica/                # discografía
    tour/                  # gira (lee data/gigs.json)
    media/                 # enlaces a vídeos del canal oficial
    contacto/              # canales oficiales para contactar a la banda
    aviso-legal/           # disclaimer + datos personales + takedown
components/                # Header, Footer, Marquee, NewsletterForm
lib/
  content.ts               # datos canónicos: miembros, releases, social, nav
  i18n.ts                  # diccionarios ES/EN
data/
  gigs.json                # fechas de gira (bot nocturno → PR)
  videos.json              # stats de YouTube (bot nocturno → commit directo)
scripts/
  sync-tour.mjs            # scraper de fechas de gira
  sync-youtube.mjs         # sync de stats de YouTube vía API oficial
.github/workflows/
  sync-tour.yml            # cron 03:00 UTC → abre PR si hay fechas nuevas
  sync-youtube.yml         # cron 03:30 UTC → commit directo en main
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

Hay un GitHub Action que, cada noche a las 03:00 UTC, hace scraping de la
página de tour del sitio oficial y abre un **pull request** si detecta fechas
nuevas que no estén ya en `data/gigs.json`.

- **Política**: solo añade entradas. Nunca borra ni modifica las existentes —
  un humano revisa el PR antes de mergear.
- **Si la web cambia layout** y el scraper no parsea ninguna fecha, el job se
  pone rojo (exit code 2) y no se abre PR.
- **Disparo manual**: en la pestaña *Actions* del repo → *Sync tour dates* →
  *Run workflow*.

### Local

```bash
npm run sync:tour:dry   # ver qué añadiría sin escribir nada
npm run sync:tour       # escribir cambios a data/gigs.json
```

### Notas de configuración

- Los workflows corren desde la rama por defecto (`main`), no desde feature
  branches. Hasta que `web` no se mergee a `main`, los crones no se activarán.
- El PR que abre el bot del tour está hecho con
  `peter-evans/create-pull-request@v6`. El `GITHUB_TOKEN` por defecto basta —
  no hace falta un PAT.
- Por diseño, los PRs creados con `GITHUB_TOKEN` no disparan otros workflows
  (evita bucles). Si quieres que el deploy preview de Vercel reaccione al PR
  del bot, configura Vercel con su integración nativa de GitHub (lo hace
  automáticamente al importar el repo) — esa integración sí escucha PRs de
  cualquier origen.

## Sincronización de stats de YouTube

Cada noche a las 03:30 UTC se refrescan reproducciones y likes de cada vídeo
del canal oficial en `data/videos.json`. La página `/media` los muestra
ordenables por **más vistos / más likes / más recientes**.

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

- **Conectar la newsletter** a Mailchimp / Buttondown — actualmente el formulario
  solo simula el envío.
- **Reemplazar las portadas de discos placeholder** por las artworks reales con
  permiso del titular.
- **Spotify embed**: cambiar el botón externo por el `iframe` del reproductor
  cuando se decida qué track destacar.
