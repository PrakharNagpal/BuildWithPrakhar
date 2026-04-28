import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { getPortfolioData } from "@/server/portfolio";

export default async function Home() {
  const portfolio = await getPortfolioData();

  return (
    <div className="min-h-screen bg-bg text-fg">
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About profile={portfolio.profile} />
        <Experience experience={portfolio.experience} />
        <Projects projects={portfolio.projects} />
        <Skills skills={portfolio.skills} />
        <Contact profile={portfolio.profile} />
      </main>
      <Footer />
    </div>
  );
}
