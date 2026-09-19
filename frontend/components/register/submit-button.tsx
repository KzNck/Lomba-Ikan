import { Icon, type IconName } from '@/components/ui/icon'
import { PRESS, PRESS_WIDE, SOLID_HOVER } from '@/components/ui/interaction'

type SubmitButtonProps = {
  label: string
  // Trailing icon, e.g. the Pembeli frame's "Lanjut →". The export trims 2px of right padding to balance it.
  icon?: IconName
  // Hug the label instead of spanning the card.
  inline?: boolean
}

export function SubmitButton({ label, icon, inline }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className={`box-border ${inline ? 'w-fit' : 'w-full'} h-fit shrink-0 [box-shadow:0px_8px_20px_0px_#168BE540] flex flex-row gap-[12px] ${icon ? 'p-[16px_26px_16px_28px]' : 'p-[16px_28px]'} justify-center items-center [background-image:linear-gradient(90deg,_#168BE5_0%,_#2FA6EC_100%)] bg-no-repeat bg-[length:100%_100%] rounded-[999px] cursor-pointer ${SOLID_HOVER} ${inline ? PRESS : PRESS_WIDE}`}
    >
      <span className="text-[16px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">
        {label}
      </span>
      {icon && <Icon name={icon} fill="#FFFFFF" className="box-border w-[18px] shrink-0 h-[18px]" />}
    </button>
  )
}
