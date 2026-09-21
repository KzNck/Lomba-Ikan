'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { usePopover } from '@/components/ui/use-popover'
import { SignOutItem } from '@/components/dashboard/sign-out-item'
import { LanguageOptions } from '@/components/ui/language-switcher'

type AccountMenuProps = {
  // Whose account it is, read out after "Menu akun".
  name: string
  accountHref: string
  // The header pill opens downwards; the sidebar card sits at the bottom, so its menu opens upwards.
  placement: 'below' | 'above'
  triggerClassName: string
  chevronFill: string
  // Everything in the trigger before the chevron: the avatar and the name.
  children: React.ReactNode
}

const PLACEMENT = {
  below: 'right-0 top-[calc(100%+8px)]',
  above: 'left-0 bottom-[calc(100%+8px)]',
}

// The account menu behind the header pill and the sidebar user card: "Akun" and "Bahasa", then "Keluar" under a
// divider.
// Escape closes it and returns focus to the trigger, a press outside closes it (see usePopover), and opening it
// moves focus to the first item.
export function AccountMenu({ name, accountHref, placement, triggerClassName, chevronFill, children }: AccountMenuProps) {
  const t = useTranslations('dashboard.accountMenu')
  const { open, setOpen, rootRef, buttonProps, panelProps } = usePopover()

  useEffect(() => {
    if (!open) return
    rootRef.current?.querySelector<HTMLAnchorElement>('[data-menu-first]')?.focus()
  }, [open, rootRef])

  return (
    <div ref={rootRef} className="box-border w-full h-fit relative">
      <button {...buttonProps} aria-haspopup="menu" aria-label={t('triggerLabel', { name })} className={triggerClassName}>
        {children}
        <Icon
          name="chevron-down"
          fill={chevronFill}
          className={`box-border w-[16px] shrink-0 h-[16px] transition-transform duration-200 ease-out ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        {...panelProps}
        className={`box-border w-[220px] h-fit absolute ${PLACEMENT[placement]} [box-shadow:0px_8px_24px_0px_#0B3B5C1F] flex flex-col gap-[4px] p-[6px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[12px] [z-index:30] motion-safe:animate-fade-in`}
      >
        <Link
          href={accountHref}
          data-menu-first
          onClick={() => setOpen(false)}
          className={`box-border w-full h-[40px] shrink-0 flex flex-row gap-[10px] p-[0px_12px] justify-start items-center rounded-[8px] hover:bg-[#F7F9FC] transition-colors duration-150 ease-out ${FOCUS_RING}`}
        >
          <Icon name="user" fill="#5B6B7C" className="box-border w-[16px] shrink-0 h-[16px]" />
          <span className="text-[14px]/[normal] box-border text-[#0B3B5C] font-poppins font-medium text-left [white-space:nowrap]">
            {t('account')}
          </span>
        </Link>
        {/* Remounted with the panel, so it always opens collapsed. */}
        {open && <LanguageItem />}
        <div aria-hidden="true" className="box-border w-full h-[1px] shrink-0 bg-[#E2E8F0] m-[2px_0px]" />
        <SignOutItem />
      </div>
    </div>
  )
}

// "Bahasa" with the active code on the right. It discloses the two languages right under it rather than opening a
// second popover, so the menu stays one panel for the keyboard and for the sidebar's upward placement.
function LanguageItem() {
  const t = useTranslations('common.language')
  const locale = useLocale()
  const [expanded, setExpanded] = useState(false)
  const rowRef = useRef<HTMLButtonElement>(null)
  const optionsId = useId()

  return (
    <div className="box-border w-full h-fit flex flex-col gap-[2px]">
      <button
        ref={rowRef}
        type="button"
        aria-expanded={expanded}
        aria-controls={optionsId}
        onClick={() => setExpanded((value) => !value)}
        className={`box-border w-full h-[40px] shrink-0 flex flex-row gap-[10px] p-[0px_12px] justify-start items-center rounded-[8px] cursor-pointer hover:bg-[#F7F9FC] transition-colors duration-150 ease-out ${FOCUS_RING}`}
      >
        <Icon name="globe" fill="#5B6B7C" className="box-border w-[16px] shrink-0 h-[16px]" />
        <span className="text-[14px]/[normal] box-border [flex:1_1_0] text-[#0B3B5C] font-poppins font-medium text-left [white-space:nowrap]">
          {t('label')}
        </span>
        <span className="text-[13px]/[normal] box-border text-[#5B6B7C] font-inter font-semibold text-left [white-space:nowrap]">
          {t(`codes.${locale}`)}
        </span>
        <Icon
          name="chevron-down"
          fill="#5B6B7C"
          className={`box-border w-[14px] shrink-0 h-[14px] transition-transform duration-200 ease-out ${expanded ? 'rotate-180' : ''}`}
        />
      </button>
      <div id={optionsId} hidden={!expanded} className="box-border w-full h-fit">
        <LanguageOptions
          indent
          onSwitched={() => {
            setExpanded(false)
            rowRef.current?.focus({ preventScroll: true })
          }}
        />
      </div>
    </div>
  )
}
