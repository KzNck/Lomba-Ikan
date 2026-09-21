import { Icon, type IconName } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { OUTLINE_HOVER, PRESS, SOLID_HOVER } from '@/components/ui/interaction'

// The 40px pill buttons inside the photo step: solid = the Photo Area "Button" ("Nyalakan webcam", "Coba lagi"),
// outline = "Ambil ulang" on the preview.
const VARIANTS = {
  solid: {
    button: `p-[0px_18px] bg-[#0F6CB8] ${SOLID_HOVER}`,
    fill: '#FFFFFF',
    label: 'text-[#FFFFFF]',
  },
  outline: {
    // White-filled, so it stays legible laid over the photo.
    button: `p-[0px_16px] bg-[#FFFFFF] [outline:1.5px_solid_#0F6CB8] [outline-offset:-0.75px] ${OUTLINE_HOVER}`,
    fill: '#0F6CB8',
    label: 'text-[#0F6CB8]',
  },
}

type PillButtonProps = {
  variant: keyof typeof VARIANTS
  icon: IconName
  label: string
  onClick: () => void
  // Set while the webcam is starting, so a second press doesn't request it twice.
  disabled?: boolean
}

export function PillButton({ variant, icon, label, onClick, disabled }: PillButtonProps) {
  const style = VARIANTS[variant]
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`box-border w-fit h-[40px] shrink-0 flex flex-row gap-[8px] ${style.button} justify-start items-center rounded-[999px] cursor-pointer disabled:cursor-wait disabled:opacity-60 ${PRESS} ${FOCUS_RING}`}
    >
      <Icon name={icon} fill={style.fill} className="box-border w-[16px] shrink-0 h-[16px]" />
      <span className={`text-[14px]/[normal] box-border ${style.label} font-inter font-semibold text-left [white-space:nowrap]`}>{label}</span>
    </button>
  )
}
