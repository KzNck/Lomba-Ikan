import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { LoginLayout } from '@/components/login/login-layout'
import { AuthCard } from '@/components/login/auth-card'
import { SetPasswordForm } from '@/components/login/set-password-form'
import { loginContent } from '@/components/login/content'
import { getSessionUser } from '@/lib/supabase/auth'

// "Buat Password Baru": where the reset link lands, signed in by /auth/confirm. Without a session (the link expired,
// or the page was opened directly) there is no account to change, so back to Lupa Password to ask for a new link.
export default async function AturPasswordPage() {
  const user = await getSessionUser()
  if (!user) redirect('/auth/lupa-password?kedaluwarsa=1')

  const login = loginContent(await getTranslations('auth.login'))
  const t = await getTranslations('auth.resetPassword')

  return (
    <LoginLayout backLink={login.backLink} illustration={login.illustration}>
      <AuthCard title={t('title')} subtitle={t('subtitle', { email: user.email })}>
        <SetPasswordForm />
      </AuthCard>
    </LoginLayout>
  )
}
