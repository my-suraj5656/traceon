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
  title: {
    default: "Traceon — Diamond Journey Tracking",
    template: "%s | Traceon",
  },
  description:
    "From Earth to Eternity — Every Diamond Has a Story. Track your diamond's complete journey across 14 manufacturing stages with Traceon.",
  manifest: "/manifest.json",
  keywords: [
    "diamond tracking",
    "DiamondDNA",
    "diamond journey",
    "diamond traceability",
    "blockchain diamond",
    "Traceon",
  ],
  authors: [{ name: "DiamondDNA" }],
  openGraph: {
    title: "Traceon — Diamond Journey Tracking",
    description:
      "From Earth to Eternity — Every Diamond Has a Story. Full diamond traceability powered by Traceon.",
    siteName: "Traceon",
    type: "website",
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
