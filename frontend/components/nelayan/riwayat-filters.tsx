'use client'

import { useTranslations } from 'next-intl'
import { DateRangeMenu } from '@/components/nelayan/date-range-menu'
import { FilterMenu } from '@/components/nelayan/filter-menu'
import { filtersCopy, type StatusFilter } from '@/components/nelayan/riwayat-content'
import type { DateRange } from '@/lib/nelayan/riwayat'

type RiwayatFiltersProps = {
  action: string
  // What the date button reads: the chosen range, or what the loaded rows cover.
  dateLabel: string
  range: DateRange
  status: StatusFilter
}

// Each status is a URL (?status=) that keeps the date range; "semua" leaves ?status= out.
function statusHref(action: string, range: DateRange, value: StatusFilter) {
  const params = new URLSearchParams()
  if (range.from) params.set('dari', range.from)
  if (range.to) params.set('sampai', range.to)
  if (value !== 'semua') params.set('status', value)
  const query = params.toString()
  return query ? `${action}?${query}` : action
}

// "Filters": the date range and the status dropdown, both landing in the URL so the server filters the rows.
export function RiwayatFilters({ action, dateLabel, range, status }: RiwayatFiltersProps) {
  const FILTERS = filtersCopy(useTranslations('dashboard.riwayat'))
  const { dateRange } = FILTERS

  return (
    <div className="box-border w-full h-fit shrink-0 flex flex-col sm:flex-row gap-[14px] justify-start items-stretch sm:items-end">
      <DateRangeMenu
        action={action}
        keep={status !== 'semua' ? { status } : {}}
        range={range}
        value={dateLabel}
        editLabel={dateRange.editLabel(dateLabel)}
        copy={dateRange}
      />
      <FilterMenu
        label={FILTERS.status.label}
        icon="funnel"
        options={FILTERS.status.options.map((option) => ({
          href: statusHref(action, range, option.value),
          label: option.label,
          selected: option.value === status,
        }))}
      />
    </div>
  )
}
