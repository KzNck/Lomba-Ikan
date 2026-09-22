'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { PRESS } from '@/components/ui/interaction'
import { activeHref, type SidebarNavItem } from '@/components/dashboard/sidebar-nav'

// The sidebar's destinations as a tab bar fixed to the bottom of the screen, below lg (from lg the sidebar shows).
// "Tambah Tangkapan" is the fisher's main action, so it moves to the middle as a raised button.
export function BottomTabBar({ items }: { items: SidebarNavItem[] }) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const currentHref = activeHref(items, pathname)

  const action = items.find(({ labelKey }) => labelKey === 'addCatch')
  const tabs = items.filter((item) => item !== action)
  if (action) tabs.splice(Math.floor(tabs.length / 2), 0, action)

  return (
    <nav
      aria-label={t('tabsLabel')}
      className="lg:hidden box-border fixed left-0 right-0 bottom-0 z-50 bg-[#FFFFFF] [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#E2E8F0] [box-shadow:0px_-4px_16px_0px_#0B3B5C0F] pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="box-border w-full max-w-[640px] mx-auto h-[64px] flex flex-row justify-around items-stretch">
        {tabs.map((item) => {
          const active = item.href === currentHref
          const raised = item === action
          return (
            <li key={item.href} className="box-border [flex:1_1_0] min-w-0 flex">
              <Link
                href={item.href}
                aria-current={active ? (pathname === item.href ? 'page' : 'true') : undefined}
                className={`group box-border w-full min-h-[44px] flex flex-col gap-[3px] justify-center items-center rounded-[12px] ${PRESS} ${FOCUS_RING}`}
              >
                {raised ? (
                  <span className="box-border w-[48px] h-[48px] shrink-0 -mt-[26px] flex justify-center items-center bg-[#0F6CB8] rounded-[999px] [box-shadow:0px_6px_16px_0px_#0F6CB859] [outline:4px_solid_#FFFFFF]">
                    <Icon name="plus" fill="#FFFFFF" className="box-border w-[24px] h-[24px]" />
                  </span>
                ) : (
                  <Icon name={item.icon} fill={active ? '#0F6CB8' : '#5B6B7C'} className="box-border w-[22px] h-[22px] shrink-0" />
                )}
                <span
                  // The raised action's label may take two lines; the others fit one.
                  className={`text-[11px]/[13px] box-border max-w-full ${active || raised ? 'text-[#0F6CB8] font-semibold' : 'text-[#5B6B7C] font-medium'} font-inter text-center ${raised ? 'line-clamp-2' : 'truncate'}`}
                >
                  {t(item.labelKey)}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
