'use client'

import dynamic from 'next/dynamic'
import type { PpiMapCanvasProps } from '@/components/pembeli/ppi-map-canvas'

// Leaflet touches `window` on import, so the map itself loads only in the browser.
const PpiMapCanvas = dynamic(() => import('@/components/pembeli/ppi-map-canvas').then((mod) => mod.PpiMapCanvas), {
  ssr: false,
  loading: () => null,
})

type PpiMapProps = PpiMapCanvasProps & {
  label: string
  loadingLabel: string
}

// "Map": a live map of the PPIs beside the results, running the column's full height. The export's static image is
// 420×1070px with the zoom controls at left-[364px] top-[880px]; the controls are pinned to the bottom-right here.
// Its 320px floor only matters when there are few results; it is low enough that a short list doesn't make the page
// taller than a laptop window just to fit the map.
// `isolate` keeps Leaflet's high z-index panes from covering the sort menu.
export function PpiMap({ label, loadingLabel, ...canvas }: PpiMapProps) {
  return (
    <aside
      aria-label={label}
      className="box-border w-[420px] shrink-0 self-stretch min-h-[320px] bg-[#DCEEFB] [border:1px_solid_#E2E8F0] rounded-[20px] overflow-hidden relative isolate"
    >
      {/* A visual placeholder under the map while Leaflet loads; the tiles cover it once they arrive. */}
      <p aria-hidden="true" className="text-[13px]/[normal] box-border absolute inset-0 flex justify-center items-center text-[#5B6B7C] font-inter font-normal">
        {loadingLabel}
      </p>
      <PpiMapCanvas {...canvas} />
    </aside>
  )
}
