'use client'

import { useActionState, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useFormStatus } from 'react-dom'
import { useTranslations } from 'next-intl'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { OUTLINE_HOVER, PRESS, SOLID_HOVER } from '@/components/ui/interaction'
import type { PickupState } from '@/app/transaction-actions'
import type { PickupContent } from '@/lib/nelayan/riwayat'

type PickupFormProps = {
  transactionId: string
  pickup: PickupContent
  scheduleAction: (state: PickupState, formData: FormData) => Promise<PickupState>
  receiptAction: (state: PickupState, formData: FormData) => Promise<PickupState>
}

const FIELD = 'jadwal-pengambilan'

// "2026-09-23T14:30" in the browser's own time zone, the value a datetime-local input takes.
function toLocalInput(iso: string | null): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const noSubscribe = () => () => {}

// The buyer's half of the pickup (designv2 §9), in their transaction drawer while it is in progress: when they'll
// collect the batch at the PPI, then "Batch sudah diterima" once they have it. The fisher can only mark the
// transaction done after that confirmation. On a project without supabase/pickup-confirmation.sql the confirmation
// part is left out, and the fisher completes it alone as before.
export function PickupForm({ transactionId, pickup, scheduleAction, receiptAction }: PickupFormProps) {
  const t = useTranslations('dashboard.riwayat.pickup')
  const [scheduleState, scheduleFormAction] = useActionState(scheduleAction, { status: 'idle' })
  const [receiptState, receiptFormAction] = useActionState(receiptAction, { status: 'idle' })
  const [editedAt, setEditedAt] = useState<PickupState | null>(null)
  const [confirming, setConfirming] = useState(false)
  const confirmRef = useRef<HTMLDivElement>(null)
  const startRef = useRef<HTMLButtonElement>(null)
  const isoRef = useRef<HTMLInputElement>(null)

  // The saved time in the buyer's time zone. The server renders it empty (it doesn't know the zone) and the real value
  // arrives on hydration; the input is keyed by it, so it remounts with the right default.
  const savedLocal = useSyncExternalStore(noSubscribe, () => toLocalInput(pickup.scheduledIso), () => '')
  const showSaved = scheduleState.status === 'saved' && editedAt !== scheduleState

  // A failed confirmation closes the confirm step so the error shows under the button again.
  const [receiptResult, setReceiptResult] = useState(receiptState)
  if (receiptResult !== receiptState) {
    setReceiptResult(receiptState)
    setConfirming(false)
  }

  useEffect(() => {
    if (confirming) confirmRef.current?.querySelector<HTMLButtonElement>('button[type="submit"]')?.focus()
  }, [confirming])

  return (
    <section className="box-border w-full h-fit shrink-0 flex flex-col gap-[16px] p-[14px_16px] justify-start items-start [outline:1.5px_solid_#0F6CB8] [outline-offset:-0.75px] rounded-[12px]">
      <form
        action={scheduleFormAction}
        onChange={() => setEditedAt(scheduleState)}
        className="box-border w-full h-fit shrink-0 flex flex-col gap-[8px] justify-start items-start"
      >
        <input type="hidden" name="id" value={transactionId} />
        {/* The browser knows the buyer's time zone, so the picked local time travels to the server as ISO. */}
        <input ref={isoRef} type="hidden" name="jadwal" defaultValue={pickup.scheduledIso ?? ''} />
        <label htmlFor={FIELD} className="text-[14px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left">
          {t('scheduleLabel')}
        </label>
        <p id={`${FIELD}-helper`} className="text-[12px]/[18px] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">
          {t('scheduleHelper')}
        </p>
        <div className="box-border w-full h-fit shrink-0 flex flex-row flex-wrap gap-[8px] justify-start items-stretch">
          <input
            key={savedLocal}
            id={FIELD}
            name={FIELD}
            type="datetime-local"
            required
            defaultValue={savedLocal}
            onChange={(event) => {
              const at = event.target.value ? new Date(event.target.value) : null
              if (isoRef.current) isoRef.current.value = at && !Number.isNaN(at.getTime()) ? at.toISOString() : ''
            }}
            aria-describedby={scheduleState.status === 'error' ? `${FIELD}-helper ${FIELD}-error` : `${FIELD}-helper`}
            aria-invalid={scheduleState.status === 'error' ? true : undefined}
            className={`box-border [flex:1_1_180px] min-w-0 h-[44px] p-[0px_12px] bg-[#FFFFFF] ${scheduleState.status === 'error' ? '[outline:1.5px_solid_#C23B35]' : '[outline:1px_solid_#7F8FA4]'} [outline-offset:-0.5px] rounded-[10px] text-[16px]/[normal] lg:text-[14px]/[normal] text-[#0B3B5C] font-inter font-medium focus-visible:[outline-color:#0F6CB8] focus-visible:[box-shadow:0px_0px_0px_2px_#FFFFFF,_0px_0px_0px_4px_#0F6CB8]`}
          />
          <SubmitButton label={pickup.scheduledIso ? t('scheduleChange') : t('scheduleSave')} pendingLabel={t('scheduleSaving')} />
        </div>
        {/* A stable live region, so the result is announced when it appears. */}
        <div role="status" className="box-border w-full h-fit">
          {showSaved && (
            <p className="box-border w-full h-fit flex flex-row gap-[8px] justify-start items-start">
              <Icon name="circle-check" fill="#17704A" className="box-border w-[14px] shrink-0 h-[14px] mt-[2px]" />
              <span className="text-[12px]/[18px] box-border text-[#17704A] font-inter font-semibold text-left">{t('scheduleSaved')}</span>
            </p>
          )}
        </div>
        {scheduleState.status === 'error' && (
          <p id={`${FIELD}-error`} role="alert" className="box-border w-full h-fit flex flex-row gap-[8px] justify-start items-start">
            <Icon name="circle-alert" fill="#C23B35" className="box-border w-[14px] shrink-0 h-[14px] mt-[2px]" />
            <span className="text-[12px]/[18px] box-border text-[#C23B35] font-inter font-medium text-left">{scheduleState.error}</span>
          </p>
        )}
      </form>

      {pickup.receipt === 'pending' && (
        <form
          action={receiptFormAction}
          className="box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[14px_0px_0px_0px] justify-start items-start [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#E2E8F0]"
        >
          <input type="hidden" name="id" value={transactionId} />
          <h4 className="text-[14px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left">{t('receiptTitle')}</h4>
          <p className="text-[12px]/[18px] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">{t('receiptDescription')}</p>
          {receiptState.status === 'error' && (
            <p role="alert" className="box-border w-full h-fit flex flex-row gap-[8px] justify-start items-start">
              <Icon name="circle-alert" fill="#C23B35" className="box-border w-[14px] shrink-0 h-[14px] mt-[2px]" />
              <span className="text-[12px]/[18px] box-border text-[#C23B35] font-inter font-medium text-left">{receiptState.error}</span>
            </p>
          )}
          {confirming ? (
            <div
              ref={confirmRef}
              role="group"
              aria-labelledby="receipt-confirm-title"
              className="box-border w-full h-fit shrink-0 flex flex-col gap-[10px] p-[12px] justify-start items-start bg-[#F3FAFF] rounded-[10px]"
            >
              <p id="receipt-confirm-title" className="text-[13px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left">
                {t('receiptConfirmTitle')}
              </p>
              <p className="text-[12px]/[18px] box-border w-full text-[#0B3B5C] font-inter font-normal text-left">{t('receiptConfirmBody')}</p>
              <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-start">
                <BackButton
                  label={t('back')}
                  onBack={() => {
                    setConfirming(false)
                    requestAnimationFrame(() => startRef.current?.focus())
                  }}
                />
                <ConfirmButton label={t('receiptConfirmYes')} pendingLabel={t('receiptConfirming')} />
              </div>
            </div>
          ) : (
            <button
              ref={startRef}
              type="button"
              onClick={() => setConfirming(true)}
              className={`box-border w-full h-fit min-h-[44px] lg:min-h-auto shrink-0 flex flex-row gap-[8px] p-[12px_16px] justify-center items-center bg-[#0F6CB8] rounded-[999px] cursor-pointer ${SOLID_HOVER} ${PRESS} ${FOCUS_RING}`}
            >
              <Icon name="package-check" fill="#FFFFFF" className="box-border w-[16px] shrink-0 h-[16px]" />
              <span className="text-[14px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">
                {t('receiptButton')}
              </span>
            </button>
          )}
        </form>
      )}
    </section>
  )
}

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending || undefined}
      className={`box-border w-fit shrink-0 min-h-[44px] flex flex-row gap-[8px] p-[10px_16px] justify-center items-center bg-[#FFFFFF] [outline:1.5px_solid_#0F6CB8] [outline-offset:-0.75px] rounded-[999px] cursor-pointer disabled:cursor-wait disabled:opacity-70 ${OUTLINE_HOVER} ${PRESS} ${FOCUS_RING}`}
    >
      {pending && <Icon name="loader-circle" fill="#0F6CB8" className="box-border w-[14px] shrink-0 h-[14px] motion-safe:animate-spin" />}
      <span className="text-[13px]/[normal] box-border text-[#0F6CB8] font-poppins font-semibold text-left [white-space:nowrap]">
        {pending ? pendingLabel : label}
      </span>
    </button>
  )
}

function BackButton({ label, onBack }: { label: string; onBack: () => void }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="button"
      disabled={pending}
      onClick={onBack}
      className={`box-border [flex:1_1_0] h-fit min-h-[44px] lg:min-h-auto flex flex-row gap-[8px] p-[10px_12px] justify-center items-center bg-[#FFFFFF] [outline:1.5px_solid_#0F6CB8] [outline-offset:-0.75px] rounded-[999px] cursor-pointer disabled:cursor-wait disabled:opacity-70 ${OUTLINE_HOVER} ${PRESS} ${FOCUS_RING}`}
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
      className={`box-border [flex:1.3_1_0] h-fit min-h-[44px] lg:min-h-auto flex flex-row gap-[8px] p-[10px_12px] justify-center items-center bg-[#0F6CB8] rounded-[999px] cursor-pointer disabled:cursor-wait disabled:opacity-80 ${pending ? '' : `${SOLID_HOVER} ${PRESS}`} ${FOCUS_RING}`}
    >
      {pending && <Icon name="loader-circle" fill="#FFFFFF" className="box-border w-[14px] shrink-0 h-[14px] motion-safe:animate-spin" />}
      <span className="text-[13px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">
        {pending ? pendingLabel : label}
      </span>
    </button>
  )
}
