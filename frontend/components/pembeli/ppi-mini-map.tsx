'use client'

import dynamic from 'next/dynamic'

// Leaflet touches `window` on import, so the map loads only in the browser.
const PpiMiniMapCanvas = dynamic(() => import('@/components/pembeli/ppi-mini-map-canvas').then((mod) => mod.PpiMiniMapCanvas), {
  ssr: false,
})

type PpiMiniMapProps = {
  lat: number
  lng: number
  tiles: { url: string; attribution: string }
  // Full width of its container (the transaction drawer's Pengambilan panel) instead of the batch drawer's thumbnail.
  wide?: boolean
}

// "Mini Map": a small fixed map centred on the batch's PPI, pin on the spot. The export uses a static crop of the
// marketplace map; this shows the right place for every PPI.
export function PpiMiniMap({ wide, ...props }: PpiMiniMapProps) {
  return (
    <div
      aria-hidden="true"
      className={`box-border ${wide ? 'w-full h-[140px]' : 'w-[104px] sm:w-[140px] h-[88px]'} shrink-0 [border:1px_solid_#E2E8F0] rounded-[10px] overflow-hidden relative isolate bg-[#DCEEFB]`}
    >
      <PpiMiniMapCanvas {...props} />
    </div>
  )
}
