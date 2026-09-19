import Link from 'next/link'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { PRESS_WIDE, SOLID_HOVER } from '@/components/ui/interaction'

type QuickActionCardProps = {
  href: string
  label: string
  caption: string
  offlineNote: string
}

export function QuickActionCard({ href, label, caption, offlineNote }: QuickActionCardProps) {
  return (
    <div
      className="box-border w-[320px] shrink-0 self-stretch flex flex-col gap-[12px] p-[12px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[20px] motion-safe:animate-fade-up"
      style={{ animationDelay: '240ms' }}
    >
      <Link
        href={href}
        className={`box-border w-full h-fit shrink-0 [box-shadow:0px_6px_16px_0px_#0F5C8240] flex flex-col gap-[4px] p-[18px_20px] justify-start items-center [background-image:linear-gradient(90deg,_#0F5C82_0%,_#0F6CB8_100%)] bg-no-repeat bg-[length:100%_100%] rounded-[8px] ${SOLID_HOVER} ${PRESS_WIDE} ${FOCUS_RING}`}
      >
        <span className="box-border w-fit h-fit shrink-0 flex flex-row gap-[10px] justify-start items-center">
          <Icon name="plus" fill="#FFFFFF" className="box-border w-[24px] shrink-0 h-[24px]" />
          <span className="text-[18px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">{label}</span>
        </span>
        <span className="text-[12px]/[normal] box-border text-[#E3F0F9] font-inter font-normal text-left [white-space:nowrap]">{caption}</span>
      </Link>
      <div className="box-border w-full [flex:1_1_0] flex flex-row gap-[16px] p-[16px_18px] justify-start items-center bg-[#F3FAFF] rounded-[8px]">
        <div className="box-border w-[64px] shrink-0 h-[64px] flex flex-row gap-0 justify-center items-center bg-[#DCEEFB] rounded-[16px]">
          <Icon name="clipboard-check" fill="#0F6CB8" className="box-border w-[32px] shrink-0 h-[32px]" />
        </div>
        <p className="text-[13px]/[21px] box-border [flex:1_1_0] text-[#5B6B7C] font-inter font-normal text-left">{offlineNote}</p>
      </div>
    </div>
  )
}
