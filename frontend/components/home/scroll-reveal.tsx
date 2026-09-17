'use client'

import { useEffect } from 'react'

const STAGGER_MS = 45
const MAX_DELAY_MS = 360

// Fades in every `[data-reveal]` element as it scrolls into view. Renders nothing.
// Elements stay visible until this runs, so the page still works without JS, and
// anything already on screen at hydration is shown immediately instead of flickering.
export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))

    for (const el of elements) {
      // Stagger siblings: cards in the same row come in one after another.
      const siblings = Array.from(el.parentElement?.children ?? []).filter((child) => child.hasAttribute('data-reveal'))
      el.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(el) * STAGGER_MS, MAX_DELAY_MS)}ms`)

      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.setAttribute('data-revealed', '')
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-revealed', '')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.15 },
    )

    for (const el of elements) {
      if (!el.hasAttribute('data-revealed')) observer.observe(el)
    }
    root.setAttribute('data-reveal-ready', '')

    return () => {
      observer.disconnect()
      root.removeAttribute('data-reveal-ready')
    }
  }, [])

  return null
}
