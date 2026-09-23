// The marketplace's view lives in the URL:
//   ?q=          search text
//   ?urut=       sort order
//   ?ppi=        the map marker picked (show only that PPI)
//   ?grade=      worst grade to show (A1…B3), or "semua"
//   ?jenis=      categories to show (repeatable), or "semua"
//   ?prioritas=  PPIs to list first (repeatable), or "semua" for none
// A filter left out of the URL falls back to the buyer's saved preferences, so /marketplace opens with them.
import {
  CATEGORY_VALUES,
  GRADES,
  MARKETPLACE_PATH,
  PREFERENCES,
  SORT_VALUES,
  type Category,
  type Grade,
  type SortValue,
} from '@/components/pembeli/marketplace-content'
import type { Batch } from '@/lib/marketplace/batches'

type SearchParams = { [key: string]: string | string[] | undefined }

export type MarketplaceQuery = {
  q: string
  sort: SortValue
  ppi?: string
  // null: every grade.
  maxGrade: Grade | null
  // Empty: every category.
  categories: Category[]
  // Empty: no PPI listed first.
  priorityPpis: string[]
}

// The URL value for "filter removed". Any value that isn't an option reads as removed; this is the one we write.
const NONE = 'semua'
const DEFAULT_SORT = SORT_VALUES[0]

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)?.trim() ?? ''

// A repeatable filter: absent means "use the preference", present keeps only valid options (none left = removed).
// The editing panels send an empty value alongside the checkboxes so unticking everything still counts as present.
// `valid` null accepts any value: PPI names, where any of the national ports can hold batches.
function listParam<T extends string>(raw: string | string[] | undefined, valid: readonly string[] | null, fallback: T[]) {
  if (raw === undefined) return fallback
  const values = (Array.isArray(raw) ? raw : [raw]).map((value) => value.trim())
  if (!valid) return [...new Set(values.filter((value) => value && value !== NONE))] as T[]
  return valid.filter((option) => values.includes(option)) as T[]
}

export function parseMarketplaceQuery(params: SearchParams): MarketplaceQuery {
  const sort = SORT_VALUES.find((value) => value === first(params.urut)) ?? DEFAULT_SORT
  const ppi = first(params.ppi)
  const grade = first(params.grade)
  return {
    q: first(params.q),
    sort,
    // Any PPI name: one with no batches simply shows "Tidak ada hasil".
    ppi: ppi || undefined,
    maxGrade: params.grade === undefined ? PREFERENCES.maxGrade : ((GRADES as readonly string[]).includes(grade) ? (grade as Grade) : null),
    categories: listParam<Category>(params.jenis, CATEGORY_VALUES, PREFERENCES.categories),
    priorityPpis: listParam<string>(params.prioritas, null, PREFERENCES.priorityPpis),
  }
}

const sameSet = (a: readonly string[], b: readonly string[]) => a.length === b.length && a.every((value) => b.includes(value))

// The view as URL params, leaving out anything at its default so the plain /marketplace stays clean.
export function marketplaceParams({ q, sort, ppi, maxGrade, categories, priorityPpis }: MarketplaceQuery) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (sort !== DEFAULT_SORT) params.set('urut', sort)
  if (ppi) params.set('ppi', ppi)
  if (maxGrade !== PREFERENCES.maxGrade) params.set('grade', maxGrade ?? NONE)
  const lists = [
    ['jenis', categories, PREFERENCES.categories],
    ['prioritas', priorityPpis, PREFERENCES.priorityPpis],
  ] as const
  for (const [name, values, preference] of lists) {
    if (sameSet(values, preference)) continue
    if (values.length === 0) params.append(name, NONE)
    else values.forEach((value) => params.append(name, value))
  }
  return params
}

export function marketplaceHref(query: MarketplaceQuery) {
  const search = marketplaceParams(query).toString()
  return search ? `${MARKETPLACE_PATH}?${search}` : MARKETPLACE_PATH
}

// Hidden inputs that carry the rest of the view through a GET form which edits `except`.
export function hiddenFields(query: MarketplaceQuery, except: 'q' | 'grade' | 'jenis' | 'prioritas') {
  return [...marketplaceParams(query)].filter(([name]) => name !== except)
}

// Back to the saved preferences, with the search and map pick cleared. The sort order stays.
export function resetHref(query: MarketplaceQuery) {
  return marketplaceHref({
    q: '',
    sort: query.sort,
    maxGrade: PREFERENCES.maxGrade,
    categories: PREFERENCES.categories,
    priorityPpis: PREFERENCES.priorityPpis,
  })
}

// "A1" is freshest, "B3" least fresh: compare the letter, then the number. An ungraded batch ("—") ranks last.
const UNGRADED = Number.MAX_SAFE_INTEGER
const gradeRank = (grade: string) =>
  /^[AB]\d$/.test(grade) ? (grade.charCodeAt(0) - 65) * 10 + Number(grade.slice(1)) : UNGRADED

// A batch whose distance is unknown sorts after every batch with one.
const byDistance = (a: Batch, b: Batch) =>
  (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity)

const COMPARE: Record<SortValue, (a: Batch, b: Batch) => number> = {
  terdekat: byDistance,
  kesegaran: (a, b) => gradeRank(a.grade) - gradeRank(b.grade) || byDistance(a, b),
  terbaru: (a, b) => Date.parse(b.listedAt) - Date.parse(a.listedAt),
}

// Whether a batch passes the grade and category filters (the search and map pick are applied separately).
// A grade filter hides ungraded batches, since there is nothing to compare them against.
function passesFilters(batch: Batch, { maxGrade, categories }: MarketplaceQuery) {
  return (
    (!maxGrade || gradeRank(batch.grade) <= gradeRank(maxGrade)) &&
    (categories.length === 0 || categories.includes(batch.category))
  )
}

// The batches to show, in order: sold ones last, then priority PPIs first, then the chosen sort.
export function selectBatches(batches: Batch[], query: MarketplaceQuery) {
  const needle = query.q.toLocaleLowerCase('id')
  const prioritised = (batch: Batch) => Number(!query.priorityPpis.includes(batch.location))
  return batches.filter(
    (batch) =>
      passesFilters(batch, query) &&
      (!needle || `${batch.name} ${batch.location}`.toLocaleLowerCase('id').includes(needle)) &&
      (!query.ppi || batch.location === query.ppi),
  ).sort(
    (a, b) =>
      Number(a.status === 'sold') - Number(b.status === 'sold') ||
      prioritised(a) - prioritised(b) ||
      COMPARE[query.sort](a, b),
  )
}

// Available (not sold) batches per PPI under the current grade and category filters, for the map markers.
export function availableByPpi(batches: Batch[], query: MarketplaceQuery) {
  const counts = new Map<string, number>()
  for (const batch of batches) {
    if (batch.status !== 'sold' && passesFilters(batch, query)) counts.set(batch.location, (counts.get(batch.location) ?? 0) + 1)
  }
  return counts
}
