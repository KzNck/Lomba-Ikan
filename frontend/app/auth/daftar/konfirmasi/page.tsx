import { redirect } from 'next/navigation'
import { LoginLayout } from '@/components/login/login-layout'
import { AuthCard } from '@/components/login/auth-card'
import { AccountPrompt } from '@/components/register/account-prompt'
import { Icon } from '@/components/ui/icon'
import { LOGIN, CONFIRM_EMAIL } from '@/components/login/content'

// Shown after registering when the project requires email confirmation, so the account
// exists but has no session yet. With confirmation switched off, registration goes
// straight to the dashboard and nobody lands here.
export default async function KonfirmasiEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { email } = await searchParams
  // Reached without an address (e.g. typed URL): nothing to confirm, so start at login.
  if (typeof email !== 'string' || !email) redirect(CONFIRM_EMAIL.link.href)

  return (
    <LoginLayout backLink={LOGIN.backLink} illustration={LOGIN.illustration} tagline={LOGIN.tagline}>
      <AuthCard title={CONFIRM_EMAIL.title} subtitle={CONFIRM_EMAIL.subtitle.replace('{email}', email)}>
        <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] p-[16px] justify-start items-start bg-[#DCEEFB] rounded-[12px]">
          <Icon name="mailbox" fill="#0F6CB8" className="box-border w-[20px] shrink-0 h-[20px] mt-[1px]" />
          <p className="text-[14px]/[21px] box-border [flex:1_1_0] text-[#0B3B5C] font-inter font-normal text-left">
            {CONFIRM_EMAIL.body}
          </p>
        </div>
        <AccountPrompt question={CONFIRM_EMAIL.question} link={CONFIRM_EMAIL.link} layout="centered" />
      </AuthCard>
    </LoginLayout>
  )
}
