'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Icon } from '@/components/ui/icon'
import { EmptyState } from '@/components/nelayan/empty-state'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { OUTLINE_HOVER, PRESS } from '@/components/ui/interaction'
import { usePopover } from '@/components/ui/use-popover'
import { useNotifications } from '@/components/dashboard/notifications-context'
import type { NotificationEntry, NotificationTone } from '@/lib/notifications'

const TONE_STYLES: Record<NotificationTone, { circle: string; fill: string }> = {
  success: { circle: 'bg-[#E8F8F2]', fill: '#17704A' },
  info: { circle: 'bg-[#DCEEFB]', fill: '#0F6CB8' },
  warning: { circle: 'bg-[#FFF4E0]', fill: '#8A5100' },
}

const YEAR = 60 * 60 * 24 * 365

// The header bell and its dropdown, the only place notifications are shown. Opening it marks everything read: the
// badge clears and the time is saved in a cookie the server reads next render, while the rows that were new stay
// tinted until the dropdown closes. The panel hangs from the header (its nearest positioned box), not the bell: from lg
// it sits on the header's right padding edge, below it it spans the header between the paddings.
export function NotificationBell() {
  const t = useTranslations('notifications')
  const nav = useTranslations('nav')
  const { items, seenAt: savedSeenAt, cookieName, role } = useNotifications()
  const { open, rootRef, buttonProps, panelProps, setOpen } = usePopover()
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  // What this tab has marked read, on top of what the cookie said when the layout rendered.
  const [seenAt, setSeenAt] = useState(savedSeenAt)
  // The rows that were unread when the dropdown opened, kept tinted while it is open.
  const [freshSince, setFreshSince] = useState<number | null>(null)
  const lastSeen = Math.max(seenAt, savedSeenAt)
  const unreadCount = items.filter((item) => item.at > lastSeen).length

  const toggle = () => {
    if (!open) {
      setFreshSince(lastSeen)
      const now = Date.now()
      setSeenAt(now)
      document.cookie = `${cookieName}=${now}; path=/; max-age=${YEAR}; samesite=lax`
    }
    buttonProps.onClick()
  }

  useEffect(() => {
    if (open) panelRef.current?.focus()
  }, [open])

  return (
    <div ref={rootRef} className="box-border ms-auto lg:ms-0 w-fit shrink-0 h-fit">
      <button
        {...buttonProps}
        onClick={toggle}
        aria-label={nav('unread', { label: nav('notifications'), count: unreadCount })}
        className={`box-border w-[44px] shrink-0 h-[44px] lg:w-[40px] lg:h-[40px] block rounded-[999px] relative cursor-pointer ${open ? 'bg-[#F3FAFF]' : ''} ${OUTLINE_HOVER} ${PRESS} ${FOCUS_RING}`}
      >
        <Icon name="bell" fill="#0B3B5C" className="box-border w-[22px] h-[22px] absolute left-[11px] top-[11px] lg:left-[9px] lg:top-[9px] [z-index:0]" />
        {unreadCount > 0 && (
          <span className="box-border min-w-[18px] h-[18px] p-[0px_4px] absolute left-[24px] top-[4px] lg:left-[22px] lg:top-[2px] flex flex-row gap-0 justify-center items-center bg-[#C23B35] [outline:2px_solid_#FFFFFF] [outline-offset:-1px] rounded-[999px] [z-index:1]">
            <span className="text-[11px]/[normal] box-border text-[#FFFFFF] font-inter font-bold text-left [white-space:nowrap] tabular-nums">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </span>
        )}
      </button>
      <div
        {...panelProps}
        ref={panelRef}
        role="dialog"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="box-border h-fit absolute left-[16px] right-[16px] sm:left-[24px] sm:right-[24px] top-[calc(100%+8px)] lg:left-auto lg:right-[32px] lg:w-[400px] flex flex-col gap-0 justify-start items-stretch bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[16px] [box-shadow:0px_12px_32px_0px_#0B3B5C29] overflow-hidden [z-index:30] focus-visible:outline-hidden motion-safe:animate-fade-in"
      >
        <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] p-[16px_20px_12px_20px] justify-start items-center [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#E2E8F0]">
          <h2 id={titleId} className="text-[16px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">
            {t('title')}
          </h2>
        </div>
        {items.length > 0 ? (
          <ul className="box-border w-full max-h-[min(480px,calc(100dvh_-_160px))] overflow-y-auto overscroll-contain flex flex-col gap-0 p-[4px_0px]">
            {items.map((item) => (
              <NotificationRow
                key={item.id}
                item={item}
                unread={item.at > (freshSince ?? Infinity)}
                unreadLabel={t('unread')}
                onNavigate={() => setOpen(false)}
              />
            ))}
          </ul>
        ) : (
          <EmptyState
            icon="bell"
            title={t('emptyTitle')}
            description={t(role === 'nelayan' ? 'emptyNelayan' : 'emptyPembeli')}
            // With nothing to show, point at what produces notifications in the first place.
            action={
              role === 'nelayan'
                ? { href: '/nelayan/catat', label: t('emptyActionNelayan') }
                : { href: '/marketplace', label: t('emptyActionPembeli') }
            }
            actionIcon={role === 'nelayan' ? 'plus' : 'store'}
          />
        )}
      </div>
    </div>
  )
}

function NotificationRow({
  item,
  unread,
  unreadLabel,
  onNavigate,
}: {
  item: NotificationEntry
  unread: boolean
  unreadLabel: string
  onNavigate: () => void
}) {
  const tone = TONE_STYLES[item.tone]
  return (
    <li className="box-border w-full h-fit shrink-0">
      <Link
        href={item.href}
        onClick={onNavigate}
        className={`box-border w-full h-fit flex flex-row gap-[12px] p-[12px_20px] justify-start items-start ${unread ? 'bg-[#F3FAFF]' : ''} hover:bg-[#EAF4FC] transition-colors duration-150 ease-out ${FOCUS_RING}`}
      >
        <span className={`box-border w-[36px] shrink-0 h-[36px] flex flex-row gap-0 justify-center items-center ${tone.circle} rounded-[999px]`}>
          <Icon name={item.icon} fill={tone.fill} className="box-border w-[18px] shrink-0 h-[18px]" />
        </span>
        <span className="box-border [flex:1_1_0] min-w-0 h-fit flex flex-col gap-[3px] justify-start items-start">
          <span className="box-border w-full flex flex-row gap-[8px] justify-between items-baseline">
            <span className="text-[14px]/[20px] box-border min-w-0 text-[#0B3B5C] font-poppins font-semibold text-left">{item.title}</span>
            <span className="text-[12px]/[normal] box-border shrink-0 text-[#5B6B7C] font-inter font-normal text-right [white-space:nowrap]">
              {item.time}
            </span>
          </span>
          <span className="text-[13px]/[19px] box-border w-full text-[#5B6B7C] font-inter font-normal text-left text-pretty">
            {item.description}
          </span>
        </span>
        {unread && (
          <span className="box-border w-[8px] shrink-0 h-[8px] mt-[6px] bg-[#0F6CB8] rounded-[999px]">
            <span className="sr-only">{unreadLabel}</span>
          </span>
        )}
      </Link>
    </li>
  )
}
