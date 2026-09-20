'use client'

import Form from 'next/form'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { usePopover } from '@/components/ui/use-popover'
import { FILTERS, type StatusFilter } from '@/components/nelayan/riwayat-content'
import { PRESS_WIDE, SOLID_HOVER } from '@/components/ui/interaction'
import type { DateRange } from '@/lib/nelayan/riwayat'

type RiwayatFiltersProps = {
  action: string
  // What the date button reads: the chosen range, or what the loaded rows cover.
  dateLabel: string
  range: DateRange
  status: StatusFilter
}

const CONTROL =
  'box-border w-full h-[46px] shrink-0 flex flex-row gap-[10px] p-[0px_14px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#7F8FA4] [outline-offset:-0.5px] rounded-[12px]'
const VALUE = 'text-[14px]/[normal] box-border [flex:1_1_0] min-w-0 text-[#0B3B5C] font-inter font-medium text-left'
const FOCUS_WITHIN = 'focus-within:[outline-color:#0F6CB8] focus-within:[box-shadow:0px_0px_0px_3px_#FFFFFF,_0px_0px_0px_5px_#0F6CB8]'

// "Filters": the date range and the status dropdown, both landing in the URL so the server filters the rows.
// The export only draws the closed controls; the date panel follows the marketplace filter panels.
export function RiwayatFilters({ action, dateLabel, range, status }: RiwayatFiltersProps) {
  const { open, setOpen, rootRef, buttonProps, panelProps } = usePopover()
  const { dateRange } = FILTERS

  return (
    <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[14px] justify-start items-end">
      <div ref={rootRef} className="box-border w-[280px] shrink-0 h-fit flex flex-col gap-[6px] justify-start items-start relative">
        <span className="text-[12px]/[normal] box-border text-[#5B6B7C] font-inter font-medium text-left [white-space:nowrap]">{dateRange.label}</span>
        <button
          {...buttonProps}
          aria-label={dateRange.editLabel(dateLabel)}
          className={`${CONTROL} cursor-pointer transition-colors duration-200 ease-out hover:bg-[#F3FAFF] ${FOCUS_RING}`}
        >
          <Icon name="calendar" fill="#5B6B7C" className="box-border w-[18px] shrink-0 h-[18px]" />
          <span className={VALUE}>{dateLabel}</span>
          <Icon
            name="chevron-down"
            fill="#5B6B7C"
            className={`box-border w-[18px] shrink-0 h-[18px] transition-transform duration-200 ease-out ${open ? 'rotate-180' : ''}`}
          />
        </button>
        <Form
          {...panelProps}
          action={action}
          scroll={false}
          onSubmit={() => setOpen(false)}
          className="box-border w-[280px] h-fit absolute left-0 top-[calc(100%+8px)] [box-shadow:0px_8px_24px_0px_#0B3B5C1F] flex flex-col gap-[10px] p-[14px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[12px] [z-index:20] motion-safe:animate-fade-in"
        >
          {status !== 'semua' && <input type="hidden" name="status" value={status} />}
          <fieldset className="box-border w-full flex flex-col gap-[10px] m-0 p-0 border-0 min-w-0">
            <legend className="text-[12px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left p-[0px_0px_4px_0px]">
              {dateRange.legend}
            </legend>
            <label className="box-border w-full flex flex-col gap-[4px] justify-start items-start">
              <span className="text-[12px]/[normal] box-border text-[#5B6B7C] font-inter font-medium text-left">{dateRange.fromLabel}</span>
              <span className={`${CONTROL} ${FOCUS_WITHIN}`}>
                <input type="date" name="dari" defaultValue={range.from ?? ''} className={`${VALUE} bg-transparent outline-hidden`} />
              </span>
            </label>
            <label className="box-border w-full flex flex-col gap-[4px] justify-start items-start">
              <span className="text-[12px]/[normal] box-border text-[#5B6B7C] font-inter font-medium text-left">{dateRange.toLabel}</span>
              <span className={`${CONTROL} ${FOCUS_WITHIN}`}>
                <input type="date" name="sampai" defaultValue={range.to ?? ''} className={`${VALUE} bg-transparent outline-hidden`} />
              </span>
            </label>
          </fieldset>
          <button
            type="submit"
            className={`box-border w-full h-[40px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#0F6CB8] rounded-[8px] cursor-pointer ${SOLID_HOVER} ${PRESS_WIDE} ${FOCUS_RING}`}
          >
            <span className="text-[14px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">{dateRange.apply}</span>
          </button>
          {/* Submitting with both fields empty is what clears the range, so this is a plain submit too. */}
          <button
            type="submit"
            onClick={(event) => {
              const form = event.currentTarget.form
              if (!form) return
              // Disabled fields are not submitted, so the URL comes back without empty ?dari=&sampai=.
              form.querySelectorAll<HTMLInputElement>('input[type=date]').forEach((input) => {
                input.value = ''
                input.disabled = true
              })
            }}
            className={`box-border w-full h-[36px] shrink-0 flex flex-row gap-0 justify-center items-center rounded-[8px] cursor-pointer hover:bg-[#F7F9FC] ${FOCUS_RING}`}
          >
            <span className="text-[13px]/[normal] box-border text-[#0F6CB8] font-poppins font-semibold text-left [white-space:nowrap]">{dateRange.reset}</span>
          </button>
        </Form>
      </div>
      <Form action={action} scroll={false} className="box-border w-[190px] shrink-0 h-fit flex flex-col gap-[6px] justify-start items-start">
        {range.from && <input type="hidden" name="dari" value={range.from} />}
        {range.to && <input type="hidden" name="sampai" value={range.to} />}
        <label htmlFor="riwayat-status" className="text-[12px]/[normal] box-border text-[#5B6B7C] font-inter font-medium text-left [white-space:nowrap]">
          {FILTERS.status.label}
        </label>
        <div className={`${CONTROL} ${FOCUS_WITHIN}`}>
          <Icon name="funnel" fill="#5B6B7C" className="box-border w-[18px] shrink-0 h-[18px]" />
          <select
            id="riwayat-status"
            name="status"
            defaultValue={status}
            onChange={(event) => event.currentTarget.form?.requestSubmit()}
            className={`${VALUE} appearance-none bg-transparent outline-hidden cursor-pointer`}
          >
            {FILTERS.status.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Icon name="chevron-down" fill="#5B6B7C" className="box-border w-[18px] shrink-0 h-[18px] pointer-events-none" />
        </div>
      </Form>
    </div>
  )
}
