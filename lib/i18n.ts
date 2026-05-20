export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";

export function isLocale(v: string): v is Locale {
  return (LOCALES as readonly string[]).includes(v);
}

type Dict = {
  nav: {
    tour: string;
    music: string;
    band: string;
    media: string;
    contact: string;
    shop: string;
  };
  roles: {
    vocals: string;
    guitar: string;
    bass: string;
    drums: string;
    rhythmGuitar: string;
    liveOnly: string;
  };
  home: {
    tagline: string;
    eyebrow: string;
    ctaTour: string;
    ctaListen: string;
    latestRelease: string;
    nextShows: string;
    seeAllShows: string;
    aboutTitle: string;
    aboutLead: string;
    aboutCta: string;
    fanBadge: string;
  };
  band: {
    title: string;
    membersTitle: string;
    bioTitle: string;
    bio: string[];
    liveLineupNote: string;
    faqTitle: string;
    faqItems: { q: string; a: string }[];
  };
  music: {
    title: string;
    intro: string;
    listenOn: string;
    album: string;
    ep: string;
    single: string;
    artworkSource: string;
  };
  tour: {
    title: string;
    subtitle: string;
    tickets: string;
    freeEntry: string;
    soldOut: string;
    upcoming: string;
    past: string;
    noUpcoming: string;
    dataFreshness: string;
  };
  media: {
    title: string;
    subtitle: string;
    typeVideos: string;
    typeShorts: string;
    typeTrending: string;
    typeFeatured: string;
    sortByViews: string;
    sortByLikes: string;
    sortByDate: string;
    views: string;
    likes: string;
    syncedAt: string;
    dataSource: string;
    noVideos: string;
    noShorts: string;
    noFeatured: string;
    likesHidden: string;
    trendingSubtitle: string;
    channelTotalLabel: string;
    channelTotalSubtitle: string;
    topVideosLabel: string;
    topVideosSubtitle: string;
    notEnoughHistory: string;
    featuredAuthorBy: string;
    videoSelectorMore: string;
    videoSelectorHide: string;
  };
  contact: {
    title: string;
    subtitle: string;
    officialChannelsTitle: string;
    officialChannelsBody: string;
    feedbackTitle: string;
    feedbackBody: string;
  };
  disclaimer: {
    short: string;
    long: string;
  };
  newsletter: {
    title: string;
    body: string;
    placeholder: string;
    submit: string;
    consent: string;
    terms: string;
    welcome: string;
  };
  footer: {
    rights: string;
    cookies: string;
    privacy: string;
    legal: string;
    purchase: string;
    follow: string;
  };
  langSwitch: {
    es: string;
    en: string;
  };
  search: {
    open: string;
    placeholder: string;
    hint: string;
    empty: string;
    noResults: string;
    groupPages: string;
    groupVideos: string;
    groupGigs: string;
    groupReleases: string;
    groupMembers: string;
  };
  /** SEO descriptions, one per page. ~150-160 chars each. */
  descriptions: {
    home: string;
    band: string;
    music: string;
    tour: string;
    media: string;
    contact: string;
    legal: string;
  };
  notFound: {
    eyebrow: string;
    title: string;
    body: string;
    cta: string;
  };
};

