import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { LoginLayout } from '@/components/login/login-layout'
import { AuthCard } from '@/components/login/auth-card'
import { LoginForm } from '@/components/login/login-form'
import { TermsNotice } from '@/components/login/terms-notice'
import { AccountPrompt } from '@/components/register/account-prompt'
import { loginContent } from '@/components/login/content'
import { homeForCurrentUser } from '@/app/auth/actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Already signed in: skip the form and go straight to the right dashboard.
  const home = await homeForCurrentUser()
  if (home) redirect(home)

  const { next, konfirmasi } = await searchParams
  const content = loginContent(await getTranslations('auth.login'))

  return (
    <LoginLayout backLink={content.backLink} illustration={content.illustration}>
      <AuthCard title={content.title} subtitle={content.subtitle}>
        <LoginForm
          next={typeof next === 'string' ? next : undefined}
          notice={konfirmasi === 'gagal' ? content.confirmFailed : undefined}
        />
        <TermsNotice {...content.terms} />
        <AccountPrompt question={content.signupQuestion} link={content.signupLink} layout="centered" />
      </AuthCard>
    </LoginLayout>
  )
}
