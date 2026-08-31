import type { Metadata } from "next";
import { DM_Sans, Hanken_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";

// Body / UI-label / caption text — mirrors font-body, font-ui-label, font-caption in site.html
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Headlines / subheadings — mirrors font-headline, font-subheading, font-headline-* in site.html
const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema de Gestão de Aulas",
  description: "Gestão de aulas, agendamento e presença para escolas de inglês.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${dmSans.variable} ${hankenGrotesk.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body bg-background text-on-background">
        {children}
      </body>
    </html>
  );
}
