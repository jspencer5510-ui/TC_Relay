import { Hero } from "@/views/hero";
import { LogoMarquee } from "@/views/logo-marquee";
import { About } from "@/views/about";
import { Stats } from "@/views/stats";
import { Showcase } from "@/views/showcase";
import { Works } from "@/views/works";
import { Chain } from "@/views/chain";
import { Product } from "@/views/product";
import { ContactForm } from "@/views/contact-form";
import { SiteFooter } from "@/views/site-footer";
import { SiteNav } from "@/views/site-nav";
import { productContent } from "@/data/mocks/product";
import { contactContent, footerContent } from "@/data/mocks/contact";
import { homeContent, type HomeContent } from "@/data/mocks/home";
import { RobotProvider, RobotView } from "@/components/common/robot-view";

/**
 * Home view — a Server Component composing the page sections. The hero (a client
 * leaf) shrinks into a rounded card on scroll; below it two logo rows marquee in
 * opposite directions, then the About heading. See [[decisions-log]] ADR-0014.
 */
export interface HomeViewProps {
  /** Defaults to the page's own mock content — routes import only views (ADR-0003). */
  content?: HomeContent;
  /** The robot form (D-016): the page at rest — no intro, no WebGL. */
  robot?: boolean;
}

export const HomeView = ({ content = homeContent, robot = false }: HomeViewProps) => {
  const { hero, logos, about, stats, showcase, works, chain, nav } = content;
  return (
    <RobotProvider robot={robot}>
      {robot && <RobotView />}
      <SiteNav {...nav} navLabel="Primary" />
      <main id="top" className="w-full bg-hero-page">
        <Hero content={hero} />
      <LogoMarquee logos={logos.items} label={logos.label} />
      <About content={about} labelId={about.labelId} />
      <Stats content={stats} />
      <Showcase content={showcase} />
      <Works content={works} />
      {/* Layered wrapper: the Chain pins (sticky) while the Product scrolls up over
          it, so the Product slides out from under the model. See chain.tsx. */}
      <div className="relative">
        <Chain content={chain} />
        <Product content={productContent} />
      </div>
      {/* Same two-layer reveal again: the contact form pins while the footer scrolls
          up over it. */}
      <div className="relative">
        <ContactForm content={contactContent} />
        <SiteFooter content={footerContent} />
      </div>
      </main>
    </RobotProvider>
  );
};
