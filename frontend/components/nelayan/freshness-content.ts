// All copy for the "Hasil Kesegaran" modal. Edit here to swap content without touching layout.
// Text lives in messages/*.json under `dashboard.nelayan.freshness`. The grading itself comes from the Freshness
// API — see lib/freshness/client.ts — and the recommendations from lib/catches/recommendations.ts.
import type { createFormatter } from 'next-intl'
import type { Translator } from '@/lib/i18n/translator'

export type FreshnessT = Translator<'dashboard.nelayan.freshness'>

// The going rate shown beside the price field, per kg. One range for every category until prices are per category.
const MARKET_RANGE = { from: 7000, to: 10000 }

export function freshnessModal(t: FreshnessT) {
  return {
    title: t('title'),
    subtitle: t('subtitle'),
    closeHref: '/nelayan',
    closeLabel: t('close'),
    disclaimer: t('disclaimer'),
    submitLabel: t('submit'),
  }
}

export function gradePanel(t: FreshnessT) {
  return {
    gradeLabel: t('gradeLabel'),
    summaryTitle: t('summaryTitle'),
    metricLabels: { confidence: t('freshnessLabel'), temperature: t('temperatureLabel') },
  }
}

export function usageRecommendations(t: FreshnessT) {
  return {
    title: t('usageTitle'),
    subtitle: t('usageSubtitle'),
  }
}

export function priceField(t: FreshnessT, format: ReturnType<typeof createFormatter>) {
  return {
    name: 'harga',
    label: t('price.label'),
    helper: t('price.helper'),
    prefix: 'Rp',
    suffix: '/ kg',
    // Suggested price, filled per catch from the going rate for its category.
    defaultValue: '',
    marketLabel: t('price.marketLabel'),
    marketRange: `${format.number(MARKET_RANGE.from, 'rupiah')}–${format.number(MARKET_RANGE.to)}/kg`,
  }
}

// Shown instead of the grade ring when the Freshness API couldn't grade the catch (it was down, or rejected the photo).
export function ungradedCopy(t: FreshnessT) {
  return {
    subtitle: t('ungraded.subtitle'),
    title: t('ungraded.title'),
    body: t('ungraded.body'),
    // The photo wasn't kept (a format browsers can't show), so there is nothing to send again.
    noPhotoBody: t('ungraded.noPhotoBody'),
    retryLabel: t('ungraded.retry'),
    retryingLabel: t('ungraded.retrying'),
    // After a "Nilai ulang" that failed as well.
    stillFailing: t('ungraded.stillFailing'),
  }
}

export type FreshnessModalContent = ReturnType<typeof freshnessModal>
export type GradePanelContent = ReturnType<typeof gradePanel>
export type PriceFieldContent = ReturnType<typeof priceField>
export type UngradedContent = ReturnType<typeof ungradedCopy>
