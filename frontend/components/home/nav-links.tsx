'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { NavItem } from '@/components/home/navbar'

// A section becomes active once its top passes this fraction of the viewport height.
const ACTIVE_LINE = 0.4

type NavLinksProps = {
  items: NavItem[]
  initialHref: string
}

// Section links whose bold + underline follow the section currently in view.
export function NavLinks({ items, initialHref }: NavLinksProps) {
  const [activeHref, setActiveHref] = useState(initialHref)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const line = window.innerHeight * ACTIVE_LINE
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2

      let current = items[0]?.href
      for (const item of items) {
        const section = document.getElementById(item.href.slice(1))
        if (section && section.getBoundingClientRect().top <= line) current = item.href
      }
      // The last section may be too short to ever reach the line.
      if (atBottom) current = items[items.length - 1]?.href

      if (current) setActiveHref(current)
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [items])

  return items.map((item) => <NavLink key={item.href} {...item} active={item.href === activeHref} />)
}

export function NavLink({ href, label, active }: NavItem & { active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'location' : undefined}
      // One underline for every link (active or hovered) so it can animate between them without shifting layout.
      className={`group box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[8px_0px_10px_0px] justify-start items-center relative after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:bg-[#0F6CB8] after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 focus-visible:after:scale-x-100 motion-reduce:after:transition-none ${
        active ? 'after:scale-x-100' : 'after:scale-x-0'
      }`}
    >
      {/* The invisible semibold copy reserves the bold width, so neighbours don't shift when the weight changes. */}
      <span className="grid">
        <span
          className={`[grid-area:1/1] text-[15px]/[normal] box-border ${
            active ? 'text-[#0F6CB8] font-semibold' : 'text-[#0B3B5C] font-medium'
          } group-hover:text-[#0F6CB8] group-focus-visible:text-[#0F6CB8] transition-[color,font-weight] duration-200 ease-out motion-reduce:transition-none font-inter text-center [white-space:nowrap]`}
        >
          {label}
        </span>
        <span
          aria-hidden="true"
          className="[grid-area:1/1] invisible text-[15px]/[normal] font-semibold font-inter [white-space:nowrap]"
        >
          {label}
        </span>
      </span>
    </Link>
  )
}
