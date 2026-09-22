'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Logo } from '@/components/ui/logo'
import { PillLink } from '@/components/ui/pill-link'
import { Icon } from '@/components/ui/icon'
import { NavLink, NavLinks } from '@/components/home/nav-links'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { OUTLINE_HOVER, PRESS } from '@/components/ui/interaction'

export type NavItem = {
  href: string
  label: string
}

type NavbarProps = {
  items: NavItem[]
  // Omit on pages without landing sections: links render statically with none active.
  activeHref?: string
  login: NavItem
  register: NavItem
}

const MENU_ID = 'navbar-menu'

// Three columns with equal outer tracks, so the section links stay centred on the page however wide the logo and the
// right-hand group (language switcher plus the two buttons) are. Below lg the links and buttons fold into a panel under
// the bar, opened by the menu button; at lg the panel is `display: contents`, so its children are the grid's columns.
export function Navbar({ items, activeHref, login, register }: NavbarProps) {
  const t = useTranslations('nav.menu')
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    // Focus goes back to the button, since the link it was on disappears with the panel.
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      buttonRef.current?.focus()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header className="box-border w-full h-[80px] shrink-0 sticky top-0 z-50 flex flex-row justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] gap-[24px] px-frame items-center bg-[#FFFFFF] [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#E2E8F0]">
      <Logo tone="dark" />
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={MENU_ID}
        aria-label={open ? t('close') : t('open')}
        onClick={() => setOpen(!open)}
        className={`lg:hidden box-border w-[44px] shrink-0 h-[44px] flex justify-center items-center rounded-[999px] cursor-pointer ${OUTLINE_HOVER} ${PRESS} ${FOCUS_RING}`}
      >
        {open ? (
          <Icon name="x" fill="#0B3B5C" className="box-border w-[24px] h-[24px]" />
        ) : (
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="#0B3B5C" strokeWidth="2" strokeLinecap="round" className="w-[24px] h-[24px]">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
      <div
        id={MENU_ID}
        // A tapped section link scrolls the page, so the panel gets out of the way.
        onClick={(e) => (e.target as Element).closest('a') && setOpen(false)}
        className={`${open ? 'flex' : 'hidden'} lg:contents absolute left-0 right-0 top-full flex-col gap-[16px] p-[8px_16px_20px] sm:px-[24px] bg-[#FFFFFF] [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#E2E8F0] shadow-[0px_8px_24px_0px_#0B3B5C1F]`}
      >
        <nav className="box-border w-fit shrink-0 h-fit flex flex-col items-start lg:flex-row gap-[4px] lg:gap-[40px] justify-start lg:items-center [&>a]:min-h-[44px] [&>a]:min-w-[44px] [&>a]:justify-center [&>a]:items-start lg:[&>a]:min-h-auto lg:[&>a]:min-w-auto lg:[&>a]:justify-start lg:[&>a]:items-center">
          {activeHref ? (
            <NavLinks items={items} initialHref={activeHref} />
          ) : (
            items.map((item) => <NavLink key={item.href} {...item} active={false} />)
          )}
        </nav>
        {/* Below lg: the two buttons share the row equally, and the language switcher sits centred under them (where its
            right-aligned options still open on screen), all under a divider that separates them from the links. */}
        <div className="box-border w-full lg:w-fit shrink-0 h-fit justify-self-end grid grid-cols-2 lg:flex lg:flex-row lg:flex-nowrap gap-[12px] pt-[16px] lg:pt-0 [border-width:1px_0px_0px_0px] lg:[border-width:0px] [border-style:solid] [border-color:#E2E8F0] [&>a]:w-full lg:[&>a]:w-fit justify-start items-center">
          <div className="order-last col-span-2 justify-self-center lg:contents">
            <LanguageSwitcher />
          </div>
          <PillLink href={login.href} label={login.label} variant="outline" size="md" className="min-h-[44px] lg:min-h-auto" />
          <PillLink href={register.href} label={register.label} variant="primary" size="md" className="min-h-[44px] lg:min-h-auto" />
        </div>
      </div>
    </header>
  )
}
