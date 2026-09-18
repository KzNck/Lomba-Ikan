import { Navbar } from '@/components/home/navbar'
import { Stepper } from '@/components/register/stepper'
import { PageHeading } from '@/components/register/page-heading'
import { RoleOptionCard } from '@/components/register/role-option-card'
import { LoginPrompt } from '@/components/register/login-prompt'
import { WaveDecoration } from '@/components/register/wave-decoration'
import { AUTH_LINKS } from '@/components/home/content'
import { CHOOSE_ROLE, REGISTER_NAV_ITEMS, REGISTER_STEPS } from '@/components/register/content'

export default function ChooseRolePage() {
  return (
    <div className="bg-[#F3FAFF]">
      {/* Full-width frame; content stays on the export's 1440px grid (min width), centred by px-frame. overflow-clip (not hidden) keeps the navbar sticky. */}
      <div className="box-border w-full min-w-[1440px] h-fit flex flex-col gap-0 justify-start items-start bg-[#F3FAFF] overflow-clip">
        <Navbar items={REGISTER_NAV_ITEMS} login={AUTH_LINKS.login} register={AUTH_LINKS.register} />
        <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[48px] p-[48px_120px_56px_120px] justify-start items-center">
          <div className="box-border w-fit h-fit shrink-0 flex flex-col gap-[32px] justify-start items-center">
            <Stepper steps={REGISTER_STEPS} currentStep={0} />
            <PageHeading title={CHOOSE_ROLE.title} subtitle={CHOOSE_ROLE.subtitle} />
          </div>
          <div className="box-border w-fit h-[426px] shrink-0 flex flex-row gap-[32px] justify-start items-start">
            {CHOOSE_ROLE.roles.map((role) => (
              <RoleOptionCard key={role.href} {...role} />
            ))}
          </div>
          <LoginPrompt question={CHOOSE_ROLE.loginQuestion} link={CHOOSE_ROLE.loginLink} />
        </div>
        <WaveDecoration />
      </div>
    </div>
  )
}
