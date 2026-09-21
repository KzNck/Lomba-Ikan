'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { useTranslations } from 'next-intl'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { OUTLINE_HOVER, PRESS, SOLID_HOVER } from '@/components/ui/interaction'
import type { CancelReservationState } from '@/app/transaction-actions'

type CancelReservationFormProps = {
  transactionId: string
  // Whose drawer this is: the buyer cancels an order, the fisher a reservation, and each is told what that means.
  role: 'nelayan' | 'pembeli'
  // The history view to come back to once it's cancelled.
  returnHref: string
  action: (state: CancelReservationState, formData: FormData) => Promise<CancelReservationState>
}

// "Batalkan pesanan" (buyer) / "Batalkan reservasi" (fisher) at the bottom of the history drawer, for a transaction
// still in progress. Cancelling can't be undone, so the button opens a confirmation first; errors come back from the
// action (already finished or cancelled, or a failed request).
export function CancelReservationForm({ transactionId, role, returnHref, action }: CancelReservationFormProps) {
  const t = useTranslations('dashboard.riwayat.cancel')
  const [state, formAction] = useActionState(action, {})
  const [confirming, setConfirming] = useState(false)
  const confirmRef = useRef<HTMLDivElement>(null)
  const startRef = useRef<HTMLButtonElement>(null)

  // A result from the action ends the confirmation, so its error shows under the button again. Adjusted while
  // rendering (not in an effect) so the stale confirmation never paints.
  const [result, setResult] = useState(state)
  if (result !== state) {
    setResult(state)
    setConfirming(false)
  }

  useEffect(() => {
    if (confirming) confirmRef.current?.querySelector<HTMLButtonElement>('button[type="submit"]')?.focus()
  }, [confirming])

  return (
    <form action={formAction} className="box-border w-full h-fit shrink-0 flex flex-col gap-[8px] justify-start items-start">
      <input type="hidden" name="id" value={transactionId} />
      <input type="hidden" name="kembali" value={returnHref} />
      {confirming ? (
        <div
          ref={confirmRef}
          role="group"
          aria-labelledby="cancel-reservation-title"
          className="box-border w-full h-fit shrink-0 flex flex-col gap-[10px] p-[14px] justify-start items-start bg-[#FDECEC] rounded-[12px]"
        >
          <p id="cancel-reservation-title" className="text-[14px]/[normal] box-border text-[#8F2A25] font-poppins font-semibold text-left">
            {t('title')}
          </p>
          <p className="text-[12px]/[18px] box-border w-full text-[#5C1F1B] font-inter font-normal text-left">
            {role === 'pembeli' ? t('bodyBuyer') : t('bodyFisher')}
          </p>
          <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-start">
            <BackButton
              label={t('back')}
              onBack={() => {
                setConfirming(false)
                // The start button is back once this group unmounts.
                requestAnimationFrame(() => startRef.current?.focus())
              }}
            />
            <ConfirmButton label={t('confirm')} pendingLabel={t('cancelling')} />
          </div>
        </div>
      ) : (
        <button
          ref={startRef}
          type="button"
          onClick={() => setConfirming(true)}
          className={`box-border w-full h-fit shrink-0 flex flex-row gap-[8px] p-[11px_16px] justify-center items-center bg-[#FFFFFF] [outline:1.5px_solid_#C23B35] [outline-offset:-0.75px] rounded-[999px] cursor-pointer hover:bg-[#FDECEC] ${PRESS} ${FOCUS_RING}`}
        >
          <Icon name="circle-x" fill="#C23B35" className="box-border w-[16px] shrink-0 h-[16px]" />
          <span className="text-[14px]/[normal] box-border text-[#C23B35] font-poppins font-semibold text-left [white-space:nowrap]">
            {role === 'pembeli' ? t('buyerAction') : t('fisherAction')}
          </span>
        </button>
      )}
      {state.error && (
        <p role="alert" className="box-border w-full h-fit flex flex-row gap-[8px] justify-start items-start">
          <Icon name="circle-alert" fill="#C23B35" className="box-border w-[14px] shrink-0 h-[14px] mt-[2px]" />
          <span className="text-[12px]/[18px] box-border text-[#C23B35] font-inter font-medium text-left">{state.error}</span>
        </p>
      )}
    </form>
  )
}

function BackButton({ label, onBack }: { label: string; onBack: () => void }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="button"
      disabled={pending}
      onClick={onBack}
      className={`box-border [flex:1_1_0] h-fit flex flex-row gap-[8px] p-[10px_12px] justify-center items-center bg-[#FFFFFF] [outline:1.5px_solid_#0F6CB8] [outline-offset:-0.75px] rounded-[999px] cursor-pointer disabled:cursor-wait disabled:opacity-70 ${OUTLINE_HOVER} ${PRESS} ${FOCUS_RING}`}
    >
      <span className="text-[13px]/[normal] box-border text-[#0F6CB8] font-poppins font-semibold text-left [white-space:nowrap]">{label}</span>
    </button>
  )
}

function ConfirmButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending || undefined}
      className={`box-border [flex:1.3_1_0] h-fit flex flex-row gap-[8px] p-[10px_12px] justify-center items-center bg-[#C23B35] rounded-[999px] cursor-pointer disabled:cursor-wait disabled:opacity-80 ${pending ? '' : `${SOLID_HOVER} ${PRESS}`} ${FOCUS_RING}`}
    >
      {pending && <Icon name="loader-circle" fill="#FFFFFF" className="box-border w-[14px] shrink-0 h-[14px] motion-safe:animate-spin" />}
      <span className="text-[13px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">
        {pending ? pendingLabel : label}
      </span>
    </button>
  )
}
