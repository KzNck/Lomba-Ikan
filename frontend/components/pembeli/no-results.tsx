import Link from 'next/link'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { OUTLINE_HOVER, PRESS } from '@/components/ui/interaction'

type NoResultsProps = {
  title: string
  body: string
  reset: { href: string; label: string }
}

// The "Tidak ada hasil" state. The export previews it at 480px wide; here it spans the results column.
export function NoResults({ title, body, reset }: NoResultsProps) {
  return (
    <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[28px_20px] sm:p-[36px_32px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[20px]">
      <div className="box-border w-[56px] h-[56px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#DCEEFB] rounded-[999px]">
        <Icon name="search-x" fill="#0F6CB8" className="box-border w-[26px] shrink-0 h-[26px]" />
      </div>
      <p className="text-[18px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">{title}</p>
      <p className="text-[14px]/[21px] box-border w-full max-w-[416px] text-[#5B6B7C] font-inter font-normal text-center">{body}</p>
      <Link
        href={reset.href}
        className={`box-border w-fit h-fit shrink-0 flex flex-row gap-[12px] p-[12px_22px] justify-center items-center bg-[#FFFFFF] [outline:1.5px_solid_#0F6CB8] [outline-offset:-0.75px] rounded-[999px] ${OUTLINE_HOVER} ${PRESS} ${FOCUS_RING}`}
      >
        <span className="text-[16px]/[normal] box-border text-[#0F6CB8] font-poppins font-semibold text-left [white-space:nowrap]">{reset.label}</span>
        <Icon name="rotate-ccw" fill="#0F6CB8" className="box-border w-[18px] shrink-0 h-[18px]" />
      </Link>
    </div>
  )
}
