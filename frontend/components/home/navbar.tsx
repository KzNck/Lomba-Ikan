import { Logo } from '@/components/ui/logo'
import { PillLink } from '@/components/ui/pill-link'
import { NavLink, NavLinks } from '@/components/home/nav-links'
import { LanguageSwitcher } from '@/components/ui/language-switcher'

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

// Three columns with equal outer tracks, so the section links stay centred on the page however wide the logo and the
// right-hand group (language switcher plus the two buttons) are.
export function Navbar({ items, activeHref, login, register }: NavbarProps) {
  return (
    <header className="box-border w-full h-[80px] shrink-0 sticky top-0 z-50 grid grid-cols-[1fr_auto_1fr] gap-[24px] px-frame items-center bg-[#FFFFFF] [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#E2E8F0]">
      <Logo tone="dark" />
      <nav className="box-border w-fit shrink-0 h-fit flex flex-row gap-[40px] justify-start items-center">
        {activeHref ? (
          <NavLinks items={items} initialHref={activeHref} />
        ) : (
          items.map((item) => <NavLink key={item.href} {...item} active={false} />)
        )}
      </nav>
      <div className="box-border w-fit shrink-0 h-fit justify-self-end flex flex-row gap-[12px] justify-start items-center">
        <LanguageSwitcher />
        <PillLink href={login.href} label={login.label} variant="outline" size="md" />
        <PillLink href={register.href} label={register.label} variant="primary" size="md" />
      </div>
    </header>
  )
}
