'use client'

import { useEffect, useRef } from 'react'
import { useFormatter } from 'next-intl'

const DURATION_MS = 1000
// Text before the first number, the whole number with its group separators ("3.000" in id, "3,000" in en), and
// everything after it.
const PATTERN = /^(\D*)(\d[\d.,]*)(.*)$/

// Counts the number inside `value` up from 0 when it scrolls into view, e.g. "≥70%" or "3.000 kg/bulan".
// The server renders the final value, so it reads correctly without JS, with reduced motion, and when the
// stat is already on screen at load (those skip the count, like the scroll reveals do).
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  // Formats the in-between numbers in the active locale, so they group like the final value.
  const format = useFormatter()

  useEffect(() => {
    const el = ref.current
    const match = PATTERN.exec(value)
    if (!el || !match) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (el.getBoundingClientRect().top < window.innerHeight) return

    const [, prefix, digits, suffix] = match
    const target = Number(digits.replace(/\D/g, ''))
    // Written straight to the DOM: one frame per update without re-rendering React.
    const render = (n: number) => {
      el.textContent = `${prefix}${format.number(n)}${suffix}`
    }
    render(0)

    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min((now - start) / DURATION_MS, 1)
          render(Math.round(target * (1 - (1 - t) ** 3)))
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      render(target)
    }
  }, [value, format])

  return (
    // The invisible final value reserves the full width, so the text beside it doesn't shift while counting.
    <span className="inline-grid">
      <span aria-hidden="true" className="[grid-area:1/1] invisible">
        {value}
      </span>
      <span ref={ref} aria-hidden="true" className="[grid-area:1/1]">
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  )
}
