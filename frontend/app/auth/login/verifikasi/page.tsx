import { redirect } from 'next/navigation'
import { LoginLayout } from '@/components/login/login-layout'
import { AuthCard } from '@/components/login/auth-card'
import { OtpForm } from '@/components/login/otp-form'
import { LOGIN, LOGIN_OTP } from '@/components/login/content'

export default async function VerifikasiOtpPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { email } = await searchParams
  // Reached without an address (e.g. typed URL): start over at the email step.
  if (typeof email !== 'string' || !email) redirect(LOGIN_OTP.changeEmailLink.href)

  return (
    <LoginLayout backLink={LOGIN.backLink} illustration={LOGIN.illustration} tagline={LOGIN.tagline}>
      <AuthCard
        backLink={LOGIN_OTP.changeEmailLink}
        title={LOGIN_OTP.title}
        subtitle={LOGIN_OTP.subtitle.replace('{email}', email)}
      >
        <OtpForm {...LOGIN_OTP.form} />
      </AuthCard>
    </LoginLayout>
  )
}
