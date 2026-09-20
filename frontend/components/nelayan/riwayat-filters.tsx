'use client'

import Form from 'next/form'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { FILTERS, type StatusFilter } from '@/components/nelayan/riwayat-content'

type RiwayatFiltersProps = {
  action: string
  // The range the loaded transactions cover, e.g. "2 Jun 2025 – 12 Jul 2025".
  dateRange: string
  status: StatusFilter
}

const CONTROL =
  'box-border w-full h-[46px] shrink-0 flex flex-row gap-[10px] p-[0px_14px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#7F8FA4] [outline-offset:-0.5px] rounded-[12px]'
const VALUE = 'text-[14px]/[normal] box-border [flex:1_1_0] min-w-0 text-[#0B3B5C] font-inter font-medium text-left'

// "Filters": the date range and the status dropdown. Picking a status submits, so it lands in ?status= and the
// server filters the rows. The date range shows what the loaded rows cover; choosing one needs a date picker the
// design doesn't specify yet, so the control is not interactive.
export function RiwayatFilters({ action, dateRange, status }: RiwayatFiltersProps) {
  return (
    <Form action={action} scroll={false} className="box-border w-full h-fit shrink-0 flex flex-row gap-[14px] justify-start items-end">
      <div className="box-border w-[280px] shrink-0 h-fit flex flex-col gap-[6px] justify-start items-start">
        <p className="text-[12px]/[normal] box-border text-[#5B6B7C] font-inter font-medium text-left [white-space:nowrap]">
          {FILTERS.dateRange.label}
        </p>
        <div className={CONTROL}>
          <Icon name="calendar" fill="#5B6B7C" className="box-border w-[18px] shrink-0 h-[18px]" />
          <span className={VALUE}>{dateRange}</span>
          <Icon name="chevron-down" fill="#5B6B7C" className="box-border w-[18px] shrink-0 h-[18px]" />
        </div>
      </div>
      <div className="box-border w-[190px] shrink-0 h-fit flex flex-col gap-[6px] justify-start items-start">
        <label htmlFor="riwayat-status" className="text-[12px]/[normal] box-border text-[#5B6B7C] font-inter font-medium text-left [white-space:nowrap]">
          {FILTERS.status.label}
        </label>
        <div className={`${CONTROL} focus-within:[outline-color:#0F6CB8] focus-within:[box-shadow:0px_0px_0px_3px_#FFFFFF,_0px_0px_0px_5px_#0F6CB8]`}>
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
      </div>
      {/* Without JavaScript the select still submits through this button. */}
      <noscript>
        <button type="submit" className={`box-border h-[46px] p-[0px_14px] bg-[#0F6CB8] text-[#FFFFFF] rounded-[12px] ${FOCUS_RING}`}>
          Terapkan
        </button>
      </noscript>
    </Form>
  )
}
