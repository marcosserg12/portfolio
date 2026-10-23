import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Marcos Sergio — Desenvolvedor PHP e Full Stack",
  description:
    "Portfólio de Marcos Sergio, desenvolvedor PHP e Full Stack em Brasília. Sistemas web para saúde, setor público e projetos próprios.",
  openGraph: { title: "Marcos Sergio — Desenvolvedor PHP e Full Stack", type: "website", locale: "pt_BR" },
};

export const viewport: Viewport = { themeColor: "#a8c5f4" };

// Hides reveal targets before first paint only when motion is allowed; un-hides them if GSAP never boots.
const motionBoot = `(function(){var d=document.documentElement;try{var l=localStorage.getItem('locale');if(l==='en')d.lang='en';}catch(e){}if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('js-motion');setTimeout(function(){if(!window.__motionReady)d.classList.remove('js-motion');},4000);})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBoot }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
