'use client'

import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer } from 'react-leaflet'
import { Icon } from '@/components/ui/icon'

type PpiMiniMapCanvasProps = {
  lat: number
  lng: number
  tiles: { url: string; attribution: string }
}

// A still map: no dragging, zooming or keyboard, and a smaller attribution so it fits the 140px thumbnail.
export function PpiMiniMapCanvas({ lat, lng, tiles }: PpiMiniMapCanvasProps) {
  return (
    <>
      <MapContainer
        center={[lat, lng]}
        zoom={11}
        zoomControl={false}
        dragging={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        touchZoom={false}
        boxZoom={false}
        keyboard={false}
        className="absolute inset-0 [z-index:0] bg-[#DCEEFB] [&_.leaflet-control-attribution]:text-[7px]/[10px] [&_.leaflet-control-attribution]:p-[0px_3px]"
      >
        <TileLayer url={tiles.url} attribution={tiles.attribution} />
      </MapContainer>
      <Icon
        name="map-pin"
        fill="#0F6CB8"
        className="box-border w-[26px] h-[26px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full [z-index:1000]"
      />
    </>
  )
}
