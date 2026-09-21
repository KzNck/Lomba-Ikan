import { notFound } from 'next/navigation'
import { getFormatter, getTranslations } from 'next-intl/server'
import { NelayanDashboard } from '@/components/nelayan/dashboard'
import { loadNelayanDashboard } from '@/lib/nelayan/dashboard'
import { FreshnessModal } from '@/components/nelayan/freshness-modal'
import { publishListing, regradeCatch } from '@/app/nelayan/actions'
import { catchBreadcrumb } from '@/components/nelayan/catch-content'
import {
  freshnessModal,
  gradePanel,
  priceField,
  ungradedCopy,
  usageRecommendations,
} from '@/components/nelayan/freshness-content'
import { getCatchById } from '@/lib/supabase/catches'
import { requireProfile } from '@/lib/supabase/auth'
import { waNumber } from '@/lib/contact/whatsapp'
import { recommendationsFor } from '@/lib/catches/recommendations'
import { gradeCondition } from '@/lib/catches/present'

// Estimated holding temperature per grade group — the model reports a grade, not a reading.
const TEMPERATURE = { live: '0–4°C', dead: '5–10°C' }

// The "07 Hasil Kesegaran" frame: the graded result over the dashboard, after the wizard's photo step.
export default async function HasilKesegaranPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id, gagal } = await searchParams
  if (typeof id !== 'string') notFound()

  const [dashboard, entry, profile] = await Promise.all([loadNelayanDashboard(), getCatchById(id), requireProfile('nelayan')])
  // RLS hides other fishers' catches, so a miss here is either a bad id or someone else's.
  if (!entry) notFound()

  const [t, catchT, common, format] = await Promise.all([
    getTranslations('dashboard.nelayan.freshness'),
    getTranslations('dashboard.nelayan.catch'),
    getTranslations('common.grade'),
    getFormatter(),
  ])
  const usage = usageRecommendations(t)
  const score = entry.freshness_score === null ? 0 : Math.round(Number(entry.freshness_score))
  const condition = gradeCondition(entry.freshness_grade)

  return (
    <>
      <NelayanDashboard data={dashboard} breadcrumb={catchBreadcrumb(catchT)} />
      <FreshnessModal
        modal={freshnessModal(t)}
        catchId={entry.id}
        result={{
          grade: entry.freshness_grade ?? '—',
          condition: entry.freshness_grade ? t('condition', { condition, score }) : common('unrated'),
          freshness: score,
          temperature: entry.freshness_grade ? TEMPERATURE[condition] : '—',
        }}
        // No grade means the Freshness API failed when the catch was saved; "Nilai ulang" needs the stored photo.
        ungraded={
          entry.freshness_grade
            ? undefined
            : { catchId: entry.id, copy: ungradedCopy(t), regrade: entry.photo_url ? regradeCatch : undefined, stillFailing: gagal === '1' }
        }
        gradePanel={gradePanel(t)}
        recommendations={{
          ...usage,
          // The model's own recommendation is a sentence, not three cards, so it
          // replaces the subtitle and the derived cards stay for the detail.
          subtitle: entry.hilirisasi_recommendation ?? usage.subtitle,
          options: recommendationsFor(t, entry),
        }}
        price={priceField(t, format)}
        // publishListing refuses a fisher without a WhatsApp number; say why before they press it.
        phoneMissing={
          waNumber(profile.phone)
            ? undefined
            : { message: t('phoneMissing'), action: { href: '/nelayan/akun', label: t('phoneMissingAction') } }
        }
        action={publishListing}
      />
    </>
  )
}
