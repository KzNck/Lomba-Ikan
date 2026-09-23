'use client'

import { useActionState } from 'react'
import { useTranslations } from 'next-intl'
import { FormField } from '@/components/register/form-field'
import { SubmitButton } from '@/components/register/submit-button'
import { FormError } from '@/components/login/form-error'
import { useErrorFocus } from '@/components/login/use-error-focus'
import { passwordFields } from '@/components/register/content'
import { setNewPassword, type AuthFormState } from '@/app/auth/actions'

// "Buat Password Baru": the same two password fields as registration. A success goes straight to the dashboard.
export function SetPasswordForm() {
  const fields = passwordFields(useTranslations('auth.register'))
  const t = useTranslations('auth.resetPassword')
  const [state, action, pending] = useActionState<AuthFormState, FormData>(setNewPassword, {})
  useErrorFocus(state)

  return (
    <form action={action} className="box-border w-full h-fit shrink-0 flex flex-col gap-[20px] justify-start items-start">
      {fields.map((field) => (
        <FormField key={field.id} {...field} />
      ))}
      <FormError message={state.error} />
      <SubmitButton label={t('submit')} icon="arrow-right" disabled={pending} />
    </form>
  )
}
