'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { OUTLINE_HOVER, PRESS, SOLID_HOVER } from '@/components/ui/interaction'

type UnsavedChanges = {
  // The form reports whether it has edits since its last save, and how to save them.
  setDirty: (dirty: boolean) => void
  setSaver: (save: (() => void) | null) => void
  // The form reports a finished save, so a navigation waiting on "Simpan" can go ahead (or be dropped).
  reportSave: (ok: boolean) => void
  // For links: call from onClick. Returns true if it held the navigation to ask first.
  holdNavigation: (href: string) => boolean
}

const UnsavedChangesContext = createContext<UnsavedChanges | null>(null)

export function useUnsavedChanges() {
  const context = useContext(UnsavedChangesContext)
  if (!context) throw new Error('useUnsavedChanges needs an UnsavedChangesProvider')
  return context
}

type DialogCopy = { title: string; body: string; discardLabel: string; saveLabel: string }

// Guards moving between account sections while a form has unsaved edits, with the "Pindah bagian dengan perubahan
// belum disimpan" dialog: "Buang perubahan" leaves anyway, "Simpan" saves and then leaves if the save succeeds.
// The dialog is a native modal <dialog>: focus moves in, the page behind is inert, Escape stays put.
export function UnsavedChangesProvider({ dialog, children }: { dialog: DialogCopy; children: React.ReactNode }) {
  const router = useRouter()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const dirtyRef = useRef(false)
  const saverRef = useRef<(() => void) | null>(null)
  const [pendingHref, setPendingHref] = useState<string | null>(null)
  const [savingThenLeaving, setSavingThenLeaving] = useState(false)

  useEffect(() => {
    const element = dialogRef.current
    if (!element) return
    if (pendingHref && !savingThenLeaving && !element.open) element.showModal()
    if ((!pendingHref || savingThenLeaving) && element.open) element.close()
  }, [pendingHref, savingThenLeaving])

  const leave = useCallback(
    (href: string) => {
      dirtyRef.current = false
      setPendingHref(null)
      setSavingThenLeaving(false)
      router.push(href)
    },
    [router],
  )

  const value: UnsavedChanges = {
    setDirty: useCallback((dirty) => {
      dirtyRef.current = dirty
    }, []),
    setSaver: useCallback((save) => {
      saverRef.current = save
    }, []),
    reportSave: useCallback(
      (ok) => {
        if (!savingThenLeaving || !pendingHref) return
        if (ok) leave(pendingHref)
        else {
          setPendingHref(null)
          setSavingThenLeaving(false)
        }
      },
      [savingThenLeaving, pendingHref, leave],
    ),
    holdNavigation: useCallback((href) => {
      if (!dirtyRef.current) return false
      setPendingHref(href)
      return true
    }, []),
  }

  return (
    <UnsavedChangesContext value={value}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby="unsaved-title"
        aria-describedby="unsaved-body"
        onClose={() => {
          if (!savingThenLeaving) setPendingHref(null)
        }}
        className="m-auto max-w-none max-h-none p-0 border-0 bg-transparent overflow-visible backdrop:bg-[#0B3B5CA6] w-[420px] rounded-[24px] [box-shadow:0px_16px_48px_0px_#0B3B5C33] motion-safe:animate-fade-up"
      >
        <div className="box-border w-full h-fit flex flex-col gap-[20px] p-[28px] justify-start items-start bg-[#FFFFFF] rounded-[24px]">
          <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[6px] justify-start items-start">
            <h2 id="unsaved-title" className="text-[20px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">
              {dialog.title}
            </h2>
            <p id="unsaved-body" className="text-[14px]/[21px] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">
              {dialog.body}
            </p>
          </div>
          <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-end items-start">
            <button
              type="button"
              onClick={() => pendingHref && leave(pendingHref)}
              className={`box-border w-fit shrink-0 h-fit flex flex-row gap-[12px] p-[13px_20px] justify-center items-center bg-[#FFFFFF] [outline:1.5px_solid_#0F6CB8] [outline-offset:-0.75px] rounded-[999px] cursor-pointer ${OUTLINE_HOVER} ${PRESS} ${FOCUS_RING}`}
            >
              <span className="text-[16px]/[normal] box-border text-[#0F6CB8] font-poppins font-semibold text-left [white-space:nowrap]">
                {dialog.discardLabel}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSavingThenLeaving(true)
                saverRef.current?.()
              }}
              className={`box-border w-fit shrink-0 h-fit [box-shadow:0px_8px_20px_0px_#0F6CB840] flex flex-row gap-[12px] p-[14px_22px] justify-center items-center [background-image:linear-gradient(90deg,_#0F6CB8_0%,_#0F5C82_100%)] bg-no-repeat bg-[length:100%_100%] rounded-[999px] cursor-pointer ${SOLID_HOVER} ${PRESS} ${FOCUS_RING}`}
            >
              <span className="text-[16px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">
                {dialog.saveLabel}
              </span>
            </button>
          </div>
        </div>
      </dialog>
    </UnsavedChangesContext>
  )
}
