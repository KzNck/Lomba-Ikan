import Link from 'next/link'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import type { NavItem } from '@/components/home/navbar'
import { PRESS, SOLID_HOVER } from '@/components/ui/interaction'

type ListingPageHeadProps = {
  title: string
  subtitle: string
  action: NavItem
}

// The page title and subtitle, with the "Tambah Tangkapan" pill bottom-aligned beside them.
export function ListingPageHead({ title, subtitle, action }: ListingPageHeadProps) {
  return (
    <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[24px] justify-start items-end">
      <div className="box-border [flex:1_1_0] h-fit flex flex-col gap-[6px] justify-start items-start">
        <h2 className="text-[28px]/[32px] box-border text-[#0B3B5C] font-poppins font-bold text-left [white-space:nowrap]">{title}</h2>
        <p className="text-[15px]/[normal] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">{subtitle}</p>
      </div>
      <Link
        href={action.href}
        className={`box-border w-fit shrink-0 h-fit [box-shadow:0px_8px_20px_0px_#0F6CB840] flex flex-row gap-[12px] p-[14px_24px_14px_22px] justify-center items-center [background-image:linear-gradient(90deg,_#0F6CB8_0%,_#0F5C82_100%)] bg-no-repeat bg-[length:100%_100%] rounded-[999px] ${SOLID_HOVER} ${PRESS} ${FOCUS_RING}`}
      >
        <span className="text-[16px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">{action.label}</span>
        <Icon name="plus" fill="#FFFFFF" className="box-border w-[18px] shrink-0 h-[18px]" />
      </Link>
    </div>
  )
}
