'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { FormField } from '@/components/register/form-field'
import { SubmitButton } from '@/components/register/submit-button'
import { FormError } from '@/components/login/form-error'
import { useErrorFocus } from '@/components/login/use-error-focus'
import { loginContent } from '@/components/login/content'
import { login, type AuthFormState } from '@/app/auth/actions'

// The /auth/login form: email and password straight to Supabase. Whatever the
// credentials get wrong, the message is the same one, so a wrong password can't
// be told apart from an address that has no account.
export function LoginForm({
  next,
  notice,
}: {
  // Where to land after signing in, when the proxy bounced the user here from a protected page.
  next?: string
  // A message from elsewhere, e.g. a confirmation link that had already been used.
  notice?: string
}) {
  const content = loginContent(useTranslations('auth.login'))
  const [state, action, pending] = useActionState<AuthFormState, FormData>(login, {})
  useErrorFocus(state)

  return (
    <form
      action={action}
      className="box-border w-full h-fit shrink-0 flex flex-col gap-[20px] justify-start items-start"
    >
      {next && <input type="hidden" name="next" value={next} />}
      <FormField {...content.emailField} defaultValue={state.email} />
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[6px] justify-start items-end">
        <FormField {...content.passwordField} />
        <Link
          href={content.forgotLink.href}
          className={`box-border w-fit min-h-[44px] lg:min-h-auto flex items-center p-[4px_2px] text-[14px]/[normal] text-[#0F6CB8] font-inter font-semibold text-right hover:underline underline-offset-[3px] rounded-[4px] ${FOCUS_RING}`}
        >
          {content.forgotLink.label}
        </Link>
      </div>
      <FormError message={state.error ?? notice} />
      <SubmitButton label={content.submitLabel} icon="arrow-right" disabled={pending} />
    </form>
  )
}
