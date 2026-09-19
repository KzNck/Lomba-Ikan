'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { useUnsavedChanges } from '@/components/pembeli/unsaved-changes'
import type { AccountNavItem } from '@/components/pembeli/akun-content'

type AccountSubnavProps = {
  label: string
  items: AccountNavItem[]
  signOutLabel: string
  signOut: () => void | Promise<void>
}

const ITEM =
  'box-border w-full h-[48px] shrink-0 flex flex-row gap-[12px] p-[0px_14px] justify-start items-center rounded-[12px] transition-colors duration-150 ease-out'

const ITEM_STATES = {
  active: { item: 'bg-[#F3FAFF] [outline:1px_solid_#DCEEFB] [outline-offset:-0.5px]', icon: '#0F6CB8', label: 'text-[#0F6CB8] font-semibold' },
  idle: { item: 'bg-[#00000000] hover:bg-[#F7F9FC]', icon: '#5B6B7C', label: 'text-[#0B3B5C] font-medium' },
}

// "Sub Navigation": the account sections, then "Keluar" under a divider. Leaving a section with unsaved edits asks
// first (see UnsavedChangesProvider).
export function AccountSubnav({ label, items, signOutLabel, signOut }: AccountSubnavProps) {
  const pathname = usePathname()
  const { holdNavigation } = useUnsavedChanges()

  return (
    <nav
      aria-label={label}
      className="box-border w-[240px] shrink-0 h-fit flex flex-col gap-[4px] p-[12px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[20px]"
    >
      <ul className="contents">
        {items.map(({ href, label, icon }) => {
          const active = pathname === href
          const state = ITEM_STATES[active ? 'active' : 'idle']
          return (
            <li key={href} className="box-border w-full">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                onClick={(event) => {
                  if (!active && holdNavigation(href)) event.preventDefault()
                }}
                className={`${ITEM} ${state.item} ${FOCUS_RING}`}
              >
                <Icon name={icon} fill={state.icon} className="box-border w-[20px] shrink-0 h-[20px]" />
                <span className={`text-[15px]/[normal] box-border ${state.label} font-poppins text-left [white-space:nowrap]`}>{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
      <div aria-hidden="true" className="box-border w-full h-[17px] shrink-0 flex flex-col gap-0 p-[8px_14px] justify-start items-start">
        <div className="box-border w-full h-[1px] shrink-0 bg-[#E2E8F0]" />
      </div>
      <form action={signOut} className="box-border w-full">
        <button type="submit" className={`${ITEM} bg-[#00000000] hover:bg-[#FDECEC] cursor-pointer ${FOCUS_RING}`}>
          <Icon name="log-out" fill="#C23B35" className="box-border w-[20px] shrink-0 h-[20px]" />
          <span className="text-[15px]/[normal] box-border text-[#C23B35] font-poppins font-medium text-left [white-space:nowrap]">{signOutLabel}</span>
        </button>
      </form>
    </nav>
  )
}
