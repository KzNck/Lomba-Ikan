import { redirect } from 'next/navigation'
import { MarketplaceView } from '@/components/pembeli/marketplace-view'
import { BatchDrawer } from '@/components/pembeli/batch-drawer'
import { buyBatch } from '@/app/marketplace/actions'
import { getPreferenceValues, marketplaceDefaults } from '@/lib/pembeli/preferences'
import { getTranslations } from 'next-intl/server'
import { marketplaceHref, parseMarketplaceQuery } from '@/components/pembeli/marketplace-query'
import { loadBatches } from '@/lib/marketplace/batches'
import { requireProfile } from '@/lib/supabase/auth'
import { displayNameFor } from '@/lib/supabase/display-name'

// The "11 Detail Batch (Marketplace)" frame: a batch's drawer over the marketplace. The URL's query is the view
// behind it (cards link here with it), so closing returns to exactly that view.
export default async function BatchDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const [{ slug }, profile, batches] = await Promise.all([params, requireProfile('pembeli'), loadBatches()])

  // The slug is the catch's id. A miss means it was claimed, expired, or never existed —
  // RLS hides all three from a buyer, so the drawer has nothing to show. Back to the
  // marketplace, which says the batch is gone ("Maaf, batch ini sudah terjual").
  const batch = batches.find((item) => item.slug === slug)
  if (!batch) redirect('/marketplace?habis=1')
  const query = parseMarketplaceQuery(await searchParams, marketplaceDefaults(await getPreferenceValues()))

  return (
    <>
      <MarketplaceView
        all={batches}
        query={query}
        user={{ name: await displayNameFor(profile), role: (await getTranslations('nav'))('roles.pembeli') }}
      />
      <BatchDrawer
        batch={batch}
        closeHref={marketplaceHref(query)}
        similarHref={marketplaceHref({
          q: '',
          sort: query.sort,
          maxGrade: query.defaults.maxGrade,
          categories: [batch.category],
          priorityPpis: query.defaults.priorityPpis,
          defaults: query.defaults,
        })}
        buyAction={buyBatch}
      />
    </>
  )
}
