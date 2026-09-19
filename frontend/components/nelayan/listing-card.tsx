import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import type { ImageContent } from '@/components/home/hero'
import { ARROW_NUDGE_RIGHT, CARD_LIFT, OUTLINE_HOVER, PRESS_WIDE } from '@/components/ui/interaction'

export type ListingCardContent = {
  href: string
  image: ImageContent
  category: string
  location: string
  status: keyof typeof STATUS_STYLES
  statusLabel: string
  grade: { label: string; condition: keyof typeof GRADE_STYLES }
  weight: string
  pricePerKg: string
  // "Sisa 2 j 15 mnt" while active, "Telah terjual" once sold.
  footer: string
}

type ListingCardProps = ListingCardContent & {
  metricLabels: { weight: string; pricePerKg: string }
  detailLabel: string
}

// Status drives the chip and the footer; condition drives the grade badge.
const STATUS_STYLES = {
  active: {
    chip: 'bg-[#DCEEFB]',
    chipText: 'text-[#0F6CB8]',
    footerIcon: 'timer',
    footerFill: '#5B6B7C',
    footerText: 'text-[#5B6B7C]',
  },
  sold: {
    chip: 'bg-[#E8F8F2]',
    chipText: 'text-[#17704A]',
    footerIcon: 'circle-check',
    footerFill: '#17704A',
    footerText: 'text-[#17704A]',
  },
} as const

const GRADE_STYLES = {
  dead: {
    badge: 'bg-[#F7F9FC] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px]',
    icon: 'snowflake',
    iconFill: '#5B6B7C',
    text: 'text-[#0B3B5C]',
  },
  live: {
    badge: 'bg-[#E8F8F2]',
    icon: 'leaf',
    iconFill: '#17704A',
    text: 'text-[#17704A]',
  },
} as const

// The export fixes the photo at content-box 234.667×131.5px and the footer at 206.667×27.5px (their sizes in a
// three-up row) and adds padding on top; here they fill the card width and take the design's outer heights.
export function ListingCard({
  href,
  image,
  category,
  location,
  status,
  statusLabel,
  grade,
  weight,
  pricePerKg,
  footer,
  metricLabels,
  detailLabel,
}: ListingCardProps) {
  const statusStyle = STATUS_STYLES[status]
  const gradeStyle = GRADE_STYLES[grade.condition]

  return (
    <article
      className={`box-border [flex:1_1_0] self-stretch [box-shadow:0px_0px_0px_1px_#0000000F,_0px_1px_2px_-1px_#0000000F,_0px_2px_4px_0px_#0000000A] flex flex-col gap-0 justify-start items-start bg-[#FFFFFF] rounded-[16px] overflow-hidden ${CARD_LIFT}`}
    >
      <div className="box-border w-full h-[132px] shrink-0 [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#0000001A] [margin:0px_0px_-0.5px_0px] relative">
        <Image src={image.src} alt={image.alt} fill sizes="235px" className="object-cover object-center" />
      </div>
      <div className="box-border w-full [flex:1_1_auto] flex flex-col gap-[14px] p-[14px] justify-start items-start">
        {/* The export nests the location beside the chip, which wraps longer PPI names (e.g. "PPI Karangsong,
            Indramayu") and makes that card taller than its neighbours; under the row it gets the full card width. */}
        <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[2px] justify-start items-start">
          <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-between items-start">
            <h3 className="text-[15px]/[normal] box-border [flex:1_1_0] text-[#0B3B5C] font-poppins font-semibold text-left">{category}</h3>
            <span className={`box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] p-[4px_10px] justify-start items-center ${statusStyle.chip} rounded-[999px]`}>
              <span className={`text-[13px]/[normal] box-border ${statusStyle.chipText} font-inter font-semibold text-left [white-space:nowrap]`}>
                {statusLabel}
              </span>
            </span>
          </div>
          <p className="text-[13px]/[normal] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">{location}</p>
        </div>
        <span className={`box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] p-[4px_10px] justify-start items-center ${gradeStyle.badge} rounded-[999px]`}>
          <Icon name={gradeStyle.icon} fill={gradeStyle.iconFill} className="box-border w-[14px] shrink-0 h-[14px]" />
          <span className={`text-[13px]/[normal] box-border ${gradeStyle.text} font-inter font-semibold text-left [white-space:nowrap]`}>
            {grade.label}
          </span>
        </span>
        <dl className="box-border w-full h-fit shrink-0 flex flex-row gap-[16px] justify-start items-start">
          <Metric label={metricLabels.weight} value={weight} />
          <Metric label={metricLabels.pricePerKg} value={pricePerKg} />
        </dl>
        <div className="box-border w-full h-fit shrink-0 mt-auto flex flex-row gap-[6px] p-[12px_0px_0px_0px] justify-start items-center [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#E2E8F0] [margin:-0.5px_0px_0px_0px]">
          <Icon name={statusStyle.footerIcon} fill={statusStyle.footerFill} className="box-border w-[16px] shrink-0 h-[16px]" />
          <p className={`text-[13px]/[normal] box-border ${statusStyle.footerText} font-inter font-medium text-left [white-space:nowrap]`}>{footer}</p>
        </div>
        <Link
          href={href}
          aria-label={`${detailLabel} ${category}`}
          className={`group box-border w-full h-[40px] shrink-0 flex flex-row gap-[8px] justify-center items-center [outline:1.5px_solid_#0F6CB8] [outline-offset:-0.75px] rounded-[8px] ${OUTLINE_HOVER} ${PRESS_WIDE} ${FOCUS_RING}`}
        >
          <span className="text-[14px]/[normal] box-border text-[#0F6CB8] font-inter font-semibold text-left [white-space:nowrap]">{detailLabel}</span>
          <Icon name="arrow-right" fill="#0F6CB8" className={`box-border w-[16px] shrink-0 h-[16px] ${ARROW_NUDGE_RIGHT}`} />
        </Link>
      </div>
    </article>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="box-border [flex:1_1_0] h-fit flex flex-col gap-[2px] justify-start items-start">
      <dt className="text-[12px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">{label}</dt>
      <dd className="text-[16px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">{value}</dd>
    </div>
  )
}
