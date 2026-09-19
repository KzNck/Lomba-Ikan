import { Icon, type IconName } from '@/components/ui/icon'

export type PhotoMethod = 'webcam' | 'upload'

type PhotoMethodToggleProps = {
  label: string
  options: { value: PhotoMethod; label: string; icon: IconName }[]
  value: PhotoMethod
  onChange: (value: PhotoMethod) => void
}

// "Metode Foto": two radios styled as segmented cards. The selected one swaps its icon for a check.
export function PhotoMethodToggle({ label, options, value, onChange }: PhotoMethodToggleProps) {
  return (
    <div role="radiogroup" aria-label={label} className="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-start items-start">
      {options.map((option) => {
        const selected = option.value === value
        return (
          <label
            key={option.value}
            className={`box-border [flex:1_1_0] h-[56px] flex flex-row gap-[10px] justify-center items-center ${selected ? 'bg-[#F3FAFF] [outline:2px_solid_#0F6CB8] [outline-offset:-1px]' : 'bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px]'} rounded-[14px] cursor-pointer has-[:focus-visible]:[box-shadow:0px_0px_0px_2px_#FFFFFF,_0px_0px_0px_4px_#0F6CB8]`}
          >
            <input
              type="radio"
              name="metode-foto"
              value={option.value}
              checked={selected}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <Icon name={selected ? 'circle-check' : option.icon} fill="#0F6CB8" className="box-border w-[20px] shrink-0 h-[20px]" />
            <span className={`text-[15px]/[normal] box-border ${selected ? 'text-[#0F6CB8]' : 'text-[#0B3B5C]'} font-inter font-semibold text-left [white-space:nowrap]`}>
              {option.label}
            </span>
          </label>
        )
      })}
    </div>
  )
}
