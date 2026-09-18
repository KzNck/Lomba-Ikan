import { Navbar } from '@/components/home/navbar'
import { Hero } from '@/components/home/hero'
import { HowItWorks } from '@/components/home/how-it-works'
import { Impact } from '@/components/home/impact'
import { Sdgs } from '@/components/home/sdgs'
import { Footer } from '@/components/home/footer'
import { ScrollReveal } from '@/components/home/scroll-reveal'
import {
  AUTH_LINKS,
  FOOTER,
  HERO,
  HOW_IT_WORKS,
  IMPACT,
  NAV_ITEMS,
  SDGS,
  SECTION_IDS,
} from '@/components/home/content'

export default function HomePage() {
  return (
    <div className="bg-[#FFFFFF]">
      {/* Full-width frame; content stays on the export's 1440px grid (min width), centred by px-frame. overflow-clip (not hidden) keeps the navbar sticky. */}
      <div className="box-border w-full min-w-[1440px] h-fit flex flex-col gap-0 justify-start items-start bg-[#FFFFFF] overflow-clip">
        <Navbar
          items={NAV_ITEMS}
          activeHref={`#${SECTION_IDS.home}`}
          login={AUTH_LINKS.login}
          register={AUTH_LINKS.register}
        />
        <Hero id={SECTION_IDS.home} {...HERO} />
        <HowItWorks id={SECTION_IDS.howItWorks} {...HOW_IT_WORKS} />
        <Impact id={SECTION_IDS.impact} {...IMPACT} />
        <Sdgs id={SECTION_IDS.sdgs} {...SDGS} />
        <Footer {...FOOTER} />
      </div>
      <ScrollReveal />
    </div>
  )
}
