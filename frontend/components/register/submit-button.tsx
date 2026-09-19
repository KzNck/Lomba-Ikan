import { Icon, type IconName } from '@/components/ui/icon'
import { PRESS, PRESS_WIDE, SOLID_HOVER } from '@/components/ui/interaction'

// bright = the registration and catch-wizard buttons; deep = the "Hasil Kesegaran" modal's "Pasang ke listing".
const TONES = {
  bright: '[box-shadow:0px_8px_20px_0px_#168BE540] [background-image:linear-gradient(90deg,_#168BE5_0%,_#2FA6EC_100%)]',
  deep: '[box-shadow:0px_8px_20px_0px_#0F6CB840] [background-image:linear-gradient(90deg,_#0F6CB8_0%,_#0F5C82_100%)]',
}

type SubmitButtonProps = {
  label: string
  // Trailing icon, e.g. the Pembeli frame's "Lanjut →". The export trims 2px of right padding to balance it.
  icon?: IconName
  // Hug the label instead of spanning the card.
  inline?: boolean
  tone?: keyof typeof TONES
}

export function SubmitButton({ label, icon, inline, tone = 'bright' }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className={`box-border ${inline ? 'w-fit' : 'w-full'} h-fit shrink-0 ${TONES[tone]} flex flex-row gap-[12px] ${icon ? 'p-[16px_26px_16px_28px]' : 'p-[16px_28px]'} justify-center items-center bg-no-repeat bg-[length:100%_100%] rounded-[999px] cursor-pointer ${SOLID_HOVER} ${inline ? PRESS : PRESS_WIDE}`}
    >
      <span className="text-[16px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">
        {label}
      </span>
      {icon && <Icon name={icon} fill="#FFFFFF" className="box-border w-[18px] shrink-0 h-[18px]" />}
    </button>
  )
}
