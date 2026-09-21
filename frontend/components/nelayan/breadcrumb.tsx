import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import type { NavItem } from '@/components/home/navbar'

export type BreadcrumbContent = {
  // Pages above the current one, e.g. "Dashboard" while the "Tambah Tangkapan" modal is open.
  trail?: NavItem[]
  current: string
}

export function Breadcrumb({ trail = [], current }: BreadcrumbContent) {
  const t = useTranslations('dashboard')
  return (
    <nav aria-label={t('breadcrumbLabel')} className="box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center">
      <Icon name="house" fill="#0B3B5C" className="box-border w-[18px] shrink-0 h-[18px]" />
      {trail.map(({ href, label }) => (
        <Separated key={href}>
          <Link
            href={href}
            className={`text-[14px]/[normal] box-border text-[#5B6B7C] hover:text-[#0B3B5C] font-inter font-normal text-left [white-space:nowrap] rounded-[4px] ${FOCUS_RING}`}
          >
            {label}
          </Link>
        </Separated>
      ))}
      <Separated>
        <span aria-current="page" className="text-[14px]/[normal] box-border text-[#0B3B5C] font-inter font-medium text-left [white-space:nowrap]">
          {current}
        </span>
      </Separated>
    </nav>
  )
}

function Separated({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Icon name="chevron-right" fill="#94A3B8" className="box-border w-[14px] shrink-0 h-[14px]" />
      {children}
    </>
  )
}
