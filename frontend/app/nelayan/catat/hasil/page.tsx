import { notFound } from 'next/navigation'
import { NelayanDashboard } from '@/components/nelayan/dashboard'
import { loadNelayanDashboard } from '@/lib/nelayan/dashboard'
import { FreshnessModal } from '@/components/nelayan/freshness-modal'
import { publishListing } from '@/app/nelayan/actions'
import { CATCH_BREADCRUMB } from '@/components/nelayan/catch-content'
import { FRESHNESS_MODAL, GRADE_PANEL, PRICE_FIELD, USAGE_RECOMMENDATIONS } from '@/components/nelayan/freshness-content'
import { getCatchById } from '@/lib/supabase/catches'
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
  const { id } = await searchParams
  if (typeof id !== 'string') notFound()

  const [dashboard, entry] = await Promise.all([loadNelayanDashboard(), getCatchById(id)])
  // RLS hides other fishers' catches, so a miss here is either a bad id or someone else's.
  if (!entry) notFound()

  const score = entry.freshness_score === null ? 0 : Math.round(Number(entry.freshness_score))
  const condition = gradeCondition(entry.freshness_grade)

  return (
    <>
      <NelayanDashboard data={dashboard} breadcrumb={CATCH_BREADCRUMB} />
      <FreshnessModal
        modal={FRESHNESS_MODAL}
        catchId={entry.id}
        result={{
          grade: entry.freshness_grade ?? '—',
          condition: entry.freshness_grade
            ? `${condition === 'live' ? 'Hidup' : 'Mati'}, ${score}%`
            : 'Belum dinilai',
          freshness: score,
          temperature: entry.freshness_grade ? TEMPERATURE[condition] : '—',
        }}
        gradePanel={GRADE_PANEL}
        recommendations={{
          ...USAGE_RECOMMENDATIONS,
          // The model's own recommendation is a sentence, not three cards, so it
          // replaces the subtitle and the derived cards stay for the detail.
          subtitle: entry.hilirisasi_recommendation ?? USAGE_RECOMMENDATIONS.subtitle,
          options: recommendationsFor(entry),
        }}
        price={PRICE_FIELD}
        action={publishListing}
      />
    </>
  )
}
