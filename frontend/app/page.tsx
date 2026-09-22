import { useTranslations } from 'next-intl'
import { Navbar } from '@/components/home/navbar'
import { Hero } from '@/components/home/hero'
import { HowItWorks } from '@/components/home/how-it-works'
import { Impact } from '@/components/home/impact'
import { Sdgs } from '@/components/home/sdgs'
import { Footer } from '@/components/home/footer'
import { ScrollReveal } from '@/components/home/scroll-reveal'
import { SECTION_IDS, authLinks, footer, hero, howItWorks, impact, navItems, sdgs } from '@/components/home/content'

export default function HomePage() {
  const t = useTranslations('landing')
  const links = authLinks(useTranslations('auth.links'))

  return (
    <div className="bg-[#FFFFFF]">
      {/* Full-width frame; content stays on the export's 1440px grid (min width), centred by px-frame. overflow-clip (not hidden) keeps the navbar sticky. */}
      <div className="box-border w-full lg:min-w-[1440px] h-fit flex flex-col gap-0 justify-start items-start bg-[#FFFFFF] overflow-clip">
        <Navbar
          items={navItems(t)}
          activeHref={`#${SECTION_IDS.home}`}
          login={links.login}
          register={links.register}
        />
        <Hero id={SECTION_IDS.home} {...hero(t)} />
        <HowItWorks id={SECTION_IDS.howItWorks} {...howItWorks(t)} />
        <Impact id={SECTION_IDS.impact} {...impact(t)} />
        <Sdgs id={SECTION_IDS.sdgs} {...sdgs(t)} />
        <Footer {...footer(t)} />
      </div>
      <ScrollReveal />
    </div>
  )
}