const es: Dict = {
  nav: {
    tour: "Tour '26",
    music: "Música",
    band: "Banda",
    media: "Media",
    contact: "Contacto",
    shop: "Tienda",
  },
  roles: {
    vocals: "Voz",
    guitar: "Guitarra",
    bass: "Bajo",
    drums: "Batería",
    rhythmGuitar: "Guitarra rítmica",
    liveOnly: "en directo",
  },
  home: {
    tagline:
      "Una web hecha por un fan para seguir la pista a Ultraligera: gira, discos y enlaces oficiales en un solo sitio.",
    eyebrow: "Sitio de fans no oficial",
    ctaTour: "Ver el tour",
    ctaListen: "Escuchar",
    latestRelease: "Último lanzamiento",
    nextShows: "Próximos conciertos",
    seeAllShows: "Ver toda la gira",
    aboutTitle: "Una banda en gira constante",
    aboutLead:
      "Banda madrileña formada en 2021. Tras un EP y un primer disco, encadenan festivales y salas por toda España con su segundo álbum en camino.",
    aboutCta: "Conoce a la banda",
    fanBadge: "Fan site",
  },
  band: {
    title: "La banda",
    membersTitle: "Formación",
    bioTitle: "Biografía",
    bio: [
      "Ultraligera es una banda madrileña de indie/post-punk formada en 2021. Ha crecido al margen de las multinacionales y en pocos años ha reunido a cientos de miles de oyentes en plataformas de streaming.",
      "Tras su EP de debut Europa (2023), el disco que les disparó fue Pelo de foca (2025): agotaron entradas en cada parada de su gira por salas, con varias noches casi seguidas en La Riviera de Madrid.",
      "Su segundo álbum, Lapsus (2026), está en camino. La gira de presentación los lleva durante todo el verano y otoño por los grandes festivales del país.",
    ],
    liveLineupNote: "En directo se les suma:",
    faqTitle: "Preguntas frecuentes",
    faqItems: [
      {
        q: "¿Cuándo se formó Ultraligera?",
        a: "Ultraligera se formó en Madrid en 2021.",
      },
      {
        q: "¿De dónde es Ultraligera?",
        a: "Ultraligera es una banda madrileña de indie/post-punk.",
      },
      {
        q: "¿Quiénes son los miembros de Ultraligera?",
        a: "La formación de estudio es Gisme (voz), Coque Fernández (guitarra), Santi Urruela (bajo) y Martín Aparicio (batería). En directo se les suma Mario en guitarra rítmica.",
      },
      {
        q: "¿Cuál es el último disco de Ultraligera?",
        a: "Su segundo álbum, Lapsus, llega en 2026. Antes publicaron Pelo de foca (2025), con el que recibieron su primer disco de oro por «Matanza en el Hotel».",
      },
    ],
  },
  music: {
    title: "Música",
    intro:
      "Tres referencias hasta la fecha: el EP Europa, el debut Pelo de foca y el segundo álbum Lapsus que llega en 2026.",
    listenOn: "Escuchar en",
    album: "Álbum",
    ep: "EP",
    single: "Single",
    artworkSource:
      "Discografía y carátulas obtenidas de Apple Music. Las imágenes se sirven desde el CDN oficial de Apple; este sitio no aloja ni redistribuye artwork de la banda.",
  },
  tour: {
    title: "Tour 2026",
    subtitle: "Fechas confirmadas de la gira. Información recopilada de fuentes públicas.",
    tickets: "Entradas",
    freeEntry: "Entrada libre",
    soldOut: "Sold out",
    upcoming: "Próximos",
    past: "Pasados",
    noUpcoming: "Aún no hay fechas anunciadas.",
    dataFreshness:
      "Datos sincronizados cada noche desde la web oficial de la banda.",
  },
  media: {
    title: "Media",
    subtitle: "Vídeos y Shorts del canal oficial de YouTube, ordenados por reproducciones, likes o más recientes.",
    typeVideos: "Vídeos",
    typeShorts: "Shorts",
    typeTrending: "Trending",
    typeFeatured: "Destacados",
    sortByViews: "Más vistos",
    sortByLikes: "Más likes",
    sortByDate: "Más recientes",
    views: "reproducciones",
    likes: "likes",
    syncedAt: "Datos actualizados",
    dataSource:
      "Reproducciones, likes, thumbnails y duración obtenidos del canal oficial de YouTube vía YouTube Data API. Los vídeos se reproducen en youtube.com; este sitio no aloja ni audio ni vídeo.",
    noVideos: "Aún no hay datos. El sitio se sincroniza automáticamente cada noche con el canal de YouTube.",
    noShorts: "Sin Shorts publicados por ahora.",
    noFeatured: "Aún no hay vídeos destacados.",
    likesHidden: "likes ocultos",
    trendingSubtitle:
      "Visualizaciones acumuladas día a día. Snapshot diario tras cada sync nocturno.",
    channelTotalLabel: "Total del canal",
    channelTotalSubtitle: "Suma de reproducciones de todos los vídeos",
    topVideosLabel: "Vídeos comparados",
    topVideosSubtitle: "Pincha abajo para añadir o quitar vídeos del gráfico.",
    notEnoughHistory: "Aún no hay suficiente histórico — vuelve mañana.",
    featuredAuthorBy: "por",
    videoSelectorMore: "más",
    videoSelectorHide: "Ocultar",
  },
  contact: {
    title: "Contacto",
    subtitle: "Esta web es un proyecto de fan. Aquí no se gestionan ni la banda ni su agenda.",
    officialChannelsTitle: "¿Quieres contactar con la banda?",
    officialChannelsBody:
      "Para prensa, booking, gestiones de festivales o salas, contacta directamente con Ultraligera y su equipo a través de sus canales oficiales:",
    feedbackTitle: "¿Algo de esta web?",
    feedbackBody:
      "Si has encontrado un error, una fecha equivocada o quieres aportar contenido, abre un issue en el repositorio del proyecto.",
  },
  newsletter: {
    title: "Quédate cerca",
    body: "Newsletter de actualizaciones de esta web de fan (no es la newsletter oficial de la banda).",
    placeholder: "tu@email.com",
    submit: "Unirse",
    consent: "Acepto recibir actualizaciones de esta web por correo.",
    terms: "Ver términos de uso",
    welcome: "¡Bienvenido!",
  },
  footer: {
    rights: "Sitio de fans no oficial. Sin afiliación con la banda ni su representación.",
    cookies: "Uso de cookies",
    privacy: "Política de privacidad",
    legal: "Aviso legal",
    purchase: "Política de compra",
    follow: "Redes oficiales de la banda",
  },
  disclaimer: {
    short: "Sitio de fans no oficial. No afiliado con Ultraligera ni con su representación.",
    long: "Este sitio web ha sido creado por un fan con fines informativos y sin ánimo de lucro. No está afiliado, asociado, autorizado, respaldado por ni vinculado en modo alguno con Ultraligera, su discográfica, su management o cualquier otra entidad legal relacionada con la banda. Todas las marcas, nombres y obras son propiedad de sus respectivos titulares. Datos factuales (nombres de los miembros, títulos de obras, fechas de conciertos anunciadas públicamente y premios) se utilizan de forma editorial. No se reproduce aquí texto promocional, letras, audio ni imagen propiedad de la banda.",
  },
  langSwitch: { es: "ES", en: "EN" },
  search: {
    open: "Buscar",
    placeholder: "Buscar canciones, fechas, banda…",
    hint: "Escribe al menos 2 caracteres",
    empty: "Escribe al menos 2 caracteres",
    noResults: "Sin resultados",
    groupPages: "Ir a",
    groupVideos: "Vídeos y Shorts",
    groupGigs: "Gira",
    groupReleases: "Música",
    groupMembers: "Banda",
  },
  descriptions: {
    home: "Sitio de fans no oficial sobre Ultraligera: gira, discos y enlaces oficiales en un solo sitio.",
    band: "Conoce a la formación de Ultraligera —banda madrileña formada en 2021— y su biografía. Sitio de fans no oficial.",
    music: "Discografía de Ultraligera: EP Europa, álbum Pelo de foca y el próximo Lapsus (2026). Enlaces a Apple Music, Spotify y YouTube.",
    tour: "Fechas confirmadas de la gira de Ultraligera 2026 por salas y festivales de España. Información recopilada de fuentes públicas.",
    media: "Vídeos y Shorts del canal oficial de Ultraligera en YouTube, con estadísticas día a día y top de vídeos más vistos.",
    contact: "Cómo contactar con Ultraligera vía sus canales oficiales, y cómo reportar erratas o aportar contenido a este sitio de fans no oficial.",
    legal: "Aviso legal del sitio de fans no oficial sobre Ultraligera: naturaleza del proyecto, datos personales, marcas y retirada de contenido.",
  },
  notFound: {
    eyebrow: "Error 404",
    title: "Tú no lo ves",
    body: "Esta página no existe — o ya no la encontramos. Como en la canción.",
    cta: "Volver al inicio",
  },
};

