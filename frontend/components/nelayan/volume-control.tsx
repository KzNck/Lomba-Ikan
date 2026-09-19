import { Icon, type IconName } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { PRESS, SOLID_HOVER } from '@/components/ui/interaction'

type VolumeControlProps = {
  value: number
  min: number
  max: number
  unit: string
  decreaseLabel: string
  increaseLabel: string
  // The "Lanjut ditekan saat berat 0 kg" state: a red ring around the control.
  invalid: boolean
  onChange: (value: number) => void
}

// The "Volume Control Wrap": −/+ buttons either side of the big weight readout. Each press moves the value by 1.
export function VolumeControl({ value, min, max, unit, decreaseLabel, increaseLabel, invalid, onChange }: VolumeControlProps) {
  return (
    <div className="box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[8px_0px] justify-center items-start">
      <div
        className={`box-border w-fit shrink-0 h-fit flex flex-row gap-[40px] p-[16px_20px] justify-start items-center bg-[#F3FAFF] ${invalid ? '[outline:2px_solid_#C23B35] [outline-offset:-1px]' : ''} rounded-[24px]`}
      >
        <RoundButton icon="minus" label={decreaseLabel} disabled={value <= min} onClick={() => onChange(value - 1)} />
        {/* The slider below carries the value for assistive tech, so the readout is visual only. */}
        <div aria-hidden="true" className="box-border w-[140px] shrink-0 h-fit flex flex-row gap-[8px] justify-center items-end">
          <span className="text-[48px]/[48px] box-border text-[#0B3B5C] font-poppins font-bold text-left [white-space:nowrap]">{value}</span>
          <span className="text-[20px]/[32px] box-border text-[#5B6B7C] font-poppins font-semibold text-left [white-space:nowrap]">{unit}</span>
        </div>
        <RoundButton icon="plus" label={increaseLabel} disabled={value >= max} onClick={() => onChange(value + 1)} />
      </div>
    </div>
  )
}

type RoundButtonProps = {
  icon: IconName
  label: string
  disabled: boolean
  onClick: () => void
}

// "Kurangi" / "Tambah". At the end of the range the button greys out, as "Kurangi" does at 0 kg in the export.
function RoundButton({ icon, label, disabled, onClick }: RoundButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`box-border w-[56px] shrink-0 h-[56px] flex flex-row gap-0 justify-center items-center ${disabled ? 'bg-[#E2E8F0] cursor-not-allowed' : `bg-[#0F6CB8] cursor-pointer ${SOLID_HOVER} ${PRESS}`} rounded-[999px] ${FOCUS_RING}`}
    >
      <Icon name={icon} fill="#FFFFFF" className="box-border w-[26px] shrink-0 h-[26px]" />
    </button>
  )
}
