'use client'

import Link from 'next/link'
import { useId } from 'react'
import { Icon, type IconName } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { usePopover } from '@/components/ui/use-popover'

export type FilterMenuOption = {
  href: string
  label: string
  selected: boolean
}

type FilterMenuProps = {
  label: string
  icon: IconName
  options: FilterMenuOption[]
  // Which edge the list lines up with; "end" for a menu at the right of its row, so the list stays on the page.
  align?: 'start' | 'end'
}

// The labelled control from the Riwayat filters (the status filter; the sort on "Listing Saya"): the button reads
// the current choice and discloses a list of links, one per choice, so each choice is a URL.
// Escape or a click outside closes it (see usePopover).
export function FilterMenu({ label, icon, options, align = 'start' }: FilterMenuProps) {
  const { open, setOpen, rootRef, buttonProps, panelProps } = usePopover()
  const labelId = useId()
  const valueId = useId()
  const current = options.find((option) => option.selected) ?? options[0]

  return (
    <div ref={rootRef} className="box-border w-[190px] shrink-0 h-fit flex flex-col gap-[6px] justify-start items-start relative">
      <span id={labelId} className="text-[12px]/[normal] box-border text-[#5B6B7C] font-inter font-medium text-left [white-space:nowrap]">
        {label}
      </span>
      <button
        {...buttonProps}
        aria-labelledby={`${labelId} ${valueId}`}
        className={`box-border w-full h-[46px] shrink-0 flex flex-row gap-[10px] p-[0px_14px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#7F8FA4] [outline-offset:-0.5px] rounded-[12px] cursor-pointer transition-colors duration-200 ease-out hover:bg-[#F3FAFF] ${FOCUS_RING}`}
      >
        <Icon name={icon} fill="#5B6B7C" className="box-border w-[18px] shrink-0 h-[18px]" />
        <span id={valueId} className="text-[14px]/[normal] box-border [flex:1_1_0] min-w-0 text-[#0B3B5C] font-inter font-medium text-left">
          {current.label}
        </span>
        <Icon
          name="chevron-down"
          fill="#5B6B7C"
          className={`box-border w-[18px] shrink-0 h-[18px] transition-transform duration-200 ease-out ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <ul
        {...panelProps}
        className={`box-border w-[220px] h-fit absolute ${align === 'end' ? 'right-0' : 'left-0'} top-[calc(100%+8px)] [box-shadow:0px_8px_24px_0px_#0B3B5C1F] flex flex-col gap-0 p-[6px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[12px] [z-index:20] motion-safe:animate-fade-in`}
      >
        {options.map(({ href, label, selected }) => (
          <li key={href} className="box-border w-full">
            <Link
              href={href}
              scroll={false}
              aria-current={selected ? 'true' : undefined}
              onClick={() => setOpen(false)}
              className={`box-border w-full h-[40px] shrink-0 flex flex-row gap-[8px] p-[0px_12px] justify-between items-center ${selected ? 'bg-[#F3FAFF]' : 'bg-[#00000000] hover:bg-[#F7F9FC]'} rounded-[8px] ${FOCUS_RING}`}
            >
              <span
                className={`text-[14px]/[normal] box-border ${selected ? 'text-[#0F6CB8] font-semibold' : 'text-[#0B3B5C] font-medium'} font-inter text-left [white-space:nowrap]`}
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
