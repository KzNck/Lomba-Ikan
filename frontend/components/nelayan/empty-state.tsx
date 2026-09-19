import Link from 'next/link'
import { Icon, type IconName } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import type { NavItem } from '@/components/home/navbar'
import { PRESS, SOLID_HOVER } from '@/components/ui/interaction'

type EmptyStateProps = {
  icon: IconName
  title: string
  description: string
  action?: NavItem
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[24px_16px] justify-start items-center">
      <div className="box-border w-[56px] h-[56px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#DCEEFB] rounded-[999px]">
        <Icon name={icon} fill="#0F6CB8" className="box-border w-[26px] shrink-0 h-[26px]" />
      </div>
      <p className="text-[16px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">{title}</p>
      <p className="text-[14px]/[21px] box-border w-full text-[#5B6B7C] font-inter font-normal text-center">{description}</p>
      {action && (
        <Link
          href={action.href}
          className={`box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] p-[10px_18px] justify-start items-center bg-[#0F6CB8] rounded-[8px] ${SOLID_HOVER} ${PRESS} ${FOCUS_RING}`}
        >
          <Icon name="plus" fill="#FFFFFF" className="box-border w-[18px] shrink-0 h-[18px]" />
          <span className="text-[14px]/[normal] box-border text-[#FFFFFF] font-inter font-semibold text-left [white-space:nowrap]">{action.label}</span>
        </Link>
      )}
    </div>
  )
}
