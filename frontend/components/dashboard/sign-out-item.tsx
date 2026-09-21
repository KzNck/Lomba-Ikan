'use client'

import { useId, useRef, useSyncExternalStore } from 'react'
import { useFormStatus } from 'react-dom'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { useTranslations } from 'next-intl'
import { getLocalCatches } from '@/lib/offline/storage'
import { signOut } from '@/app/auth/actions'
import { PRESS_WIDE, SOLID_HOVER } from '@/components/ui/interaction'

// "Keluar" inside the account menu. Catches saved while offline live only in this device's localStorage, so signing
// out with some still queued would lose them: that case asks first. With none queued it signs out straight away.
// The dialog sits inside the form so the confirm button submits it directly and shares its pending state.
// The offline queue is a localStorage key, so it is read as an external store: the server renders 0 (no queue
// there), and the real count arrives on hydration without a mismatch. Another tab emptying it updates this one.
function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange)
  return () => window.removeEventListener('storage', onChange)
}

export function SignOutItem() {
  const t = useTranslations('dashboard.accountMenu')
  const queued = useSyncExternalStore(
    subscribe,
    () => getLocalCatches().length,
    () => 0
  )
  const dialogRef = useRef<HTMLDialogElement>(null)
  // The header and the sidebar each render one of these, so the dialog's ids have to be unique per instance.
  const titleId = useId()
  const bodyId = useId()
  // A ref, not state: the confirm button sets it and submits in the same tick.
  const confirmed = useRef(false)

  return (
    <form
      action={signOut}
      onSubmit={(event) => {
        if (confirmed.current || !queued) return
        event.preventDefault()
        dialogRef.current?.showModal()
      }}
      className="box-border w-full"
    >
      <SignOutButton />
      <dialog
        ref={dialogRef}
        role="alertdialog"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        className="m-auto max-w-none max-h-none p-0 border-0 bg-transparent overflow-visible backdrop:bg-[#0B3B5CA6] w-[420px] rounded-[24px] [box-shadow:0px_16px_48px_0px_#0B3B5C33] motion-safe:animate-fade-up"
      >
        <div className="box-border w-full h-fit flex flex-col gap-[20px] p-[28px] justify-start items-start bg-[#FFFFFF] rounded-[24px]">
          <div className="box-border w-[48px] h-[48px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#FDECEC] rounded-[999px]">
            <Icon name="circle-alert" fill="#C23B35" className="box-border w-[22px] shrink-0 h-[22px]" />
          </div>
          <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[6px] justify-start items-start">
            <h2 id={titleId} className="text-[20px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">
              {t('confirm.title')}
            </h2>
            <p id={bodyId} className="text-[14px]/[21px] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">
              {t('confirm.body', { count: queued })}
            </p>
          </div>
          <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-end items-start">
            <CancelButton onCancel={() => dialogRef.current?.close()} />
            <ConfirmButton onConfirm={() => (confirmed.current = true)} />
          </div>
        </div>
      </dialog>
    </form>
  )
}

// The menu item itself. Disabled while signing out, so a second press can't fire another request.
function SignOutButton() {
  const t = useTranslations('dashboard.accountMenu')
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={`box-border w-full h-[40px] shrink-0 flex flex-row gap-[10px] p-[0px_12px] justify-start items-center rounded-[8px] cursor-pointer hover:bg-[#FDECEC] disabled:cursor-wait disabled:opacity-70 transition-colors duration-150 ease-out ${FOCUS_RING}`}
    >
      <Icon
        name={pending ? 'loader-circle' : 'log-out'}
        fill="#C23B35"
        className={`box-border w-[16px] shrink-0 h-[16px] ${pending ? 'motion-safe:animate-spin' : ''}`}
      />
      <span className="text-[14px]/[normal] box-border text-[#C23B35] font-poppins font-medium text-left [white-space:nowrap]">
        {pending ? t('signingOut') : t('signOut')}
      </span>
    </button>
  )
}

// Focused first when the dialog opens, so the safe choice is the one under the cursor and the keyboard.
function CancelButton({ onCancel }: { onCancel: () => void }) {
  const t = useTranslations('dashboard.accountMenu')
  const { pending } = useFormStatus()
  return (
    <button
      type="button"
      autoFocus
      disabled={pending}
      onClick={onCancel}
      className={`box-border w-fit shrink-0 h-fit flex flex-row gap-[12px] p-[13px_20px] justify-center items-center bg-[#FFFFFF] [outline:1.5px_solid_#0F6CB8] [outline-offset:-0.75px] rounded-[999px] cursor-pointer hover:bg-[#F3FAFF] disabled:cursor-wait ${FOCUS_RING}`}
    >
      <span className="text-[16px]/[normal] box-border text-[#0F6CB8] font-poppins font-semibold text-left [white-space:nowrap]">
        {t('confirm.cancel')}
      </span>
    </button>
  )
}

function ConfirmButton({ onConfirm }: { onConfirm: () => void }) {
  const t = useTranslations('dashboard.accountMenu')
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={onConfirm}
      className={`box-border w-fit shrink-0 h-fit [box-shadow:0px_8px_20px_0px_#C23B3540] flex flex-row gap-[10px] p-[14px_22px] justify-center items-center bg-[#C23B35] rounded-[999px] cursor-pointer disabled:cursor-wait ${SOLID_HOVER} ${PRESS_WIDE} ${FOCUS_RING}`}
    >
      {pending && <Icon name="loader-circle" fill="#FFFFFF" className="box-border w-[16px] shrink-0 h-[16px] motion-safe:animate-spin" />}
      <span className="text-[16px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">
        {pending ? t('signingOut') : t('confirm.confirm')}
      </span>
    </button>
  )
}
