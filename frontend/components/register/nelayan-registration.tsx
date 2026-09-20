'use client'

import { useActionState } from 'react'
import { RegisterLayout } from '@/components/register/register-layout'
import { FormCard } from '@/components/register/form-card'
import { FormField } from '@/components/register/form-field'
import { LocationFields } from '@/components/register/location-fields'
import { InfoCallout } from '@/components/register/info-callout'
import { SubmitButton } from '@/components/register/submit-button'
import { FormError } from '@/components/login/form-error'
import { useErrorFocus } from '@/components/login/use-error-focus'
import { NELAYAN_PROFILE, EMAIL_FIELD, PASSWORD_FIELDS } from '@/components/register/content'
import { registerNelayan, type AuthFormState } from '@/app/auth/actions'

// Saving the profile creates the account. With email confirmation switched off in
// Supabase this lands straight on the dashboard; with it on, the action redirects
// to /auth/daftar/konfirmasi and the profile row is written once the link is used.
export function NelayanRegistration() {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(registerNelayan, {})
  useErrorFocus(state)

  return (
    <RegisterLayout kind="form" currentStep={1} heading={NELAYAN_PROFILE.heading}>
      <FormCard {...NELAYAN_PROFILE.card} action={action}>
        <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[24px] justify-start items-start">
          <FormField {...NELAYAN_PROFILE.nameField} />
          <FormField {...EMAIL_FIELD} defaultValue={state.email} />
          {PASSWORD_FIELDS.map((field) => (
            <FormField key={field.id} {...field} />
          ))}
          <LocationFields {...NELAYAN_PROFILE.location} />
        </div>
        <InfoCallout {...NELAYAN_PROFILE.missingPpi} />
        <FormError message={state.error} />
        <SubmitButton label={NELAYAN_PROFILE.submitLabel} disabled={pending} />
      </FormCard>
    </RegisterLayout>
  )
}
