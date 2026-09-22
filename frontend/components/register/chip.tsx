import { Icon } from '@/components/ui/icon'

// States from the "Chip, Tag & Combobox States" frame, driven by the visually hidden checkbox inside each chip.
// Focus drops the grey border to transparent (not none, as exported) so the chip doesn't shift by 1px.
const CHIP_STATES =
  'bg-[#FFFFFF] [border:1px_solid_#7F8FA4] not-has-checked:hover:bg-[#F3FAFF] not-has-checked:hover:[border:1px_solid_#168BE5] has-checked:bg-[#0F6CB8] has-checked:[border:1px_solid_#0F6CB8] not-has-checked:has-focus-visible:[border:1px_solid_transparent] not-has-checked:has-focus-visible:[outline:3px_solid_#0F6CB8] has-checked:has-focus-visible:[outline:2px_solid_#0F6CB8] has-checked:has-focus-visible:[outline-offset:3px]'

type ChipProps = {
  // Checkbox name; chips that share it submit as one multi-value field.
  name: string
  value: string
  label: string
  // Starts selected, e.g. a saved choice in an edit form.
  defaultChecked?: boolean
}

// A toggle chip. Selection is plain checkbox state, so it needs no React state.
export function Chip({ name, value, label, defaultChecked }: ChipProps) {
  return (
    <label
      className={`group box-border w-fit shrink-0 h-fit min-h-[44px] lg:min-h-auto flex flex-row gap-[8px] p-[10px_16px_10px_12px] justify-start items-center ${CHIP_STATES} rounded-[999px] cursor-pointer transition-colors duration-200 ease-out`}
    >
      <input type="checkbox" name={name} value={value} defaultChecked={defaultChecked} className="sr-only" />
      <Icon
        name="plus"
        fill="currentColor"
        className="box-border w-[16px] shrink-0 h-[16px] text-[#5B6B7C] group-hover:text-[#0F6CB8] group-has-checked:hidden"
      />
      <Icon name="check" fill="#FFFFFF" className="box-border w-[16px] shrink-0 h-[16px] hidden group-has-checked:block" />
      <span className="text-[14px]/[normal] box-border text-[#0B3B5C] group-has-checked:text-[#FFFFFF] font-inter font-medium text-left [white-space:nowrap]">
        {label}
      </span>
    </label>
  )
}
