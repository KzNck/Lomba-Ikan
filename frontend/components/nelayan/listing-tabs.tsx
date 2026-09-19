import Link from 'next/link'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'

export type ListingTab = {
  href: string
  label: string
  count: number
  active: boolean
}

const TAB_STATES = {
  active: {
    tab: '[border-width:0px_0px_3px_0px] [border-style:solid] [border-color:#0F6CB8]',
    label: 'text-[#0F6CB8] font-semibold',
    count: 'bg-[#DCEEFB]',
    countText: 'text-[#0F6CB8]',
  },
  idle: {
    tab: 'hover:bg-[#F3FAFF]',
    label: 'text-[#5B6B7C] font-medium',
    count: 'bg-[#E2E8F0]',
    countText: 'text-[#0B3B5C]',
  },
}

// "Aktif" / "Terjual/Diambil". Each tab is a link, so the selected one lives in the URL (?tab=terjual).
export function ListingTabs({ tabs, label }: { tabs: ListingTab[]; label: string }) {
  return (
    <nav
      aria-label={label}
      className="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-start [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#E2E8F0]"
    >
      {tabs.map(({ href, label, count, active }) => {
        const state = TAB_STATES[active ? 'active' : 'idle']
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`box-border w-fit shrink-0 h-[48px] flex flex-row gap-[8px] p-[0px_16px] justify-start items-center ${state.tab} transition-colors duration-200 ease-out focus-visible:rounded-[10px] ${FOCUS_RING}`}
          >
            <span className={`text-[15px]/[normal] box-border ${state.label} font-poppins text-left [white-space:nowrap]`}>{label}</span>
            <span className={`box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[1px_8px] justify-start items-start ${state.count} rounded-[999px]`}>
              <span className={`text-[12px]/[normal] box-border ${state.countText} font-poppins font-semibold text-left [white-space:nowrap]`}>{count}</span>
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
