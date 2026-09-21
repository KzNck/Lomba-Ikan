import { redirect } from 'next/navigation'
import { MarketplaceView } from '@/components/pembeli/marketplace-view'
import { BatchDrawer } from '@/components/pembeli/batch-drawer'
import { buyBatch } from '@/app/marketplace/actions'
import { PREFERENCES } from '@/components/pembeli/marketplace-content'
import { PEMBELI_ROLE_LABEL } from '@/components/pembeli/content'
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
  // marketplace, where the batch is simply no longer in the grid.
  const batch = batches.find((item) => item.slug === slug)
  if (!batch) redirect('/marketplace')
  const query = parseMarketplaceQuery(await searchParams)

  return (
    <>
      <MarketplaceView
        all={batches}
        query={query}
        user={{ name: await displayNameFor(profile), role: PEMBELI_ROLE_LABEL }}
      />
      <BatchDrawer
        batch={batch}
        closeHref={marketplaceHref(query)}
        similarHref={marketplaceHref({
          q: '',
          sort: query.sort,
          maxGrade: PREFERENCES.maxGrade,
          categories: [batch.category],
          priorityPpis: PREFERENCES.priorityPpis,
        })}
        buyAction={buyBatch}
      />
    </>
  )
}
