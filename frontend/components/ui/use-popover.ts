'use client'

import { useEffect, useId, useRef, useState } from 'react'

// Open/close state for a button that discloses a panel under it (the sort menu, the filter editors). Escape closes
// it and returns focus to the button; a pointer press outside `rootRef` closes it too.
export function usePopover() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      buttonRef.current?.focus()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return {
    open,
    setOpen,
    rootRef,
    buttonRef,
    buttonProps: {
      ref: buttonRef,
      type: 'button' as const,
      'aria-expanded': open,
      'aria-controls': panelId,
      onClick: () => setOpen((value) => !value),
    },
    panelProps: { id: panelId, hidden: !open },
  }
}
