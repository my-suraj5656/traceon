import type { Metadata, Viewport } from "next";
import { Inter, Montserrat, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://traceon.click2pdf.in"),
  title: {
    default: "Traceon — Blockchain Diamond Journey Tracking",
    template: "%s | Traceon DiamondDNA",
  },
  description:
    "From Earth to Eternity — Every Diamond Has a Story. Track your diamond's complete journey across 14 manufacturing stages with Traceon's cryptographic blockchain ledger.",
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "diamond tracking",
    "DiamondDNA",
    "diamond journey",
    "diamond traceability",
    "blockchain diamond ledger",
    "Traceon Ateliers",
    "ethical diamond sourcing",
    "conflict-free diamond registry",
    "diamond finger print",
    "Traceon tracking"
  ],
  authors: [{ name: "DiamondDNA" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Traceon — Blockchain Diamond Journey Tracking",
    description:
      "From Earth to Eternity — Every Diamond Has a Story. Full cryptographic diamond traceability powered by Traceon Ateliers.",
    siteName: "Traceon",
    type: "website",
    url: "https://traceon.click2pdf.in",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Traceon — Blockchain Diamond Journey Tracking",
    description: "Cryptographically trace your diamond's journey across 14 master stages from earth to eternity.",
  },
};

import GlobalBackground from "@/components/shared/global-background";
import ParticleField from "@/components/shared/particle-field";

export const viewport: Viewport = {
  themeColor: "#070e17",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${montserrat.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-[#070e17] text-[#e2e8f0] antialiased relative">
        <GlobalBackground />
        <ParticleField count={40} />
        
        {/* Main Content */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
