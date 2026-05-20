import type { Metadata, Viewport } from "next";
import { Inter, Bebas_Neue, JetBrains_Mono } from "next/font/google";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import { COLORS, themeStyleBlock } from "@/lib/theme";
import { SITE_URL } from "@/lib/seo";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const display = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: COLORS.background,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ultraligera — Fan site",
    template: "%s · Ultraligera (fan site)",
  },
  description:
    "Sitio de fans no oficial sobre la banda Ultraligera. Recopila fechas de gira, discografía y enlaces a sus canales oficiales. No afiliado con la banda ni su representación.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Ultraligera — Fan site",
    description:
      "Sitio de fans no oficial sobre Ultraligera: gira, discografía y enlaces oficiales.",
    siteName: "Ultraligera fan site",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ultraligera — Fan site",
    description:
      "Sitio de fans no oficial sobre Ultraligera: gira, discografía y enlaces oficiales.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Derive the active locale from the request path. Root layouts can't read
  // route params, so middleware.ts forwards the pathname as an x-pathname
  // header. Falls back to DEFAULT_LOCALE when missing (e.g. local dev with
  // middleware disabled, or static prerendering of routes without locale).
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "";
  const localeSegment = pathname.split("/")[1] ?? "";
  const lang = isLocale(localeSegment) ? localeSegment : DEFAULT_LOCALE;

  return (
    <html
      lang={lang}
      className={`${inter.variable} ${display.variable} ${mono.variable} h-full antialiased`}
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeStyleBlock() }} />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
