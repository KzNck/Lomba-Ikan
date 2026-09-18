import Link from 'next/link'
import { Icon } from '@/components/ui/icon'
import type { NavItem } from '@/components/home/navbar'

// "← Kembali ke Beranda" above the login card.
export function BackLink({ href, label }: NavItem) {
  return (
    <Link href={href} className="box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] p-[8px_4px] justify-start items-center">
      <Icon name="arrow-left" fill="#0F6CB8" className="box-border w-[18px] shrink-0 h-[18px]" />
      <span className="text-[15px]/[normal] box-border text-[#0F6CB8] font-inter font-semibold text-left [white-space:nowrap]">
        {label}
      </span>
    </Link>
  )
}
