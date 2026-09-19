'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Form from 'next/form'
import { Icon, type IconName } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { PRESS_WIDE, SOLID_HOVER } from '@/components/ui/interaction'
import { usePopover } from '@/components/pembeli/use-popover'

export type FilterEditor = {
  // Radios pick one (grade); checkboxes pick any (categories, priority PPIs).
  type: 'radio' | 'checkbox'
  name: string
  legend: string
  options: { value: string; label: string; checked: boolean }[]
  // The rest of the view (search, sort, other filters), so applying this filter keeps them.
  hidden: [string, string][]
  action: string
  applyLabel: string
}

export type FilterChipProps = {
  icon: IconName
  label: string
  value: string
  // False once the filter's "x" has removed it: the chip turns neutral and reads "Semua …".
  active: boolean
  editLabel: string
  remove?: { href: string; label: string }
  editor: FilterEditor
}

const CHIP_STATES = {
  active: {
    chip: 'bg-[#DCEEFB] has-[button:hover]:bg-[#D0E6F8]',
    icon: '#0F6CB8',
    label: 'text-[#0F6CB8]',
    value: 'text-[#0F5C82]',
  },
  inactive: {
    chip: 'bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] has-[button:hover]:bg-[#F3FAFF]',
    icon: '#5B6B7C',
    label: 'text-[#5B6B7C]',
    value: 'text-[#0B3B5C]',
  },
}

// One filter chip from "Filters". Its body opens an editor panel (the designer hasn't drawn one, so it follows the
// sort menu's style); its "x" removes the filter. Applying submits a GET form, so the choice lands in the URL.
export function FilterChip({ icon, label, value, active, editLabel, remove, editor }: FilterChipProps) {
  const { open, setOpen, rootRef, buttonProps, panelProps } = usePopover()
  const state = CHIP_STATES[active ? 'active' : 'inactive']

  // Opening moves focus to the ticked option (or the first), so the panel can be used straight from the keyboard.
  useEffect(() => {
    if (!open) return
    const root = rootRef.current
    const target =
      root?.querySelector<HTMLInputElement>('input:checked') ?? root?.querySelector<HTMLInputElement>('input:not([type=hidden])')
    target?.focus()
  }, [open, rootRef])

  return (
    <li className="box-border w-fit shrink-0 h-fit">
      <div ref={rootRef} className="box-border w-fit h-fit relative">
        <div
          className={`box-border w-fit shrink-0 h-fit flex flex-row gap-[10px] p-[8px_8px_8px_12px] justify-start items-center ${state.chip} rounded-[12px] transition-colors duration-200 ease-out ${remove ? '' : 'pr-[12px]'}`}
        >
          <button
            {...buttonProps}
            aria-label={editLabel}
            className={`box-border w-fit shrink-0 h-fit flex flex-row gap-[10px] justify-start items-center rounded-[6px] cursor-pointer ${FOCUS_RING}`}
          >
            <Icon name={icon} fill={state.icon} className="box-border w-[18px] shrink-0 h-[18px]" />
            <span className="box-border w-fit shrink-0 h-fit flex flex-col gap-0 justify-start items-start">
              <span className={`text-[12px]/[normal] box-border ${state.label} font-inter font-normal text-left [white-space:nowrap]`}>{label}</span>
              <span className={`text-[14px]/[normal] box-border ${state.value} font-poppins font-semibold text-left [white-space:nowrap]`}>{value}</span>
            </span>
          </button>
          {remove && (
            <Link
              href={remove.href}
              scroll={false}
              aria-label={remove.label}
              className={`box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center rounded-[999px] hover:bg-[#C4DEF4] focus-visible:bg-[#DCEEFB] transition-colors duration-150 ease-out ${FOCUS_RING}`}
            >
              <Icon name="x" fill="#0F6CB8" className="box-border w-[16px] shrink-0 h-[16px]" />
            </Link>
          )}
        </div>
        <Form
          {...panelProps}
          action={editor.action}
          scroll={false}
          onSubmit={() => setOpen(false)}
          className="box-border w-[260px] h-fit absolute left-0 top-[calc(100%+8px)] [box-shadow:0px_8px_24px_0px_#0B3B5C1F] flex flex-col gap-[6px] p-[6px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[12px] [z-index:20] motion-safe:animate-fade-in"
        >
          {editor.hidden.map(([name, value], index) => (
            <input key={`${name}-${index}`} type="hidden" name={name} value={value} />
          ))}
          {/* Keeps the filter in the URL even with every box unticked, which then reads as "filter removed". */}
          {editor.type === 'checkbox' && <input type="hidden" name={editor.name} value="" />}
          <fieldset className="box-border w-full h-fit flex flex-col gap-0 m-0 p-0 border-0 min-w-0">
            <legend className="text-[12px]/[normal] box-border w-full p-[6px_12px_4px_12px] text-[#5B6B7C] font-inter font-normal text-left">
              {editor.legend}
            </legend>
            {editor.options.map((option) => (
              <label
                key={option.value}
                className="box-border w-full h-[40px] shrink-0 flex flex-row gap-[10px] p-[0px_12px] justify-start items-center rounded-[8px] hover:bg-[#F7F9FC] has-[:checked]:bg-[#F3FAFF] cursor-pointer"
              >
                <input
                  type={editor.type}
                  name={editor.name}
                  value={option.value}
                  defaultChecked={option.checked}
                  className="box-border w-[16px] h-[16px] shrink-0 m-0 accent-[#0F6CB8] cursor-pointer"
                />
                <span className="text-[14px]/[normal] box-border text-[#0B3B5C] font-poppins font-medium text-left [white-space:nowrap]">
                  {option.label}
                </span>
              </label>
            ))}
          </fieldset>
          <button
            type="submit"
            className={`box-border w-full h-[40px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#0F6CB8] rounded-[8px] cursor-pointer ${SOLID_HOVER} ${PRESS_WIDE} ${FOCUS_RING}`}
          >
            <span className="text-[14px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">
              {editor.applyLabel}
            </span>
          </button>
        </Form>
      </div>
    </li>
  )
}
