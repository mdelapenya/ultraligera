import type { Metadata, Viewport } from "next";
import { Inter, Bebas_Neue, JetBrains_Mono } from "next/font/google";
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
  themeColor: "#050505",
};

export const metadata: Metadata = {
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${display.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
