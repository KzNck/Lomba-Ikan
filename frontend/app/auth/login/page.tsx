import { redirect } from 'next/navigation'
import { LoginLayout } from '@/components/login/login-layout'
import { AuthCard } from '@/components/login/auth-card'
import { LoginForm } from '@/components/login/login-form'
import { TermsNotice } from '@/components/login/terms-notice'
import { AccountPrompt } from '@/components/register/account-prompt'
import { LOGIN } from '@/components/login/content'
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

  return (
    <LoginLayout backLink={LOGIN.backLink} illustration={LOGIN.illustration} tagline={LOGIN.tagline}>
      <AuthCard title={LOGIN.title} subtitle={LOGIN.subtitle}>
        <LoginForm
          next={typeof next === 'string' ? next : undefined}
          notice={konfirmasi === 'gagal' ? LOGIN.confirmFailed : undefined}
        />
        <TermsNotice {...LOGIN.terms} />
        <AccountPrompt question={LOGIN.signupQuestion} link={LOGIN.signupLink} layout="centered" />
      </AuthCard>
    </LoginLayout>
  )
}
