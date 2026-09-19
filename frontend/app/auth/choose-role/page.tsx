import { RegisterLayout } from '@/components/register/register-layout'
import { RoleOptionCard } from '@/components/register/role-option-card'
import { AccountPrompt } from '@/components/register/account-prompt'
import { CHOOSE_ROLE } from '@/components/register/content'

export default function ChooseRolePage() {
  return (
    <RegisterLayout kind="role" currentStep={0} heading={CHOOSE_ROLE.heading}>
      <div
        className="box-border w-fit h-[426px] shrink-0 flex flex-row gap-[32px] justify-start items-start motion-safe:animate-fade-up"
        style={{ animationDelay: '300ms' }}
      >
        {CHOOSE_ROLE.roles.map((role) => (
          <RoleOptionCard key={role.href} {...role} />
        ))}
      </div>
      <AccountPrompt question={CHOOSE_ROLE.loginQuestion} link={CHOOSE_ROLE.loginLink} />
    </RegisterLayout>
  )
}
