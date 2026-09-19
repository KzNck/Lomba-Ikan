import { notFound } from 'next/navigation'
import { MarketplaceView } from '@/components/pembeli/marketplace-view'
import { BatchDrawer } from '@/components/pembeli/batch-drawer'
import { buyBatch } from '@/app/marketplace/actions'
import { BATCHES, PREFERENCES } from '@/components/pembeli/marketplace-content'
import { marketplaceHref, parseMarketplaceQuery } from '@/components/pembeli/marketplace-query'

// The "11 Detail Batch (Marketplace)" frame: a batch's drawer over the marketplace. The URL's query is the view
// behind it (cards link here with it), so closing returns to exactly that view.
export default async function BatchDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await params
  const batch = BATCHES.find((item) => item.slug === slug)
  if (!batch) notFound()
  const query = parseMarketplaceQuery(await searchParams)

  return (
    <>
      <MarketplaceView query={query} />
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
