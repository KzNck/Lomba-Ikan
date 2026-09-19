'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon, type IconName } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { PRESS_WIDE } from '@/components/ui/interaction'

export type SidebarNavItem = {
  href: string
  label: string
  icon: IconName
}

export type SidebarNotifications = { href: string; label: string; unreadCount: number }

const ITEM_STATES = {
  active: { item: 'bg-[#0F6CB8]', icon: '#FFFFFF', label: 'text-[#FFFFFF] font-semibold' },
  idle: { item: 'bg-[#00000000] hover:bg-[#FFFFFF14]', icon: '#B9D6E8', label: 'text-[#E3F0F9] font-medium' },
}

type SidebarNavProps = {
  items: SidebarNavItem[]
  // Label typeface: the nelayan frame sets nav labels in Inter, the pembeli frame in Poppins.
  labelFont: string
  // Pinned above the user card, below the spacer (pembeli only).
  notifications?: SidebarNotifications
}

// The item whose href is the longest match for the current path, so pages below an item keep it highlighted
// (the "Tambah Tangkapan" modal's /nelayan/catat/hasil) without the section's own dashboard (/nelayan) lighting up.
function activeHref(items: SidebarNavItem[], pathname: string) {
  return items
    .map(({ href }) => href)
    .filter((href) => pathname === href || pathname.startsWith(`${href}/`))
    .sort((a, b) => b.length - a.length)[0]
}

// The main nav, the spacer that pushes the rest to the bottom, and the optional notifications link.
export function SidebarNav({ items, labelFont, notifications }: SidebarNavProps) {
  const pathname = usePathname()
  const currentHref = activeHref(items, pathname)

  return (
    <>
      <nav className="box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start relative [z-index:2]">
        {items.map(({ href, label, icon }) => {
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
              <span className={`text-[15px]/[normal] box-border ${state.label} ${labelFont} text-left [white-space:nowrap]`}>
                {label}
              </span>
            </Link>
          )
        })}
      </nav>
      <div className="box-border w-full [flex:1_1_0] relative [z-index:3]" />
      {notifications && (
        <Link
          href={notifications.href}
          aria-label={`${notifications.label}, ${notifications.unreadCount} belum dibaca`}
          className={`box-border w-full h-[44px] shrink-0 flex flex-row gap-[12px] p-[0px_14px] justify-start items-center hover:bg-[#FFFFFF14] rounded-[12px] relative [z-index:4] ${PRESS_WIDE} ${FOCUS_RING}`}
        >
          <Icon name="bell" fill="#B9D6E8" className="box-border w-[20px] shrink-0 h-[20px]" />
          <span className={`text-[15px]/[normal] box-border text-[#E3F0F9] ${labelFont} font-medium text-left [white-space:nowrap]`}>
            {notifications.label}
          </span>
          {notifications.unreadCount > 0 && (
            <span className="box-border w-[20px] shrink-0 h-[20px] flex flex-row gap-0 justify-center items-center bg-[#C23B35] rounded-[999px]">
              <span className="text-[11px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">
                {notifications.unreadCount}
              </span>
            </span>
          )}
        </Link>
      )}
    </>
  )
}
