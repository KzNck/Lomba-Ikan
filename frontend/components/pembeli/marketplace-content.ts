// All copy for the marketplace (/marketplace). Edit here to swap content without touching layout.
// Text lives in messages/*.json under `dashboard.pembeli.marketplace`; category names under `common.category`. The
// batches themselves come from Supabase — rows are shaped for these components in lib/marketplace/batches.ts.
import { CATEGORY_OPTIONS } from '@/components/nelayan/catch-content'
import type { Translator } from '@/lib/i18n/translator'

export const MARKETPLACE_PATH = '/marketplace'

// "Urutkan" options, in menu order. The first is the default. Sold batches always sort last.
export const SORT_VALUES = ['terdekat', 'kesegaran', 'terbaru'] as const
export type SortValue = (typeof SORT_VALUES)[number]

// Freshness grades from best to worst. A grade filter keeps everything from A1 down to the chosen grade.
export const GRADES = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3'] as const
export type Grade = (typeof GRADES)[number]

// The same categories the catch wizard offers, so every listing falls under one of them.
export const CATEGORY_VALUES: readonly string[] = CATEGORY_OPTIONS.map(({ value }) => value)
export type Category = string

// The filters the marketplace opens with when the URL says nothing. "PPI prioritas" puts those PPIs' batches first
// rather than hiding the rest. "Reset filter" comes back here. The buyer's own saved preferences are not stored yet
// (no column for them), so these are the defaults for everyone — see the note in lib/supabase/auth.ts.
export const PREFERENCES: { maxGrade: Grade | null; categories: Category[]; priorityPpis: string[] } = {
  maxGrade: null,
  categories: [],
  priorityPpis: [],
}

// How the catch is kept, shown in the drawer's grade badge and "Kondisi & Kesegaran". Labels in `conditions`.
export const CONDITION_ICONS = {
  es: 'snowflake',
  hidup: 'leaf',
} as const
export type Condition = keyof typeof CONDITION_ICONS

// OpenStreetMap's standard tiles: no API key, fine for development and light use. For production traffic, point
// this at a tile provider you have an account with (OSM's tile policy asks heavy users to). Swap URL and
// attribution together.
export const MAP_TILES = {
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}

export type MarketplaceT = Translator<'dashboard.pembeli.marketplace'>

export function marketplaceCopy(t: MarketplaceT, categoryName: Translator<'common.category'>) {
  const sortOptions = SORT_VALUES.map((value) => ({ value, label: t(`sort.${value}`) }))

  return {
    MARKETPLACE: {
      title: t('title'),
      subtitle: t('subtitle'),
      search: {
        label: t('searchLabel'),
        placeholder: t('searchPlaceholder'),
      },
      filtersLabel: t('filtersLabel'),
      resetLabel: t('reset'),
      resultCount: (count: number, ppi?: string) => (ppi ? t('resultCountAt', { count, ppi }) : t('resultCount', { count })),
    },
    SORT_OPTIONS: sortOptions,
    SORT_MENU: {
      buttonLabel: (option: string) => t('sort.button', { option }),
    },
    CATEGORIES: CATEGORY_OPTIONS.map(({ value }) => ({ value, label: categoryName(value) })),
    // The three filter chips. The designer hasn't drawn the editing panels yet; they reuse the sort menu's style.
    // `none` is the chip's value after its "x" removes the filter; the chip stays so it can be set again.
    FILTERS: {
      grade: {
        icon: 'leaf',
        label: t('filters.grade'),
        none: t('filters.gradeNone'),
        legend: t('filters.gradeLegend'),
        option: (grade: Grade) => (grade === 'A1' ? t('filters.gradeOnlyA1') : t('filters.gradeUpTo', { grade })),
      },
      categories: {
        icon: 'fish',
        label: t('filters.categories'),
        none: t('filters.categoriesNone'),
        legend: t('filters.categoriesLegend'),
      },
      priority: {
        icon: 'map-pin',
        label: t('filters.priority'),
        none: t('filters.priorityNone'),
        legend: t('filters.priorityLegend'),
      },
      apply: t('filters.apply'),
      editLabel: (label: string, value: string) => t('filters.edit', { label, value }),
      removeLabel: (label: string) => t('filters.remove', { label }),
    } as const,
    // The "Tidak ada hasil" state, shown when nothing matches the search and filters.
    NO_RESULTS: {
      title: t('noResultsTitle'),
      body: (query: string) => (query ? t('noResultsBodyQuery', { query }) : t('noResultsBody')),
    },
    CONDITIONS: {
      es: { icon: CONDITION_ICONS.es, label: t('conditions.es') },
      hidup: { icon: CONDITION_ICONS.hidup, label: t('conditions.hidup') },
    },
    // The "Detail Drawer" at /marketplace/<slug>, over the marketplace.
    BATCH_DRAWER: {
      closeLabel: t('drawer.close'),
      gradeLabel: t('drawer.gradeLabel'),
      photoPrevLabel: t('drawer.photoPrev'),
      photoNextLabel: t('drawer.photoNext'),
      photoCounter: (current: number, total: number) => `${current} / ${total}`,
      weightLabel: t('drawer.weight'),
      totalLabel: t('drawer.total'),
      conditionTitle: t('drawer.conditionTitle'),
      auctionLeft: (time: string) => t('drawer.auctionLeft', { time }),
      locationTitle: t('drawer.locationTitle'),
      distance: (km: number) => t('drawer.distance', { km }),
      usageTitle: t('drawer.usageTitle'),
      infoTitle: t('drawer.infoTitle'),
      infoLabels: { fisherman: t('drawer.fisherman'), method: t('drawer.method'), batchNumber: t('drawer.batchNumber') },
      buyLabel: (total: string) => t('drawer.buy', { total }),
      processingLabel: t('drawer.processing'),
      // Under the buy button: what happens after it, since it leaves the app for WhatsApp.
      buyNote: t('drawer.buyNote'),
      // "Batch sudah terjual": shown instead of the buy button once someone else has bought it.
      soldOut: {
        title: t('drawer.soldOutTitle'),
        body: (category: string) => t('drawer.soldOutBody', { category: category.toLocaleLowerCase() }),
        action: t('drawer.soldOutAction'),
      },
    },
    PPI_MAP: {
      label: t('map.label'),
      markerDetail: (count: number) => t('map.markerDetail', { count }),
      // Screen-reader name for a marker; clicking one filters the results to that PPI, clicking it again clears it.
      markerLabel: (name: string, detail: string, selected: boolean) =>
        selected ? t('map.showAll', { name, detail }) : t('map.showAt', { name, detail }),
      zoomInLabel: t('map.zoomIn'),
      zoomOutLabel: t('map.zoomOut'),
      locateLabel: t('map.locate'),
      locating: t('map.locating'),
      locateError: t('map.locateError'),
      loading: t('map.loading'),
      tiles: MAP_TILES,
    },
  }
}

export type MarketplaceCopy = ReturnType<typeof marketplaceCopy>
