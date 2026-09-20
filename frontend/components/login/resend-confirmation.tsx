'use client'

import { useActionState, useEffect, useState } from 'react'
import { SubmitButton } from '@/components/register/submit-button'
import { FormError } from '@/components/login/form-error'
import { FormStatus } from '@/components/login/form-status'
import { CONFIRM_EMAIL } from '@/components/login/content'
import { resendConfirmation, type AuthFormState } from '@/app/auth/actions'

// Supabase rejects a second send made too soon, so the button locks for this long
// after each one rather than letting the user earn a rate-limit error.
const COOLDOWN_SECONDS = 60

const countdown = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

// "Kirim ulang email konfirmasi" on /auth/daftar/konfirmasi.
export function ResendConfirmation({ email }: { email: string }) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(resendConfirmation, {})
  // Started from the submit itself rather than from the result, so the countdown
  // begins when the request does.
  const [secondsLeft, setSecondsLeft] = useState(0)

  useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = setTimeout(() => setSecondsLeft((current) => current - 1), 1000)
    return () => clearTimeout(timer)
  }, [secondsLeft])

  // A send that came back with an error unlocks the button early: there is nothing
  // to wait for when nothing was sent.
  const waiting = secondsLeft > 0 && !state.error

  return (
    <form
      action={action}
      onSubmit={() => setSecondsLeft(COOLDOWN_SECONDS)}
      className="box-border w-full h-fit shrink-0 flex flex-col gap-[16px] justify-start items-start"
    >
      <input type="hidden" name="email" value={email} />
      <FormStatus message={state.sent ? CONFIRM_EMAIL.resentText : undefined} />
      <FormError message={state.error} />
      <SubmitButton
        label={waiting ? CONFIRM_EMAIL.resendWaitLabel.replace('{time}', countdown(secondsLeft)) : CONFIRM_EMAIL.resendLabel}
        icon="send"
        disabled={pending || waiting}
      />
    </form>
  )
}
