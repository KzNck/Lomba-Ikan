import Link from 'next/link'
import { Icon } from '@/components/ui/icon'
import { OUTLINE_HOVER, PRESS, SOLID_HOVER } from '@/components/ui/interaction'

const VARIANTS = {
  primary: {
    container:
      '[background-image:linear-gradient(90deg,_#168BE5_0%,_#2FA6EC_100%)] bg-no-repeat bg-[length:100%_100%] ' + SOLID_HOVER,
    label: 'text-[#FFFFFF]',
    iconFill: '#FFFFFF',
  },
  outline: {
    container: `bg-[#FFFFFF] [outline:1.5px_solid_#168BE5] [outline-offset:-0.75px] ${OUTLINE_HOVER}`,
    label: 'text-[#168BE5]',
    iconFill: '#168BE5',
  },
}

// The outline variant is 1px tighter so both variants render at the same height.
const SIZES = {
  md: {
    padding: { primary: 'p-[12px_30px]', outline: 'p-[11px_28px]' },
    label: 'text-[15px]/[normal]',
  },
  lg: {
    padding: { primary: 'p-[16px_26px_16px_28px]', outline: 'p-[15px_26px_15px_28px]' },
    label: 'text-[16px]/[normal]',
  },
}

type PillLinkProps = {
  href: string
  label: string
  variant: keyof typeof VARIANTS
  size: keyof typeof SIZES
  withArrow?: boolean
  className?: string
}

export function PillLink({ href, label, variant, size, withArrow = false, className = '' }: PillLinkProps) {
  const v = VARIANTS[variant]
  const s = SIZES[size]

  return (
    <Link
      href={href}
      className={`box-border w-fit shrink-0 h-fit flex flex-row gap-[12px] ${s.padding[variant]} justify-center items-center ${v.container} rounded-[999px] ${PRESS} ${className}`}
    >
      <span className={`${s.label} box-border ${v.label} font-poppins font-semibold text-left [white-space:nowrap]`}>
        {label}
      </span>
      {withArrow && (
        <Icon name="arrow-right" fill={v.iconFill} className="box-border w-[18px] shrink-0 h-[18px]" />
      )}
    </Link>
  )
}
