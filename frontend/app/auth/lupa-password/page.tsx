import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { LoginLayout } from '@/components/login/login-layout'
import { AuthCard } from '@/components/login/auth-card'
import { ForgotPasswordForm } from '@/components/login/forgot-password-form'
import { AccountPrompt } from '@/components/register/account-prompt'
import { loginContent } from '@/components/login/content'
import { AUTH_HREFS } from '@/components/home/content'
import { homeForCurrentUser } from '@/app/auth/actions'

// "Lupa Password", linked from Masuk. The emailed link goes through /auth/confirm to /auth/atur-password.
export default async function LupaPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Already signed in: nothing to recover.
  const home = await homeForCurrentUser()
  if (home) redirect(home)

  const login = loginContent(await getTranslations('auth.login'))
  const t = await getTranslations('auth.forgotPassword')
  const expired = (await searchParams).kedaluwarsa === '1'

  return (
    <LoginLayout backLink={login.backLink} illustration={login.illustration}>
      <AuthCard title={t('title')} subtitle={t('subtitle')}>
        <ForgotPasswordForm notice={expired ? (await getTranslations('auth.errors'))('resetLinkExpired') : undefined} />
        <AccountPrompt question={t('rememberQuestion')} link={{ href: AUTH_HREFS.login, label: t('rememberLink') }} layout="centered" />
      </AuthCard>
    </LoginLayout>
  )
}
