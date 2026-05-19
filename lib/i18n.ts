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
  };
  media: {
    title: string;
    subtitle: string;
    typeVideos: string;
    typeShorts: string;
    sortByViews: string;
    sortByLikes: string;
    sortByDate: string;
    views: string;
    likes: string;
    syncedAt: string;
    dataSource: string;
    noVideos: string;
    noShorts: string;
    likesHidden: string;
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
      "Ultraligera nació en 2021 y ha crecido al margen de las multinacionales. En pocos años ha reunido a cientos de miles de oyentes en plataformas de streaming.",
      "Tras su EP de debut Europa (2023), el disco que les disparó fue Pelo de foca (2025): agotaron entradas en cada parada de su gira por salas, con varias noches casi seguidas en La Riviera de Madrid.",
      "Su segundo álbum, Lapsus (2026), está en camino. La gira de presentación los lleva durante todo el verano y otoño por los grandes festivales del país.",
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
  },
  media: {
    title: "Media",
    subtitle: "Vídeos y Shorts del canal oficial de YouTube, ordenados por reproducciones, likes o más recientes.",
    typeVideos: "Vídeos",
    typeShorts: "Shorts",
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
    likesHidden: "likes ocultos",
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
      "Ultraligera started in 2021 and has grown outside the major-label system. In just a few years they've gathered hundreds of thousands of listeners across streaming platforms.",
      "Their debut EP Europa (2023) was the opener, but the record that pushed them forward was Pelo de foca (2025): every stop on their Spanish club tour sold out, with several near-consecutive nights at La Riviera in Madrid.",
      "Their second album, Lapsus (2026), is on the way. The accompanying tour runs through summer and autumn at the country's main festivals.",
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
  },
  media: {
    title: "Media",
    subtitle: "Videos and Shorts from the official YouTube channel, sortable by views, likes or recency.",
    typeVideos: "Videos",
    typeShorts: "Shorts",
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
    likesHidden: "likes hidden",
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
};

export const DICTIONARIES: Record<Locale, Dict> = { es, en };

export function getDict(locale: Locale): Dict {
  return DICTIONARIES[locale];
}
