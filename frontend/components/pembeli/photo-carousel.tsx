'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import type { ImageContent } from '@/components/home/hero'

type PhotoCarouselProps = {
  label: string
  photos: ImageContent[]
  prevLabel: string
  nextLabel: string
  // "1 / 4" for each photo, worked out on the server (a function can't be passed to this client component).
  counterLabels: string[]
}

// "Photo Carousel": the batch photos, stepped with the round buttons along the bottom. With one photo the controls
// are left out. The export paints the photo as a CSS background; it's a next/image here.
export function PhotoCarousel({ label, photos, prevLabel, nextLabel, counterLabels }: PhotoCarouselProps) {
  const [index, setIndex] = useState(0)
  const photo = photos[index]
  const step = (by: number) => setIndex((current) => (current + by + photos.length) % photos.length)

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      className="box-border w-full h-[172px] shrink-0 flex flex-col gap-0 p-[10px] justify-between items-start [border:1px_solid_#0000001A] rounded-[14px] overflow-hidden relative"
    >
      <Image src={photo.src} alt={photo.alt} fill sizes="432px" loading="eager" className="object-cover object-center [z-index:0]" />
      <div className="box-border w-full h-[1px] shrink-0" />
      {photos.length > 1 && (
        <div className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center relative [z-index:1]">
          <CarouselButton label={prevLabel} icon="chevron-left" onClick={() => step(-1)} />
          <p aria-live="polite" className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_10px] justify-start items-start bg-[#0B3B5CB3] rounded-[999px]">
            <span className="text-[12px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">
              {counterLabels[index]}
            </span>
          </p>
          <CarouselButton label={nextLabel} icon="chevron-right" onClick={() => step(1)} />
        </div>
      )}
    </section>
  )
}

function CarouselButton({ label, icon, onClick }: { label: string; icon: 'chevron-left' | 'chevron-right'; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`box-border w-[44px] shrink-0 h-[44px] lg:w-[36px] lg:h-[36px] flex flex-row gap-0 justify-center items-center bg-[#0B3B5CB3] hover:bg-[#0B3B5C] rounded-[999px] cursor-pointer transition-colors duration-150 ease-out ${FOCUS_RING}`}
    >
      <Icon name={icon} fill="#FFFFFF" className="box-border w-[18px] shrink-0 h-[18px]" />
    </button>
  )
}
