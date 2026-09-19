import { Navbar } from '@/components/home/navbar'
import { Footer } from '@/components/home/footer'
import { Stepper } from '@/components/register/stepper'
import { PageHeading, type PageHeadingProps } from '@/components/register/page-heading'
import { WaveDecoration } from '@/components/register/wave-decoration'
import { ScrollReveal } from '@/components/home/scroll-reveal'
import { AUTH_LINKS, FOOTER } from '@/components/home/content'
import { REGISTER_NAV_ITEMS, REGISTER_STEPS } from '@/components/register/content'

// The Pilih Role frame is roomier and ends in a wave; the profile forms sit tighter above the full footer.
const LAYOUT_KINDS = {
  role: 'gap-[48px] p-[48px_120px_56px_120px]',
  form: 'gap-[40px] p-[48px_120px_24px_120px]',
}

type RegisterLayoutProps = {
  kind: keyof typeof LAYOUT_KINDS
  // Zero-based index into REGISTER_STEPS.
  currentStep: number
  heading: PageHeadingProps
  children: React.ReactNode
}

// Navbar, stepper, heading, and page ending shared by every registration screen.
export function RegisterLayout({ kind, currentStep, heading, children }: RegisterLayoutProps) {
  return (
    <div className="bg-[#F3FAFF]">
      {/* Full-width frame; content stays on the export's 1440px grid (min width), centred by px-frame. overflow-clip (not hidden) keeps the navbar sticky. */}
      <div className="box-border w-full min-w-[1440px] h-fit flex flex-col gap-0 justify-start items-start bg-[#F3FAFF] overflow-clip">
        <Navbar items={REGISTER_NAV_ITEMS} login={AUTH_LINKS.login} register={AUTH_LINKS.register} />
        <div className={`box-border w-full h-fit shrink-0 flex flex-col ${LAYOUT_KINDS[kind]} justify-start items-center`}>
          <div className="box-border w-fit h-fit shrink-0 flex flex-col gap-[32px] justify-start items-center">
            <Stepper steps={REGISTER_STEPS} currentStep={currentStep} />
            <PageHeading {...heading} />
          </div>
          {children}
        </div>
        {kind === 'role' ? <WaveDecoration /> : <Footer {...FOOTER} quickLinks={REGISTER_NAV_ITEMS} />}
      </div>
      {/* Drives the footer's `data-reveal`, as on the landing page. */}
      <ScrollReveal />
    </div>
  )
}
