import Form from 'next/form'
import { LoginLayout } from '@/components/login/login-layout'
import { AuthCard } from '@/components/login/auth-card'
import { TermsNotice } from '@/components/login/terms-notice'
import { FormField } from '@/components/register/form-field'
import { SubmitButton } from '@/components/register/submit-button'
import { AccountPrompt } from '@/components/register/account-prompt'
import { LOGIN } from '@/components/login/content'

export default function LoginPage() {
  return (
    <LoginLayout backLink={LOGIN.backLink} illustration={LOGIN.illustration} tagline={LOGIN.tagline}>
      <AuthCard title={LOGIN.title} subtitle={LOGIN.subtitle}>
        <Form
          action={LOGIN.verifyHref}
          className="box-border w-full h-fit shrink-0 flex flex-col gap-[20px] justify-start items-start"
        >
          <FormField {...LOGIN.emailField} />
          <SubmitButton label={LOGIN.submitLabel} icon="send" />
        </Form>
        <TermsNotice {...LOGIN.terms} />
        <AccountPrompt question={LOGIN.signupQuestion} link={LOGIN.signupLink} layout="centered" />
      </AuthCard>
    </LoginLayout>
  )
}
