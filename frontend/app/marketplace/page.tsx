import { MarketplaceView } from '@/components/pembeli/marketplace-view'
import { parseMarketplaceQuery } from '@/components/pembeli/marketplace-query'

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return <MarketplaceView query={parseMarketplaceQuery(await searchParams)} />
}
