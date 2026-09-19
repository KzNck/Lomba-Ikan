import { useId } from 'react'
import { Icon } from '@/components/ui/icon'
import { Chip } from '@/components/register/chip'
import type { SelectOption } from '@/components/register/form-field'

export type ChipGroupContent = {
  // Also used as each checkbox's name.
  id: string
  label: string
  helper: string
  required?: boolean
  options: SelectOption[]
}

type ChipGroupProps = ChipGroupContent & {
  // Shown under the helper, e.g. when a required group is submitted empty.
  error?: string
  // Values that start selected.
  defaultValues?: string[]
  look?: keyof typeof LOOKS
}

// Registration's group, or the account page's: Poppins label, wrapping helper, tighter gaps.
const LOOKS = {
  register: { group: 'gap-[16px]', label: 'font-inter', helper: '[white-space:nowrap]', chips: 'gap-[12px]' },
  settings: { group: 'gap-[12px]', label: 'font-poppins', helper: 'w-full', chips: 'gap-[10px]' },
}

// A labelled multi-select of toggle chips.
export function ChipGroup({ id, label, helper, required, options, error, defaultValues = [], look = 'register' }: ChipGroupProps) {
  const style = LOOKS[look]
  const labelId = useId()
  const helperId = useId()
  const errorId = useId()

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      aria-describedby={error ? `${helperId} ${errorId}` : helperId}
      className={`box-border w-full h-fit shrink-0 flex flex-col ${style.group} justify-start items-start`}
    >
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start">
        <div className="box-border w-fit h-fit shrink-0 flex flex-row gap-[4px] justify-start items-start">
          <span
            id={labelId}
            className={`text-[15px]/[normal] box-border text-[#0B3B5C] ${style.label} font-semibold text-left [white-space:nowrap]`}
          >
            {label}
          </span>
          {required && (
            <span
              aria-hidden="true"
              className={`text-[15px]/[normal] box-border text-[#C23B35] ${style.label} font-semibold text-left [white-space:nowrap]`}
            >
              *
            </span>
          )}
        </div>
        <p
          id={helperId}
          className={`text-[14px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left ${style.helper}`}
        >
          {helper}
        </p>
        {/* From the "Error — grup wajib" state. */}
        {error && (
          <div className="box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] p-[4px_0px_0px_0px] justify-start items-center">
            <Icon name="circle-alert" fill="#C23B35" className="box-border w-[16px] shrink-0 h-[16px]" />
            <p
              id={errorId}
              className="text-[14px]/[normal] box-border text-[#C23B35] font-inter font-medium text-left [white-space:nowrap]"
            >
              {error}
            </p>
          </div>
        )}
      </div>
      {/* The export splits the chips into two hand-made rows; wrapping at the same 12px gap lands on the same break. */}
      <div className={`box-border w-full h-fit shrink-0 flex flex-row flex-wrap ${style.chips} justify-start items-start`}>
        {options.map((option) => (
          <Chip key={option.value} name={id} {...option} defaultChecked={defaultValues.includes(option.value)} />
        ))}
      </div>
    </div>
  )
}
