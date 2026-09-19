import Image from 'next/image'
import Link from 'next/link'
import { Icon, type IconName } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import type { ImageContent } from '@/components/home/hero'
import { ARROW_NUDGE_RIGHT, CARD_LIFT, PRESS_WIDE } from '@/components/ui/interaction'

export type ProductCardContent = {
  href: string
  image: ImageContent
  name: string
  // "A1" … "B3"; the letter picks the badge colour.
  grade: `${keyof typeof GRADE_STYLES}${number}`
  status: keyof typeof STATUS_STYLES
  statusLabel: string
  weight: string
  distance: string
  location: string
  price: string
  // "Lihat detail" while active, "Lihat serupa" once sold.
  actionLabel: string
}

const GRADE_STYLES = {
  A: { badge: 'bg-[#E8F8F2]', text: 'text-[#17704A]' },
  B: { badge: 'bg-[#DCEEFB]', text: 'text-[#0F6CB8]' },
}

const STATUS_STYLES = {
  active: { badge: 'bg-[#E8F8F2]', text: 'text-[#17704A]' },
  sold: { badge: 'bg-[#E2E8F0]', text: 'text-[#0B3B5C]' },
}

// One recommendation tile. The export paints the photo as a CSS background; it's a next/image here, with the
// favourite and badge rows stacked above it.
export function ProductCard({
  href,
  image,
  name,
  grade,
  status,
  statusLabel,
  weight,
  distance,
  location,
  price,
  actionLabel,
}: ProductCardContent) {
  const gradeStyle = GRADE_STYLES[grade[0] as keyof typeof GRADE_STYLES]
  const statusStyle = STATUS_STYLES[status]

  return (
    <article
      className={`box-border w-[230px] shrink-0 h-fit [box-shadow:0px_4px_16px_0px_#0B3B5C0F] flex flex-col gap-[10px] p-[12px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[16px] ${CARD_LIFT}`}
    >
      <div className="box-border w-full h-[124px] shrink-0 flex flex-col gap-0 p-[8px] justify-between items-start [border:1px_solid_#0000001A] rounded-[4px] overflow-hidden relative">
        <Image src={image.src} alt={image.alt} fill sizes="206px" className="object-cover object-center" />
        {/* Favourite toggle from the design; not wired up yet, so it's shown but not interactive. */}
        <div className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-end items-start relative">
          <span aria-hidden="true" className="box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#0B3B5C40] rounded-[999px]">
            <Icon name="heart" fill="#FFFFFF" className="box-border w-[16px] shrink-0 h-[16px]" />
          </span>
        </div>
        <div className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center relative">
          <span className={`box-border w-fit shrink-0 h-[22px] flex flex-row gap-0 p-[0px_8px] justify-center items-center ${gradeStyle.badge} rounded-[999px]`}>
            <span className={`text-[12px]/[normal] box-border ${gradeStyle.text} font-poppins font-semibold text-left [white-space:nowrap]`}>
              {grade}
            </span>
          </span>
          <span className={`box-border w-fit shrink-0 h-[22px] flex flex-row gap-0 p-[0px_8px] justify-start items-center ${statusStyle.badge} rounded-[999px]`}>
            <span className={`text-[12px]/[normal] box-border ${statusStyle.text} font-poppins font-semibold text-left [white-space:nowrap]`}>
              {statusLabel}
            </span>
          </span>
        </div>
      </div>
      <h3 className="text-[15px]/[20px] box-border w-full text-[#0B3B5C] font-poppins font-semibold text-left">{name}</h3>
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[6px] justify-start items-start">
        <div className="box-border w-fit h-fit shrink-0 flex flex-row gap-[14px] justify-start items-center">
          <Meta icon="package" value={weight} />
          <Meta icon="navigation" value={distance} />
        </div>
        <Meta icon="map-pin" value={location} />
      </div>
      <p className="text-[18px]/[normal] box-border text-[#0B3B5C] font-poppins font-bold text-left [white-space:nowrap]">{price}</p>
      <Link
        href={href}
        aria-label={`${actionLabel} ${name}`}
        className={`group box-border w-full h-[36px] shrink-0 flex flex-row gap-[6px] justify-center items-center bg-[#F3FAFF] [outline:1px_solid_#DCEEFB] [outline-offset:-0.5px] rounded-[999px] ${PRESS_WIDE} ${FOCUS_RING}`}
      >
        <span className="text-[13px]/[normal] box-border text-[#0F6CB8] font-poppins font-semibold text-left [white-space:nowrap]">{actionLabel}</span>
        <Icon name="arrow-right" fill="#0F6CB8" className={`box-border w-[14px] shrink-0 h-[14px] ${ARROW_NUDGE_RIGHT}`} />
      </Link>
    </article>
  )
}

function Meta({ icon, value }: { icon: IconName; value: string }) {
  return (
    <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center">
      <Icon name={icon} fill="#7F8FA4" className="box-border w-[13px] shrink-0 h-[13px]" />
      <span className="text-[12px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">{value}</span>
    </div>
  )
}
