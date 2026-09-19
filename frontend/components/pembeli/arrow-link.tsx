import Link from 'next/link'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import type { NavItem } from '@/components/home/navbar'
import { ARROW_NUDGE_RIGHT } from '@/components/ui/interaction'

// "Lihat semua …" text links. The banner's link is slightly roomier than the notification footer's.
const SIZES = {
  md: { gap: 'gap-[6px]', icon: 'w-[15px] h-[15px]' },
  sm: { gap: 'gap-[4px]', icon: 'w-[14px] h-[14px]' },
}

export function ArrowLink({ href, label, size }: NavItem & { size: keyof typeof SIZES }) {
  return (
    <Link
      href={href}
      className={`group box-border w-fit shrink-0 h-fit flex flex-row ${SIZES[size].gap} justify-start items-center rounded-[4px] ${FOCUS_RING}`}
    >
      <span className="text-[13px]/[normal] box-border text-[#0F6CB8] font-poppins font-semibold text-left [white-space:nowrap]">{label}</span>
      <Icon name="arrow-right" fill="#0F6CB8" className={`box-border ${SIZES[size].icon} shrink-0 ${ARROW_NUDGE_RIGHT}`} />
    </Link>
  )
}
