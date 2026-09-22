import Link from 'next/link'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { FilterChip, type FilterChipProps } from '@/components/pembeli/filter-chip'
import { OUTLINE_HOVER, PRESS } from '@/components/ui/interaction'

type FilterBarProps = {
  label: string
  filters: (FilterChipProps & { key: string })[]
  reset: { href: string; label: string }
}

// "Filters": the three filter chips, then "Reset filter", which goes back to the buyer's saved preferences.
export function FilterBar({ label, filters, reset }: FilterBarProps) {
  return (
    <div role="group" aria-label={label} className="box-border w-full h-fit shrink-0 flex flex-row flex-wrap lg:flex-nowrap gap-[12px] justify-start items-center">
      {/* `contents` keeps each chip a direct flex child, so the bar's 12px gap still sits between them. */}
      <ul className="contents">
        {/* Keyed by value too: the editors' ticks are uncontrolled, so a new filter value remounts them fresh. */}
        {filters.map(({ key, ...filter }) => (
          <FilterChip key={`${key}:${filter.value}`} {...filter} />
        ))}
      </ul>
      <ResetFilterLink {...reset} />
    </div>
  )
}

export function ResetFilterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      scroll={false}
      className={`box-border w-fit shrink-0 h-[44px] lg:h-[40px] flex flex-row gap-[6px] p-[0px_14px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[999px] ${OUTLINE_HOVER} ${PRESS} ${FOCUS_RING}`}
    >
      <Icon name="rotate-ccw" fill="#0F6CB8" className="box-border w-[16px] shrink-0 h-[16px]" />
      <span className="text-[14px]/[normal] box-border text-[#0F6CB8] font-poppins font-semibold text-left [white-space:nowrap]">{label}</span>
    </Link>
  )
}
