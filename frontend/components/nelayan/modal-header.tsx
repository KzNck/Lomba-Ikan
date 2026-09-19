import Link from 'next/link'
import { Icon, type IconName } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { PRESS } from '@/components/ui/interaction'

type ModalHeaderProps = {
  icon: IconName
  title: string
  // Referenced by the dialog's aria-labelledby.
  titleId: string
  subtitle: string
  closeHref: string
  closeLabel: string
  // "Tambah Tangkapan" top-aligns the row; "Hasil Kesegaran" centres it.
  align: 'start' | 'center'
}

// Icon badge, title and subtitle, and the round close button along the top of the nelayan modals.
export function ModalHeader({ icon, title, titleId, subtitle, closeHref, closeLabel, align }: ModalHeaderProps) {
  return (
    <div className={`box-border w-full h-fit shrink-0 flex flex-row gap-[16px] justify-start ${align === 'start' ? 'items-start' : 'items-center'}`}>
      <div className="box-border w-[48px] shrink-0 h-[48px] flex flex-row gap-0 justify-center items-center bg-[#DCEEFB] rounded-[999px]">
        <Icon name={icon} fill="#0F6CB8" className="box-border w-[24px] shrink-0 h-[24px]" />
      </div>
      <div className="box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] justify-start items-start">
        <h2 id={titleId} className="text-[22px]/[26px] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">
          {title}
        </h2>
        <p className="text-[14px]/[normal] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">{subtitle}</p>
      </div>
      <Link
        href={closeHref}
        aria-label={closeLabel}
        className={`box-border w-[40px] shrink-0 h-[40px] flex flex-row gap-0 justify-center items-center bg-[#F7F9FC] hover:bg-[#E3F0F9] rounded-[999px] ${PRESS} ${FOCUS_RING}`}
      >
        <Icon name="x" fill="#0B3B5C" className="box-border w-[20px] shrink-0 h-[20px]" />
      </Link>
    </div>
  )
}
