import { MarketplaceView } from '@/components/pembeli/marketplace-view'
import { parseMarketplaceQuery } from '@/components/pembeli/marketplace-query'
import { loadBatches } from '@/lib/marketplace/batches'
import { requireProfile } from '@/lib/supabase/auth'
import { PEMBELI_ROLE_LABEL } from '@/components/pembeli/content'

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const [profile, batches, params] = await Promise.all([
    requireProfile('pembeli'),
    loadBatches(),
    searchParams,
  ])

  return (
    <MarketplaceView
      all={batches}
      query={parseMarketplaceQuery(params)}
      user={{ name: profile.full_name, role: PEMBELI_ROLE_LABEL }}
    />
  )
}
