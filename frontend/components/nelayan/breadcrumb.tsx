import { Icon } from '@/components/ui/icon'

export function Breadcrumb({ current }: { current: string }) {
  return (
    <nav aria-label="Breadcrumb" className="box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center">
      <Icon name="house" fill="#0B3B5C" className="box-border w-[18px] shrink-0 h-[18px]" />
      <Icon name="chevron-right" fill="#94A3B8" className="box-border w-[14px] shrink-0 h-[14px]" />
      <span aria-current="page" className="text-[14px]/[normal] box-border text-[#0B3B5C] font-inter font-medium text-left [white-space:nowrap]">
        {current}
      </span>
    </nav>
  )
}
