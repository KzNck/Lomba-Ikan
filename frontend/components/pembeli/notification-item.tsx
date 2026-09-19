import Link from 'next/link'
import { Icon, type IconName } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { OUTLINE_HOVER } from '@/components/ui/interaction'

export type NotificationItemContent = {
  href: string
  icon: IconName
  title: string
  description: string
  time: string
}

// One row of "Notifikasi Terbaru". Every row but the last carries a bottom divider.
export function NotificationItem({ href, icon, title, description, time, divider }: NotificationItemContent & { divider: boolean }) {
  return (
    <li className={`box-border w-full h-fit shrink-0 ${divider ? '[border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#E2E8F0]' : ''}`}>
      <Link
        href={href}
        className={`box-border w-full h-fit flex flex-row gap-[12px] p-[12px_0px] justify-start items-center ${OUTLINE_HOVER} ${FOCUS_RING}`}
      >
        <span className="box-border w-[40px] shrink-0 h-[40px] flex flex-row gap-0 justify-center items-center bg-[#F3FAFF] rounded-[999px]">
          <Icon name={icon} fill="#0F6CB8" className="box-border w-[19px] shrink-0 h-[19px]" />
        </span>
        <span className="box-border [flex:1_1_0] h-fit flex flex-col gap-[3px] justify-start items-start">
          <span className="text-[14px]/[normal] box-border text-[#0F5C82] font-poppins font-semibold text-left [white-space:nowrap]">{title}</span>
          <span className="text-[12px]/[17px] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">{description}</span>
          <span className="text-[12px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">{time}</span>
        </span>
        <Icon name="chevron-right" fill="#94A3B8" className="box-border w-[16px] shrink-0 h-[16px]" />
      </Link>
    </li>
  )
}
