import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Dock } from "@/components/sections/Dock";
import { Education } from "@/components/sections/Education";
import { Experience } from "@/components/sections/Experience";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Nav } from "@/components/sections/Nav";
import { Projects } from "@/components/sections/Projects";
import { Stack } from "@/components/sections/Stack";
import { I18nProvider } from "@/lib/i18n";

export default function Home() {
  return (
    <I18nProvider>
      <SmoothScroll>
        <Nav />
        <main id="conteudo">
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Stack />
          <Education />
          <Contact />
        </main>
        <Footer />
        <Dock />
      </SmoothScroll>
    </I18nProvider>
  );
}
