'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

type ModalDialogProps = {
  // Where Escape goes: the same URL the dialog's "back" link points to.
  closeHref: string
  labelledBy: string
  describedBy?: string
  role?: 'dialog' | 'alertdialog'
  // Close when the backdrop (outside the content) is clicked. Off for confirmations, which need an explicit choice.
  dismissOnBackdrop?: boolean
  // Size and placement, e.g. `m-auto` to centre it or `m-0 ms-auto h-dvh` to dock it right.
  className: string
  children: React.ReactNode
}

// A native <dialog> opened with showModal(): the browser makes the page behind it inert, moves focus to the first
// control inside and fires `cancel` on Escape, which navigates to `closeHref` since the open state lives in the URL.
// The scrim is its ::backdrop.
export function ModalDialog({
  closeHref,
  labelledBy,
  describedBy,
  role = 'dialog',
  dismissOnBackdrop = false,
  className,
  children,
}: ModalDialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const router = useRouter()

  useEffect(() => {
    const dialog = ref.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  return (
    <dialog
      ref={ref}
      role={role}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      onCancel={(event) => {
        event.preventDefault()
        router.push(closeHref, { scroll: false })
      }}
      // A click on the dialog element itself (not its content) lands on the backdrop.
      onClick={dismissOnBackdrop ? (event) => event.target === ref.current && router.push(closeHref, { scroll: false }) : undefined}
      className={`max-w-none max-h-none p-0 border-0 bg-transparent overflow-visible overscroll-contain backdrop:bg-[#0B3B5CA6] ${className}`}
    >
      {children}
    </dialog>
  )
}
