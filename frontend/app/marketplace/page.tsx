import { MarketplaceView } from '@/components/pembeli/marketplace-view'
import { parseMarketplaceQuery } from '@/components/pembeli/marketplace-query'
import { loadBatches } from '@/lib/marketplace/batches'
import { requireProfile } from '@/lib/supabase/auth'
import { displayNameFor } from '@/lib/supabase/display-name'
import { getPreferenceValues, marketplaceDefaults } from '@/lib/pembeli/preferences'
import { getTranslations } from 'next-intl/server'

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const [profile, batches, params, preferences] = await Promise.all([
    requireProfile('pembeli'),
    loadBatches(),
    searchParams,
    getPreferenceValues(),
  ])

  return (
    <MarketplaceView
      all={batches}
      // Filters the URL doesn't set open at the buyer's saved Preferensi.
      query={parseMarketplaceQuery(params, marketplaceDefaults(preferences))}
      user={{ name: await displayNameFor(profile), role: (await getTranslations('nav'))('roles.pembeli') }}
      soldOut={params.habis === '1'}
    />
  )
}
