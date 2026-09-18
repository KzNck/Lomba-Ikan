import { Navbar } from '@/components/home/navbar'
import { Footer } from '@/components/home/footer'
import { Stepper } from '@/components/register/stepper'
import { PageHeading } from '@/components/register/page-heading'
import { FormCard } from '@/components/register/form-card'
import { FormField } from '@/components/register/form-field'
import { LocationFields } from '@/components/register/location-fields'
import { InfoCallout } from '@/components/register/info-callout'
import { SubmitButton } from '@/components/register/submit-button'
import { AUTH_LINKS, FOOTER } from '@/components/home/content'
import { NELAYAN_PROFILE, REGISTER_NAV_ITEMS, REGISTER_STEPS } from '@/components/register/content'

export default function RegisterNelayanPage() {
  return (
    <div className="bg-[#F3FAFF]">
      {/* Full-width frame; content stays on the export's 1440px grid (min width), centred by px-frame. overflow-clip (not hidden) keeps the navbar sticky. */}
      <div className="box-border w-full min-w-[1440px] h-fit flex flex-col gap-0 justify-start items-start bg-[#F3FAFF] overflow-clip">
        <Navbar items={REGISTER_NAV_ITEMS} login={AUTH_LINKS.login} register={AUTH_LINKS.register} />
        <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[40px] p-[48px_120px_24px_120px] justify-start items-center">
          <div className="box-border w-fit h-fit shrink-0 flex flex-col gap-[32px] justify-start items-center">
            <Stepper steps={REGISTER_STEPS} currentStep={1} />
            <PageHeading title={NELAYAN_PROFILE.title} subtitle={NELAYAN_PROFILE.subtitle} />
          </div>
          <FormCard {...NELAYAN_PROFILE.card}>
            <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[24px] justify-start items-start">
              <FormField {...NELAYAN_PROFILE.nameField} />
              <LocationFields {...NELAYAN_PROFILE.location} />
            </div>
            <InfoCallout {...NELAYAN_PROFILE.missingPpi} />
            <SubmitButton label={NELAYAN_PROFILE.submitLabel} />
          </FormCard>
        </div>
        <Footer {...FOOTER} quickLinks={REGISTER_NAV_ITEMS} />
      </div>
    </div>
  )
}
