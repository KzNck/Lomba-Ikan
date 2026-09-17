import { Logo } from '@/components/ui/logo'
import { PillLink } from '@/components/ui/pill-link'
import { NavLinks } from '@/components/home/nav-links'

export type NavItem = {
  href: string
  label: string
}

type NavbarProps = {
  items: NavItem[]
  activeHref: string
  login: NavItem
  register: NavItem
}

export function Navbar({ items, activeHref, login, register }: NavbarProps) {
  return (
    <header className="box-border w-full h-[80px] shrink-0 sticky top-0 z-50 flex flex-row gap-0 p-[0px_120px] justify-between items-center bg-[#FFFFFF] [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#E2E8F0]">
      <Logo tone="dark" />
      <nav className="box-border w-fit shrink-0 h-fit flex flex-row gap-[40px] justify-start items-center">
        <NavLinks items={items} initialHref={activeHref} />
      </nav>
      <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-[12px] justify-start items-center">
        <PillLink href={login.href} label={login.label} variant="outline" size="md" />
        <PillLink href={register.href} label={register.label} variant="primary" size="md" />
      </div>
    </header>
  )
}
