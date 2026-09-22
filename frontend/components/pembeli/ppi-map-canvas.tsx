'use client'

import 'leaflet/dist/leaflet.css'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import L from 'leaflet'
import { CircleMarker, MapContainer, Marker, TileLayer } from 'react-leaflet'
import { Icon, iconPath } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'

export type PpiMarker = {
  name: string
  lat: number
  lng: number
  // "3 batch tersedia"
  detail: string
  // Read by screen readers after the callout: what clicking the marker does.
  action: string
  // Where clicking goes: the results filtered to this PPI, or back to all PPIs when it's already picked.
  href: string
  selected: boolean
}

export type PpiMapCanvasProps = {
  markers: PpiMarker[]
  labels: {
    zoomIn: string
    zoomOut: string
    locate: string
    locating: string
    locateError: string
  }
  tiles: { url: string; attribution: string }
}

const MIN_ZOOM = 4
const MAX_ZOOM = 16
const FIT = { padding: [72, 72] as L.PointTuple, maxZoom: 9 }
// Framed when the filters leave no PPI with available batches.
const INDONESIA: L.LatLngBoundsLiteral = [
  [-11, 95],
  [6, 141],
]

const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`)

// The design's "Marker": a white callout over a map-pin. Leaflet draws markers from an HTML string, so it's built
// here with the same classes; the zero-size icon puts the pin's tip exactly on the PPI. The design shows two
// far-apart callouts at all times; with every PPI on the map, nearby ones (Tanjung Priok, Cilacap, Benoa) would
// overlap, so a callout shows on hover, keyboard focus or when its PPI is picked. A picked PPI gets the 2px blue
// outline the listing cards use when selected. Screen readers get the name, count and action from the sr-only text.
function markerIcon({ name, detail, action, selected }: PpiMarker) {
  const callout = selected
    ? 'opacity-100 [outline:2px_solid_#0F6CB8] [outline-offset:-1px]'
    : 'opacity-0 pointer-events-none motion-safe:translate-y-[4px] group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-visible:opacity-100 group-focus-visible:translate-y-0'
  return L.divIcon({
    className: 'group outline-hidden',
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    html: `<div class="absolute left-0 bottom-0 -translate-x-1/2 flex flex-col gap-[6px] justify-start items-center">
      <span class="sr-only">${escapeHtml(action)}</span>
      <div aria-hidden="true" class="box-border w-fit h-fit shrink-0 [box-shadow:0px_4px_14px_0px_#0B3B5C26] flex flex-col gap-[1px] p-[8px_12px] justify-start items-start bg-[#FFFFFF] ${callout} rounded-[10px] transition-[opacity,translate] duration-150 ease-out group-focus-visible:[box-shadow:0px_0px_0px_2px_#FFFFFF,_0px_0px_0px_4px_#0F6CB8]">
        <span class="text-[13px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">${escapeHtml(name)}</span>
        <span class="text-[12px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">${escapeHtml(detail)}</span>
      </div>
      <svg viewBox="0 0 13.99993896484375 14" aria-hidden="true" class="box-border w-[32px] h-[32px] shrink-0"><path d="${iconPath('map-pin')}" fill="${selected ? '#0B3B5C' : '#0F6CB8'}"/></svg>
    </div>`,
  })
}

type LocateState = 'idle' | 'locating' | 'error'

export function PpiMapCanvas({ markers, labels, tiles }: PpiMapCanvasProps) {
  const router = useRouter()
  const [map, setMap] = useState<L.Map | null>(null)
  const [zoom, setZoom] = useState<number | null>(null)
  const [locateState, setLocateState] = useState<LocateState>('idle')
  const [myLocation, setMyLocation] = useState<L.LatLng | null>(null)

  // Frame every PPI on first load; the bounds are only read once by MapContainer.
  const allBounds = useMemo(
    () => L.latLngBounds(markers.length > 0 ? markers.map(({ lat, lng }): L.LatLngTuple => [lat, lng]) : INDONESIA),
    [markers],
  )
  const selected = markers.find((marker) => marker.selected)

  useEffect(() => {
    if (!map) return
    const onZoom = () => setZoom(map.getZoom())
    const onFound = (event: L.LocationEvent) => {
      setMyLocation(event.latlng)
      setLocateState('idle')
    }
    const onError = () => setLocateState('error')
    onZoom()
    map.on('zoomend', onZoom)
    map.on('locationfound', onFound)
    map.on('locationerror', onError)
    return () => {
      map.off('zoomend', onZoom)
      map.off('locationfound', onFound)
      map.off('locationerror', onError)
    }
  }, [map])

  // Picking a PPI flies to it; clearing the pick frames them all again.
  const selectedName = selected?.name
  useEffect(() => {
    if (!map) return
    if (selected) map.flyTo([selected.lat, selected.lng], Math.max(map.getZoom(), 8))
    else map.flyToBounds(allBounds, FIT)
    // Only when the pick changes, not on every render of the same pick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, selectedName])

  const locate = () => {
    if (!map) return
    setLocateState('locating')
    map.locate({ setView: true, maxZoom: 11, timeout: 10000 })
  }

  const status = locateState === 'locating' ? labels.locating : locateState === 'error' ? labels.locateError : ''

  return (
    <>
      <MapContainer
        ref={setMap}
        bounds={allBounds}
        boundsOptions={FIT}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        zoomControl={false}
        scrollWheelZoom={false}
        className="absolute inset-0 [z-index:0] bg-[#DCEEFB] font-inter"
      >
        <TileLayer url={tiles.url} attribution={tiles.attribution} />
        {markers.map((marker) => (
          <Marker
            key={marker.name}
            position={[marker.lat, marker.lng]}
            icon={markerIcon(marker)}
            zIndexOffset={marker.selected ? 1000 : 0}
            eventHandlers={{
              // Markers aren't <Link>s, so nothing prefetches their view; warm it on hover, as a link would.
              mouseover: () => router.prefetch(marker.href),
              click: () => router.push(marker.href, { scroll: false }),
              // Leaflet makes markers focusable buttons but only clicks them with a mouse; Enter and Space do it here.
              keydown: ({ originalEvent }: L.LeafletKeyboardEvent) => {
                if (originalEvent.key !== 'Enter' && originalEvent.key !== ' ') return
                originalEvent.preventDefault()
                router.push(marker.href, { scroll: false })
              },
            }}
          />
        ))}
        {myLocation && (
          <CircleMarker
            center={myLocation}
            radius={8}
            interactive={false}
            pathOptions={{ color: '#FFFFFF', weight: 3, fillColor: '#0F6CB8', fillOpacity: 1 }}
          />
        )}
      </MapContainer>
      <p
        role="status"
        className={`box-border absolute left-[16px] right-[72px] bottom-[16px] [z-index:1000] ${status ? 'p-[8px_12px]' : ''} bg-[#FFFFFF] [box-shadow:0px_2px_8px_0px_#0B3B5C1F] rounded-[10px] text-[13px]/[19px] text-[#0B3B5C] font-inter font-normal empty:hidden`}
      >
        {status}
      </p>
      <div className="box-border w-fit h-fit absolute right-[16px] bottom-[60px] flex flex-col gap-[10px] justify-start items-start [z-index:1000]">
        <div className="box-border w-fit h-fit shrink-0 [box-shadow:0px_2px_8px_0px_#0B3B5C1F] flex flex-col gap-0 justify-start items-start bg-[#FFFFFF] rounded-[10px]">
          <MapButton
            label={labels.zoomIn}
            icon="plus"
            onClick={() => map?.zoomIn()}
            disabled={!map || zoom === null || zoom >= MAX_ZOOM}
            className="rounded-[10px_10px_0px_0px] [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#E2E8F0]"
          />
          <MapButton
            label={labels.zoomOut}
            icon="minus"
            onClick={() => map?.zoomOut()}
            disabled={!map || zoom === null || zoom <= MIN_ZOOM}
            className="rounded-[0px_0px_10px_10px]"
          />
        </div>
        <MapButton
          label={labels.locate}
          icon="locate-fixed"
          onClick={locate}
          disabled={!map || locateState === 'locating'}
          className="[box-shadow:0px_2px_8px_0px_#0B3B5C1F] bg-[#FFFFFF] rounded-[10px]"
        />
      </div>
    </>
  )
}

type MapButtonProps = {
  label: string
  icon: 'plus' | 'minus' | 'locate-fixed'
  onClick: () => void
  disabled: boolean
  className: string
}

function MapButton({ label, icon, onClick, disabled, className }: MapButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`box-border w-[44px] h-[44px] lg:w-[40px] lg:h-[40px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#FFFFFF] hover:bg-[#F3FAFF] cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[#FFFFFF] ${className} ${FOCUS_RING}`}
    >
      <Icon name={icon} fill="#0B3B5C" className="box-border w-[18px] shrink-0 h-[18px]" />
    </button>
  )
}
