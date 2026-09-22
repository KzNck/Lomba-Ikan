import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { initialsOf } from '@/lib/nelayan/dashboard-data'
import { MarketplaceSearch } from '@/components/pembeli/marketplace-search'
import { SortMenu } from '@/components/pembeli/sort-menu'
import { FilterBar } from '@/components/pembeli/filter-bar'
import { ProductCard } from '@/components/pembeli/product-card'
import { NoResults } from '@/components/pembeli/no-results'
import { PpiMap } from '@/components/pembeli/ppi-map'
import { useTranslations } from 'next-intl'
import {
  GRADES,
  MARKETPLACE_PATH,
  marketplaceCopy,
  PPI_LOCATIONS,
  type MarketplaceCopy,
} from '@/components/pembeli/marketplace-content'
import {
  availableByPpi,
  hiddenFields,
  marketplaceHref,
  marketplaceParams,
  resetHref,
  selectBatches,
  type MarketplaceQuery,
} from '@/components/pembeli/marketplace-query'
import type { FilterChipProps } from '@/components/pembeli/filter-chip'
import type { Batch } from '@/lib/marketplace/batches'

// The three filter chips for the current view: value, editor options and the URL their "x" goes to.
function filterChips(
  query: MarketplaceQuery,
  { FILTERS, CATEGORIES }: MarketplaceCopy,
): (FilterChipProps & { key: string })[] {
  const chip = (
    key: string,
    copy: { icon: FilterChipProps['icon']; label: string; none: string; legend: string },
    value: string | null,
    removed: MarketplaceQuery,
    editor: Pick<FilterChipProps['editor'], 'type' | 'name' | 'options'>,
  ) => ({
    key,
    icon: copy.icon,
    label: copy.label,
    value: value ?? copy.none,
    active: value !== null,
    editLabel: FILTERS.editLabel(copy.label, value ?? copy.none),
    remove: value !== null ? { href: marketplaceHref(removed), label: FILTERS.removeLabel(copy.label) } : undefined,
    editor: {
      ...editor,
      legend: copy.legend,
      hidden: hiddenFields(query, editor.name as 'grade' | 'jenis' | 'prioritas'),
      action: MARKETPLACE_PATH,
      applyLabel: FILTERS.apply,
    },
  })
  const categoryLabels = CATEGORIES.filter(({ value }) => query.categories.includes(value)).map(({ label }) => label)

  return [
    chip('grade', FILTERS.grade, query.maxGrade && FILTERS.grade.option(query.maxGrade), { ...query, maxGrade: null }, {
      type: 'radio',
      name: 'grade',
      options: [
        ...GRADES.map((grade) => ({ value: grade, label: FILTERS.grade.option(grade), checked: grade === query.maxGrade })),
        { value: 'semua', label: FILTERS.grade.none, checked: query.maxGrade === null },
      ],
    }),
    chip('categories', FILTERS.categories, categoryLabels.join(', ') || null, { ...query, categories: [] }, {
      type: 'checkbox',
      name: 'jenis',
      // No category filter shows every category, so its editor starts with every box ticked.
      options: CATEGORIES.map(({ value, label }) => ({
        value,
        label,
        checked: query.categories.length === 0 || query.categories.includes(value),
      })),
    }),
    chip('priority', FILTERS.priority, query.priorityPpis.join(', ') || null, { ...query, priorityPpis: [] }, {
      type: 'checkbox',
      name: 'prioritas',
      options: Object.keys(PPI_LOCATIONS).map((name) => ({ value: name, label: name, checked: query.priorityPpis.includes(name) })),
    }),
  ]
}

