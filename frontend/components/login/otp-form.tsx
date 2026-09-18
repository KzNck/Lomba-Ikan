'use client'

import { OtpInput } from '@/components/login/otp-input'
import { SubmitButton } from '@/components/register/submit-button'
import { Icon } from '@/components/ui/icon'

export type OtpFormContent = {
  otp: {
    name: string
    label: string
    length: number
    digitLabel: string
  }
  // Static until the resend flow exists on the backend.
  resendText: string
  submitLabel: string
}

// The code field and "Verifikasi & masuk". `contents` keeps both on the card's 28px rhythm.
export function OtpForm({ otp, resendText, submitLabel }: OtpFormContent) {
  return (
    // Verification waits on Supabase; until it's wired up, submitting stays on this page.
    <form className="contents" onSubmit={(event) => event.preventDefault()}>
      <OtpInput {...otp}>
        <div className="box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] p-[4px_0px_0px_0px] justify-start items-center">
          <Icon name="timer" fill="#5B6B7C" className="box-border w-[16px] shrink-0 h-[16px]" />
          <p className="text-[14px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">
            {resendText}
          </p>
        </div>
      </OtpInput>
      <SubmitButton label={submitLabel} icon="arrow-right" />
    </form>
  )
}
