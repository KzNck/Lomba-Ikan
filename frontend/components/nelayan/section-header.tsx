import Link from 'next/link'
import { Icon, type IconName } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import type { NavItem } from '@/components/home/navbar'
import { ARROW_NUDGE_RIGHT } from '@/components/ui/interaction'

type SectionHeaderProps = {
  icon: IconName
  title: string
  // Right-aligned "Lihat semua" link; the notification card puts its link in the footer instead.
  link?: NavItem
}

export function SectionHeader({ icon, title, link }: SectionHeaderProps) {
  return (
    <div className="box-border w-full h-fit shrink-0 flex flex-row flex-wrap lg:flex-nowrap gap-x-[12px] lg:gap-0 justify-between items-center">
      <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-[12px] justify-start items-center">
        <Icon name={icon} fill="#0B3B5C" className="box-border w-[22px] shrink-0 h-[22px]" />
        <h2 className="text-[18px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">{title}</h2>
      </div>
      {link && <ViewAllLink {...link} />}
    </div>
  )
}

export function ViewAllLink({ href, label, className = '' }: NavItem & { className?: string }) {
  return (
    <Link
      href={href}
      className={`group box-border w-fit shrink-0 h-fit min-h-[44px] lg:min-h-auto flex flex-row gap-[6px] justify-start items-center rounded-[4px] ${FOCUS_RING} ${className}`}
    >
      <span className="text-[13px]/[normal] box-border text-[#0F6CB8] font-inter font-semibold text-left [white-space:nowrap]">{label}</span>
      <Icon name="arrow-right" fill="#0F6CB8" className={`box-border w-[16px] shrink-0 h-[16px] ${ARROW_NUDGE_RIGHT}`} />
    </Link>
  )
}
