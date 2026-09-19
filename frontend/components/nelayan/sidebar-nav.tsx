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

const ITEM_STATES = {
  active: { item: 'bg-[#0F6CB8]', icon: '#FFFFFF', label: 'text-[#FFFFFF] font-semibold' },
  idle: { item: 'bg-[#00000000] hover:bg-[#FFFFFF14]', icon: '#B9D6E8', label: 'text-[#E3F0F9] font-medium' },
}

export function SidebarNav({ items }: { items: SidebarNavItem[] }) {
  const pathname = usePathname()

  return (
    <nav className="box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start relative [z-index:2]">
      {items.map(({ href, label, icon }) => {
        const isActive = pathname === href
        const state = ITEM_STATES[isActive ? 'active' : 'idle']
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={`box-border w-full h-[48px] shrink-0 flex flex-row gap-[12px] p-[0px_14px] justify-start items-center ${state.item} rounded-[12px] ${PRESS_WIDE} ${FOCUS_RING}`}
          >
            <Icon name={icon} fill={state.icon} className="box-border w-[20px] shrink-0 h-[20px]" />
            <span className={`text-[15px]/[normal] box-border ${state.label} font-inter text-left [white-space:nowrap]`}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