const en: Dict = {
  nav: {
    tour: "Tour '26",
    music: "Music",
    band: "Band",
    media: "Media",
    contact: "Contact",
    shop: "Shop",
  },
  roles: {
    vocals: "Vocals",
    guitar: "Guitar",
    bass: "Bass",
    drums: "Drums",
    rhythmGuitar: "Rhythm guitar",
    liveOnly: "live only",
  },
  home: {
    tagline:
      "A fan-built tracker for Ultraligera: tour dates, releases and official links in one place.",
    eyebrow: "Unofficial fan site",
    ctaTour: "See the tour",
    ctaListen: "Listen",
    latestRelease: "Latest release",
    nextShows: "Upcoming shows",
    seeAllShows: "See full tour",
    aboutTitle: "A band on a constant tour",
    aboutLead:
      "Madrid-based band formed in 2021. After an EP and a debut album, they've been chaining clubs and festivals across Spain with a second album on the way.",
    aboutCta: "Meet the band",
    fanBadge: "Fan site",
  },
  band: {
    title: "The band",
    membersTitle: "Line-up",
    bioTitle: "Biography",
    bio: [
      "Ultraligera is a Madrid-based indie/post-punk band formed in 2021. They have grown outside the major-label system and in just a few years gathered hundreds of thousands of listeners across streaming platforms.",
      "Their debut EP Europa (2023) was the opener, but the record that pushed them forward was Pelo de foca (2025): every stop on their Spanish club tour sold out, with several near-consecutive nights at La Riviera in Madrid.",
      "Their second album, Lapsus (2026), is on the way. The accompanying tour runs through summer and autumn at the country's main festivals.",
    ],
    liveLineupNote: "Joining them live:",
    faqTitle: "Frequently asked questions",
    faqItems: [
      {
        q: "When did Ultraligera form?",
        a: "Ultraligera formed in Madrid in 2021.",
      },
      {
        q: "Where is Ultraligera from?",
        a: "Ultraligera is a Madrid-based indie/post-punk band.",
      },
      {
        q: "Who are the members of Ultraligera?",
        a: "The studio lineup is Gisme (vocals), Coque Fernández (guitar), Santi Urruela (bass) and Martín Aparicio (drums). Mario joins on rhythm guitar for live shows.",
      },
      {
        q: "What's the latest album by Ultraligera?",
        a: "Their second album, Lapsus, is due in 2026. Their previous album was Pelo de foca (2025), which earned them their first gold record for «Matanza en el Hotel».",
      },
    ],
  },
  music: {
    title: "Music",
    intro:
      "Three releases so far: the EP Europa, the debut Pelo de foca and the second album Lapsus, due in 2026.",
    listenOn: "Listen on",
    album: "Album",
    ep: "EP",
    single: "Single",
    artworkSource:
      "Discography and artwork sourced from Apple Music. Images are served from Apple's official CDN; this site does not host or redistribute the band's artwork.",
  },
  tour: {
    title: "Tour 2026",
    subtitle: "Confirmed tour dates. Information gathered from public sources.",
    tickets: "Tickets",
    freeEntry: "Free entry",
    soldOut: "Sold out",
    upcoming: "Upcoming",
    past: "Past",
    noUpcoming: "No dates announced yet.",
    dataFreshness: "Data synced nightly from the band's official site.",
  },
  media: {
    title: "Media",
    subtitle: "Videos and Shorts from the official YouTube channel, sortable by views, likes or recency.",
    typeVideos: "Videos",
    typeShorts: "Shorts",
    typeTrending: "Trending",
    typeFeatured: "Featured",
    sortByViews: "Most viewed",
    sortByLikes: "Most liked",
    sortByDate: "Newest",
    views: "views",
    likes: "likes",
    syncedAt: "Data refreshed",
    dataSource:
      "View counts, likes, thumbnails and duration sourced from the band's official YouTube channel via the YouTube Data API. Videos play on youtube.com; this site does not host any audio or video.",
    noVideos: "No data yet. The site auto-syncs nightly with the YouTube channel.",
    noShorts: "No Shorts published yet.",
    noFeatured: "No featured videos yet.",
    likesHidden: "likes hidden",
    trendingSubtitle: "Cumulative daily views. Daily snapshot taken after each nightly sync.",
    channelTotalLabel: "Channel total",
    channelTotalSubtitle: "Sum of plays across every video",
    topVideosLabel: "Compared videos",
    topVideosSubtitle: "Click below to add or remove videos from the chart.",
    notEnoughHistory: "Not enough history yet — check back tomorrow.",
    featuredAuthorBy: "by",
    videoSelectorMore: "more",
    videoSelectorHide: "Hide",
  },
  contact: {
    title: "Contact",
    subtitle: "This site is a fan project. The band and their schedule are not managed from here.",
    officialChannelsTitle: "Want to contact the band?",
    officialChannelsBody:
      "For press, booking, festival or venue enquiries, please reach out to Ultraligera and their team directly through their official channels:",
    feedbackTitle: "Feedback on this site?",
    feedbackBody:
      "Spotted an error, a wrong date, or want to contribute? Open an issue on the project's repository.",
  },
  newsletter: {
    title: "Stay close",
    body: "Updates about this fan site (this is not the band's official newsletter).",
    placeholder: "you@email.com",
    submit: "Join",
    consent: "I agree to receive updates about this fan site by email.",
    terms: "See terms of use",
    welcome: "Welcome!",
  },
  footer: {
    rights: "Unofficial fan site. Not affiliated with the band or their representation.",
    cookies: "Cookie policy",
    privacy: "Privacy policy",
    legal: "Legal notice",
    purchase: "Purchase policy",
    follow: "Band's official channels",
  },
  disclaimer: {
    short: "Unofficial fan site. Not affiliated with Ultraligera or their representation.",
    long: "This website is a non-commercial fan project. It is not affiliated with, associated with, authorised by, endorsed by, or in any way connected to Ultraligera, their record label, management, or any related legal entity. All trademarks, names and works are the property of their respective owners. Factual data (member names, release titles, publicly announced tour dates, awards) is used editorially. No promotional text, lyrics, audio or imagery owned by the band is reproduced here.",
  },
  langSwitch: { es: "ES", en: "EN" },
  search: {
    open: "Search",
    placeholder: "Search songs, dates, band…",
    hint: "Type at least 2 characters",
    empty: "Type at least 2 characters",
    noResults: "No results",
    groupPages: "Go to",
    groupVideos: "Videos and Shorts",
    groupGigs: "Tour",
    groupReleases: "Music",
    groupMembers: "Band",
  },
  descriptions: {
    home: "Unofficial fan site about Ultraligera: tour dates, discography and official links in one place.",
    band: "Meet the lineup of Ultraligera —a Madrid-based band formed in 2021— and their biography. Unofficial fan site.",
    music: "Ultraligera discography: the Europa EP, the Pelo de foca album and the upcoming Lapsus (2026). Links to Apple Music, Spotify and YouTube.",
    tour: "Confirmed tour dates for Ultraligera 2026 across Spanish clubs and festivals. Information gathered from public sources.",
    media: "Videos and Shorts from Ultraligera's official YouTube channel, with day-by-day stats and the most-watched picks.",
    contact: "How to reach Ultraligera through their official channels, and how to report mistakes or contribute to this unofficial fan site.",
    legal: "Legal notice for the unofficial fan site about Ultraligera: nature of the project, personal data, trademarks and content takedown.",
  },
  notFound: {
    eyebrow: "Error 404",
    title: "Tú no lo ves",
    body: "This page doesn't exist — or we lost it. Like in the song.",
    cta: "Back home",
  },
};

export const DICTIONARIES: Record<Locale, Dict> = { es, en };

export function getDict(locale: Locale): Dict {
  return DICTIONARIES[locale];
}