// The "10 Marketplace" frame for a view from the URL (see marketplace-query.ts): the search and filters narrow the
// batches, "Urutkan" orders them and a map marker limits them to one PPI. With no match it shows "Tidak ada hasil".
// /marketplace renders it alone; /marketplace/<slug> renders it behind a batch's detail drawer.
export function MarketplaceView({
  all,
  query,
  user,
}: {
  // Every listed batch; the query narrows and orders them here.
  all: Batch[]
  query: MarketplaceQuery
  user: { name: string; role: string }
}) {
  const copy = marketplaceCopy(useTranslations('dashboard.pembeli.marketplace'), useTranslations('common.category'))
  const { MARKETPLACE, NO_RESULTS, PPI_MAP, SORT_MENU, SORT_OPTIONS } = copy
  const batches = selectBatches(all, query)
  // Cards open their drawer over this same view, so closing it comes back here.
  const search = marketplaceParams(query).toString()
  const reset = { href: resetHref(query), label: MARKETPLACE.resetLabel }

  const sortOptions = SORT_OPTIONS.map(({ value, label }) => ({
    href: marketplaceHref({ ...query, sort: value }),
    label,
    selected: value === query.sort,
  }))
  const sortLabel = SORT_MENU.buttonLabel(SORT_OPTIONS.find(({ value }) => value === query.sort)!.label)

  const markers = [...availableByPpi(all, query)]
    .filter(([name]) => name in PPI_LOCATIONS)
    .map(([name, count]) => {
      const selected = name === query.ppi
      const detail = PPI_MAP.markerDetail(count)
      return {
        name,
        ...PPI_LOCATIONS[name],
        detail,
        action: PPI_MAP.markerLabel(name, detail, selected),
        href: marketplaceHref({ ...query, ppi: selected ? undefined : name }),
        selected,
      }
    })

  return (
    <div className="box-border [flex:1_1_0] flex flex-col gap-0 justify-start items-start relative">
      <DashboardHeader
        title={MARKETPLACE.title}
        subtitle={MARKETPLACE.subtitle}
        user={{ name: user.name, initials: initialsOf(user.name) }}
        accountHref="/pembeli/akun"
      />
      <div className="box-border w-full [flex:1_1_0] flex flex-col gap-[16px] lg:gap-[20px] p-[16px] sm:p-[24px] lg:p-[24px_32px_32px_32px] justify-start items-start">
        {/* Search, then sort: one line from lg, stacked below it. */}
        <div className="box-border w-full h-fit shrink-0 flex flex-row flex-wrap lg:flex-nowrap gap-[12px] lg:gap-[20px] justify-start items-center">
          <MarketplaceSearch action={MARKETPLACE_PATH} query={query.q} hidden={hiddenFields(query, 'q')} {...MARKETPLACE.search} />
          <SortMenu label={sortLabel} options={sortOptions} />
        </div>
        <FilterBar label={MARKETPLACE.filtersLabel} filters={filterChips(query, copy)} reset={reset} />
        {/* Stretched (the export has items-start) so the map runs the column's full height. */}
        <div className="box-border w-full [flex:1_1_0] flex flex-col lg:flex-row gap-[20px] justify-start items-stretch">
          <section className="box-border [flex:1_1_0] min-w-0 h-fit flex flex-col gap-[14px] justify-start items-start">
            <h2 className="text-[15px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left lg:[white-space:nowrap]">
              {MARKETPLACE.resultCount(batches.length, query.ppi)}
            </h2>
            {batches.length > 0 ? (
              // The export lays the cards out in rows of three; a grid keeps a short last row at the same card width.
              <ul className="box-border w-full h-fit shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[14px] justify-start items-start">
                {batches.map((batch, index) => (
                  <li key={batch.href} className="box-border min-w-0 flex">
                    <ProductCard
                      {...batch}
                      href={search ? `${batch.href}?${search}` : batch.href}
                      variant="marketplace"
                      eager={index < 3}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <NoResults title={NO_RESULTS.title} body={NO_RESULTS.body(query.q || query.ppi || '')} reset={reset} />
            )}
          </section>
          <PpiMap
            label={PPI_MAP.label}
            loadingLabel={PPI_MAP.loading}
            markers={markers}
            labels={{
              zoomIn: PPI_MAP.zoomInLabel,
              zoomOut: PPI_MAP.zoomOutLabel,
              locate: PPI_MAP.locateLabel,
              locating: PPI_MAP.locating,
              locateError: PPI_MAP.locateError,
            }}
            tiles={PPI_MAP.tiles}
          />
        </div>
      </div>
    </div>
  )
}
