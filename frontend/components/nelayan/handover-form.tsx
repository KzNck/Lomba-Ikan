'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { useFormatter, useTranslations } from 'next-intl'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { OUTLINE_HOVER, PRESS, SOLID_HOVER } from '@/components/ui/interaction'
import type { HandoverState } from '@/app/nelayan/actions'

type HandoverFormProps = {
  transactionId: string
  // The weight the transaction was claimed at, which the final weight starts from.
  weightKg: number
  // The history view to come back to once the transaction is complete.
  returnHref: string
  action: (state: HandoverState, formData: FormData) => Promise<HandoverState>
}

const FIELD = 'berat-akhir'

// "Serah Terima" in the fisher's transaction drawer, for a transaction still in progress: the final weight from the
// PPI's scale, then a confirmation, since completing the transaction releases the payment and can't be undone.
// Errors (a bad weight, a transaction that stopped running, a failed request) come back from the action.
export function HandoverForm({ transactionId, weightKg, returnHref, action }: HandoverFormProps) {
  const t = useTranslations('dashboard.riwayat.handover')
  const format = useFormatter()
  const [state, formAction] = useActionState(action, {
    weight: format.number(weightKg, { maximumFractionDigits: 2, useGrouping: false }),
  })
  const [confirming, setConfirming] = useState(false)
  const [weight, setWeight] = useState(state.weight)
  const confirmRef = useRef<HTMLDivElement>(null)
  const startRef = useRef<HTMLButtonElement>(null)

  // A result from the action means the confirmation is over: show the form again with its error. Adjusted while
  // rendering (not in an effect) so the stale confirmation never paints.
  const [result, setResult] = useState(state)
  if (result !== state) {
    setResult(state)
    setConfirming(false)
    setWeight(state.weight)
  }

  // Moving between the two steps keeps focus where the user is looking.
  useEffect(() => {
    if (confirming) confirmRef.current?.querySelector<HTMLButtonElement>('button[type="submit"]')?.focus()
  }, [confirming])

  return (
    <section className="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[14px_16px] justify-start items-start [outline:1.5px_solid_#0F6CB8] [outline-offset:-0.75px] rounded-[12px]">
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start">
        <h3 className="text-[14px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left">{t('title')}</h3>
        <p className="text-[12px]/[18px] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">{t('description')}</p>
      </div>
      <form action={formAction} className="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] justify-start items-start">
        <input type="hidden" name="id" value={transactionId} />
        <input type="hidden" name="kembali" value={returnHref} />
        <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[6px] justify-start items-start">
          <label htmlFor={FIELD} className="text-[13px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left">
            {t('weightLabel')}
          </label>
          <div
            className={`box-border w-full h-[44px] shrink-0 flex flex-row gap-[10px] p-[0px_14px] justify-start items-center bg-[#FFFFFF] ${state.error ? '[outline:1.5px_solid_#C23B35]' : '[outline:1px_solid_#7F8FA4]'} [outline-offset:-0.5px] rounded-[10px] focus-within:[outline-color:#0F6CB8] focus-within:[box-shadow:0px_0px_0px_2px_#FFFFFF,_0px_0px_0px_4px_#0F6CB8]`}
          >
            <Icon name="package" fill="#5B6B7C" className="box-border w-[16px] shrink-0 h-[16px]" />
            <input
              id={FIELD}
              name="berat"
              inputMode="decimal"
              autoComplete="off"
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
              // A form with one field submits on Enter even without a submit button; that would skip the
              // confirmation, so Enter opens it instead.
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !confirming) {
                  event.preventDefault()
                  setConfirming(true)
                }
              }}
              // Changing the weight after opening the confirmation would confirm a different number than it shows.
              readOnly={confirming}
              aria-describedby={state.error ? `${FIELD}-helper ${FIELD}-error` : `${FIELD}-helper`}
              aria-invalid={state.error ? true : undefined}
              className="text-[15px]/[normal] box-border [flex:1_1_0] w-0 min-w-0 bg-transparent text-[#0B3B5C] font-poppins font-semibold text-left outline-none read-only:text-[#5B6B7C]"
            />
            <span aria-hidden="true" className="text-[13px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left">
              kg
            </span>
          </div>
          <p id={`${FIELD}-helper`} className="text-[12px]/[normal] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">
            {t('weightHelper')}
          </p>
          {state.error && (
            <p id={`${FIELD}-error`} role="alert" className="box-border w-full h-fit flex flex-row gap-[8px] justify-start items-start">
              <Icon name="circle-alert" fill="#C23B35" className="box-border w-[14px] shrink-0 h-[14px] mt-[2px]" />
              <span className="text-[12px]/[18px] box-border text-[#C23B35] font-inter font-medium text-left">{state.error}</span>
            </p>
          )}
        </div>

        {confirming ? (
          <div
            ref={confirmRef}
            role="group"
            aria-labelledby={`${FIELD}-confirm-title`}
            className="box-border w-full h-fit shrink-0 flex flex-col gap-[10px] p-[12px] justify-start items-start bg-[#F3FAFF] rounded-[10px]"
          >
            <p id={`${FIELD}-confirm-title`} className="text-[13px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left">
              {t('confirmTitle')}
            </p>
            <p className="text-[12px]/[18px] box-border w-full text-[#0B3B5C] font-inter font-normal text-left">
              {t('confirmBody', { weight })}
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
              <ConfirmButton label={t('confirmYes')} pendingLabel={t('confirming')} />
            </div>
          </div>
        ) : (
          <button
            ref={startRef}
            type="button"
            onClick={() => setConfirming(true)}
            className={`box-border w-full h-fit shrink-0 flex flex-row gap-[8px] p-[12px_16px] justify-center items-center bg-[#0F6CB8] rounded-[999px] cursor-pointer ${SOLID_HOVER} ${PRESS} ${FOCUS_RING}`}
          >
            <Icon name="handshake" fill="#FFFFFF" className="box-border w-[16px] shrink-0 h-[16px]" />
            <span className="text-[14px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">
              {t('submit')}
            </span>
          </button>
        )}
      </form>
    </section>
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
      className={`box-border [flex:1.3_1_0] h-fit flex flex-row gap-[8px] p-[10px_12px] justify-center items-center bg-[#0F6CB8] rounded-[999px] cursor-pointer disabled:cursor-wait disabled:opacity-80 ${pending ? '' : `${SOLID_HOVER} ${PRESS}`} ${FOCUS_RING}`}
    >
      {pending && <Icon name="loader-circle" fill="#FFFFFF" className="box-border w-[14px] shrink-0 h-[14px] motion-safe:animate-spin" />}
      <span className="text-[13px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">
        {pending ? pendingLabel : label}
      </span>
    </button>
  )
}
