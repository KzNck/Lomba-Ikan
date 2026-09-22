import { Navbar } from '@/components/home/navbar'
import { Footer } from '@/components/home/footer'
import { Stepper } from '@/components/register/stepper'
import { PageHeading, type PageHeadingProps } from '@/components/register/page-heading'
import { WaveDecoration } from '@/components/register/wave-decoration'
import { ScrollReveal } from '@/components/home/scroll-reveal'
import { useTranslations } from 'next-intl'
import { authLinks, footer } from '@/components/home/content'
import { registerNavItems, registerSteps } from '@/components/register/content'

// The Pilih Role frame is roomier and ends in a wave; the profile forms sit tighter above the full footer. On short
// laptop windows (`lg:short:`) Pilih Role tightens so it fits without scrolling. Below lg every screen is one
// scrolling column.
const LAYOUT_KINDS = {
  role: 'gap-[28px] sm:gap-[36px] lg:gap-[48px] lg:short:gap-[24px] p-[28px_16px_40px_16px] sm:p-[40px_24px_48px_24px] lg:p-[48px_120px_56px_120px] lg:short:p-[24px_120px_16px_120px]',
  form: 'gap-[28px] lg:gap-[40px] p-[28px_16px_24px_16px] sm:p-[40px_24px_24px_24px] lg:p-[48px_120px_24px_120px]',
}

type RegisterLayoutProps = {
  kind: keyof typeof LAYOUT_KINDS
  // Zero-based index into registerSteps().
  currentStep: number
  heading: PageHeadingProps
  children: React.ReactNode
}

// Navbar, stepper, heading, and page ending shared by every registration screen.
export function RegisterLayout({ kind, currentStep, heading, children }: RegisterLayoutProps) {
  const t = useTranslations('landing')
  const links = authLinks(useTranslations('auth.links'))
  const navItems = registerNavItems(t)
  const steps = registerSteps(useTranslations('auth.register'))
  return (
    <div className="bg-[#F3FAFF]">
      {/* Full-width frame; content stays on the export's 1440px grid (min width), centred by px-frame. overflow-clip (not hidden) keeps the navbar sticky. */}
      <div
        className={`box-border w-full lg:min-w-[1440px] h-fit flex flex-col gap-0 justify-start items-start bg-[#F3FAFF] overflow-clip ${kind === 'role' ? 'min-h-dvh relative' : ''}`}
      >
        <Navbar items={navItems} login={links.login} register={links.register} />
        <div className={`box-border w-full h-fit shrink-0 flex flex-col ${LAYOUT_KINDS[kind]} justify-start items-center relative [z-index:1]`}>
          <div className="box-border w-full lg:w-fit h-fit shrink-0 flex flex-col gap-[24px] lg:gap-[32px] lg:short:gap-[20px] justify-start items-center">
            <Stepper steps={steps} currentStep={currentStep} />
            <PageHeading {...heading} />
          </div>
          {children}
        </div>
        {kind === 'role' ? (
          // Pinned to the window's bottom edge; on short windows it sits behind the cards instead of below them.
          <div className="box-border w-full mt-auto lg:short:absolute lg:short:left-0 lg:short:bottom-0 [z-index:0]">
            <WaveDecoration />
          </div>
        ) : (
          <Footer {...footer(t)} quickLinks={navItems} />
        )}
      </div>
      {/* Drives the footer's `data-reveal`, as on the landing page. */}
      <ScrollReveal />
    </div>
  )
}
