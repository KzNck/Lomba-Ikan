'use client'

import { useActionState } from 'react'
import { useTranslations } from 'next-intl'
import { FormField } from '@/components/register/form-field'
import { SubmitButton } from '@/components/register/submit-button'
import { FormError } from '@/components/login/form-error'
import { FormStatus } from '@/components/login/form-status'
import { useErrorFocus } from '@/components/login/use-error-focus'
import { loginContent } from '@/components/login/content'
import { requestPasswordReset, type AuthFormState } from '@/app/auth/actions'

// "Lupa Password": the account's email, then the same "check your inbox" message whether or not it has an account.
export function ForgotPasswordForm({ notice }: { notice?: string }) {
  const login = loginContent(useTranslations('auth.login'))
  const t = useTranslations('auth.forgotPassword')
  const [state, action, pending] = useActionState<AuthFormState, FormData>(requestPasswordReset, {})
  useErrorFocus(state)

  return (
    <form action={action} className="box-border w-full h-fit shrink-0 flex flex-col gap-[20px] justify-start items-start">
      <FormField {...login.emailField} defaultValue={state.email} />
      {/* The notice (an expired link) gives way once a new link is sent. */}
      <FormError message={state.error ?? (state.sent ? undefined : notice)} />
      <FormStatus message={state.sent ? t('sent') : undefined} />
      <SubmitButton label={state.sent ? t('resend') : t('submit')} icon="arrow-right" disabled={pending} />
    </form>
  )
}
