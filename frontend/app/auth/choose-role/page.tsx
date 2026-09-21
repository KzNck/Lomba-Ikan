import { RegisterLayout } from '@/components/register/register-layout'
import { RoleOptionCard } from '@/components/register/role-option-card'
import { AccountPrompt } from '@/components/register/account-prompt'
import { useTranslations } from 'next-intl'
import { chooseRole } from '@/components/register/content'

export default function ChooseRolePage() {
  const content = chooseRole(useTranslations('auth.register'))
  return (
    <RegisterLayout kind="role" currentStep={0} heading={content.heading}>
      <div
        className="box-border w-fit h-[426px] shrink-0 flex flex-row gap-[32px] justify-start items-start motion-safe:animate-fade-up"
        style={{ animationDelay: '300ms' }}
      >
        {content.roles.map((role) => (
          <RoleOptionCard key={role.href} {...role} />
        ))}
      </div>
      <AccountPrompt question={content.loginQuestion} link={content.loginLink} />
    </RegisterLayout>
  )
}
