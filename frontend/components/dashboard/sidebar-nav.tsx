'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Icon, type IconName } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { PRESS_WIDE } from '@/components/ui/interaction'

export type SidebarNavItem = {
  href: string
  // The item's name under `nav` in messages/*.json.
  labelKey: 'dashboard' | 'addCatch' | 'myListings' | 'history' | 'account' | 'marketplace'
  icon: IconName
}

const ITEM_STATES = {
  active: { item: 'bg-[#0F6CB8]', icon: '#FFFFFF', label: 'text-[#FFFFFF] font-semibold' },
  idle: { item: 'bg-[#00000000] hover:bg-[#FFFFFF14]', icon: '#B9D6E8', label: 'text-[#E3F0F9] font-medium' },
}

type SidebarNavProps = {
  items: SidebarNavItem[]
}

// The item whose href is the longest match for the current path, so pages below an item keep it highlighted
// (the "Tambah Tangkapan" modal's /nelayan/catat/hasil) without the section's own dashboard (/nelayan) lighting up.
export function activeHref(items: SidebarNavItem[], pathname: string) {
  return items
    .map(({ href }) => href)
    .filter((href) => pathname === href || pathname.startsWith(`${href}/`))
    .sort((a, b) => b.length - a.length)[0]
}

// The main nav and the spacer that pushes the user card to the bottom.
export function SidebarNav({ items }: SidebarNavProps) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const currentHref = activeHref(items, pathname)

  return (
    <>
      <nav className="box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start relative [z-index:2]">
        {items.map(({ href, labelKey, icon }) => {
          const isActive = href === currentHref
          const state = ITEM_STATES[isActive ? 'active' : 'idle']
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? (pathname === href ? 'page' : 'true') : undefined}
              className={`box-border w-full h-[48px] shrink-0 flex flex-row gap-[12px] p-[0px_14px] justify-start items-center ${state.item} rounded-[12px] ${PRESS_WIDE} ${FOCUS_RING}`}
            >
              <Icon name={icon} fill={state.icon} className="box-border w-[20px] shrink-0 h-[20px]" />
              <span className={`text-[15px]/[normal] box-border ${state.label} font-inter text-left [white-space:nowrap]`}>
                {t(labelKey)}
              </span>
            </Link>
          )
        })}
      </nav>
      <div className="box-border w-full [flex:1_1_0] relative [z-index:3]" />
    </>
  )
}
