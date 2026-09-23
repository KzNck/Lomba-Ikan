'use client'

import Link from 'next/link'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { OUTLINE_HOVER } from '@/components/ui/interaction'
import { usePopover } from '@/components/ui/use-popover'

export type SortMenuOption = {
  href: string
  label: string
  selected: boolean
}

type SortMenuProps = {
  label: string
  options: SortMenuOption[]
}

// "Sort" and its "Sort Menu". The button discloses a list of links, one per order, so each order is a URL (?urut=)
// that keeps the search and filters. Escape or a click outside closes it (see usePopover).
export function SortMenu({ label, options }: SortMenuProps) {
  const { open, setOpen, rootRef, buttonProps, panelProps } = usePopover()

  return (
    <div ref={rootRef} className="box-border order-2 lg:order-none w-full lg:w-fit shrink-0 h-fit relative">
      <button
        {...buttonProps}
        // Full width below lg, with the chevron at the far end, under the full-width search box.
        className={`box-border w-full lg:w-fit shrink-0 h-[48px] flex flex-row gap-[8px] p-[0px_14px] justify-start items-center [&>svg:last-child]:ms-auto lg:[&>svg:last-child]:ms-0 bg-[#FFFFFF] [outline:1px_solid_#7F8FA4] [outline-offset:-0.5px] rounded-[12px] cursor-pointer transition-colors duration-200 ease-out ${OUTLINE_HOVER} ${FOCUS_RING}`}
      >
        <Icon name="arrow-up-down" fill="#0B3B5C" className="box-border w-[18px] shrink-0 h-[18px]" />
        <span className="text-[14px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">{label}</span>
        <Icon
          name="chevron-down"
          fill="#5B6B7C"
          className={`box-border w-[16px] shrink-0 h-[16px] motion-safe:transition-transform duration-200 ease-out ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <ul
        {...panelProps}
        className="box-border w-[220px] h-fit absolute left-0 top-[calc(100%+8px)] [box-shadow:0px_8px_24px_0px_#0B3B5C1F] flex flex-col gap-0 p-[6px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[12px] [z-index:20] motion-safe:animate-fade-in"
      >
        {options.map(({ href, label, selected }) => (
          <li key={href} className="box-border w-full">
            <Link
              href={href}
              scroll={false}
              aria-current={selected ? 'true' : undefined}
              onClick={() => setOpen(false)}
              className={`box-border w-full h-[44px] lg:h-[40px] shrink-0 flex flex-row gap-[8px] p-[0px_12px] justify-between items-center ${selected ? 'bg-[#F3FAFF]' : 'bg-[#00000000] hover:bg-[#F7F9FC]'} rounded-[8px] ${FOCUS_RING}`}
            >
              <span
                className={`text-[14px]/[normal] box-border ${selected ? 'text-[#0F6CB8] font-semibold' : 'text-[#0B3B5C] font-medium'} font-poppins text-left [white-space:nowrap]`}
              >
                {label}
              </span>
              {selected && <Icon name="check" fill="#0F6CB8" className="box-border w-[16px] shrink-0 h-[16px]" />}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
