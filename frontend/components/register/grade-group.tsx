import { useId } from 'react'
import { Icon, type IconName } from '@/components/ui/icon'
import { Chip } from '@/components/register/chip'
import type { SelectOption } from '@/components/register/form-field'

// Hidup is tinted green to set it apart from Mati, per the frame.
const GRADE_TONES = {
  fresh: { box: 'bg-[#E8F8F2] [border:1px_solid_#BFE6D2]', icon: '#1D8055' },
  neutral: { box: 'bg-[#F7F9FC] [border:1px_solid_#E2E8F0]', icon: '#5B6B7C' },
}

export type GradeGroupContent = {
  tone: keyof typeof GRADE_TONES
  icon: IconName
  title: string
  options: SelectOption[]
}

type GradeGroupProps = GradeGroupContent & {
  // Checkbox name, shared by every grade group so they submit as one field.
  name: string
  // Grades that start selected, e.g. the account's saved preference.
  defaultValues?: string[]
}

export function GradeGroup({ tone, icon, title, options, name, defaultValues = [] }: GradeGroupProps) {
  const titleId = useId()
  const styles = GRADE_TONES[tone]

  return (
    <div
      role="group"
      aria-labelledby={titleId}
      className={`box-border [flex:1_1_0] h-fit flex flex-col gap-[14px] p-[16px] justify-start items-start ${styles.box} rounded-[16px]`}
    >
      <div className="box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center">
        <Icon name={icon} fill={styles.icon} className="box-border w-[18px] shrink-0 h-[18px]" />
        <span
          id={titleId}
          className="text-[14px]/[normal] box-border text-[#0B3B5C] font-inter font-semibold text-left [white-space:nowrap]"
        >
          {title}
        </span>
      </div>
      <div className="box-border w-fit h-fit shrink-0 flex flex-row gap-[10px] justify-start items-start">
        {options.map((option) => (
          <Chip key={option.value} name={name} {...option} defaultChecked={defaultValues.includes(option.value)} />
        ))}
      </div>
    </div>
  )
}
