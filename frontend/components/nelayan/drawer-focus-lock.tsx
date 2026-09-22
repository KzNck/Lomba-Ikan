'use client'

import { useEffect, useRef } from 'react'

const NARROW = '(max-width: 1023.98px)'

// The link that opened each drawer, kept by reference (its href changes while the drawer is open). Stored outside
// the effect so a re-run — Strict Mode runs effects twice — doesn't mistake the already-focused close link for it.
const openers = new WeakMap<Element, HTMLElement>()

// Below lg the detail drawers (Riwayat, Listing Saya) cover the screen, so while one is open the page behind it is
// made inert — out of the tab order and the accessibility tree — focus moves to its close link, and Escape follows
// that link. Closing puts focus back on the link that opened it. From lg the drawers are side panels beside a live
// page and none of this applies. Render it inside the drawer; its close link carries `data-drawer-close`.
export function DrawerFocusLock() {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const drawer = ref.current?.closest('aside')
    if (!drawer) return
    const query = window.matchMedia(NARROW)
    const closeLink = () => drawer.querySelector<HTMLElement>('[data-drawer-close]')
    if (!openers.has(drawer) && document.activeElement instanceof HTMLElement && !drawer.contains(document.activeElement)) {
      openers.set(drawer, document.activeElement)
    }
    let inerted: Element[] = []

    const release = () => {
      inerted.forEach((element) => element.removeAttribute('inert'))
      inerted = []
    }
    const apply = () => {
      release()
      if (!query.matches) return
      for (let node: Element = drawer; node.parentElement && node !== document.body; node = node.parentElement) {
        for (const sibling of node.parentElement.children) {
          if (sibling === node || sibling.hasAttribute('inert') || sibling.tagName === 'SCRIPT') continue
          sibling.setAttribute('inert', '')
          inerted.push(sibling)
        }
      }
      if (!drawer.contains(document.activeElement)) closeLink()?.focus({ preventScroll: true })
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && query.matches) closeLink()?.click()
    }

    apply()
    query.addEventListener('change', apply)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      release()
      query.removeEventListener('change', apply)
      document.removeEventListener('keydown', onKeyDown)
      if (!query.matches) return
      requestAnimationFrame(() => {
        const opener = openers.get(drawer)
        if (document.activeElement && document.activeElement !== document.body) return
        if (opener?.isConnected) opener.focus({ preventScroll: true })
      })
    }
  }, [])

  return <span ref={ref} hidden />
}
