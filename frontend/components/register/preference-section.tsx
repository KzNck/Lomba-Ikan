import { useId } from 'react'
import { Icon, type IconName } from '@/components/ui/icon'

export type PreferenceSectionHeader = {
  icon: IconName
  label: string
  helper: string
}

type PreferenceSectionProps = PreferenceSectionHeader & {
  children: React.ReactNode
}

// An icon-led block of the Preferensi Pencarian card: label and helper, then the section's controls.
export function PreferenceSection({ icon, label, helper, children }: PreferenceSectionProps) {
  const labelId = useId()
  const helperId = useId()

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      aria-describedby={helperId}
      className="box-border w-full h-fit shrink-0 flex flex-row gap-[16px] justify-start items-start"
    >
      <div className="box-border w-[44px] shrink-0 h-[44px] flex flex-row gap-0 justify-center items-center bg-[#DCEEFB] rounded-[999px]">
        <Icon name={icon} fill="#0F6CB8" className="box-border w-[22px] shrink-0 h-[22px]" />
      </div>
      <div className="box-border [flex:1_1_0] h-fit flex flex-col gap-[16px] justify-start items-start">
        <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start">
          <span
            id={labelId}
            className="text-[15px]/[normal] box-border text-[#0B3B5C] font-inter font-semibold text-left [white-space:nowrap]"
          >
            {label}
          </span>
          <p id={helperId} className="text-[14px]/[21px] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">
            {helper}
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
