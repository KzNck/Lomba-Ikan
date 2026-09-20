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
  // "A1" … "B3"; the letter picks the badge colour. "—" for a catch the AI has not graded.
  grade: string
  status: keyof typeof STATUS_STYLES
  statusLabel: string
  weight: string
  distance: string
  location: string
  price: string
  // Marketplace only: the whole batch at that price, e.g. "Total Rp 576.000".
  total?: string
  // Dashboard: "Lihat detail" while active, "Lihat serupa" once sold. Marketplace: "Beli sekarang", or "Stok habis"
  // once sold, which renders as a disabled button.
  actionLabel: string
}

type ProductCardProps = ProductCardContent & {
  variant?: keyof typeof VARIANTS
  // Load the photo straight away: for cards in the first row, which are on screen at load.
  eager?: boolean
}

const GRADE_STYLES = {
  A: { badge: 'bg-[#E8F8F2]', text: 'text-[#17704A]' },
  B: { badge: 'bg-[#DCEEFB]', text: 'text-[#0F6CB8]' },
}

// Anything that isn't grade A — including an ungraded catch — takes B's neutral badge.
const gradeStyle = (grade: string) => GRADE_STYLES[grade[0] as keyof typeof GRADE_STYLES] ?? GRADE_STYLES.B

// The badge prints the grade alone, so the accessible name has to supply the rest.
export const gradeName = (grade: string) =>
  /^[AB]\d$/.test(grade) ? `Grade ${grade}` : 'Grade belum dinilai'

const STATUS_STYLES = {
  active: { badge: 'bg-[#E8F8F2]', text: 'text-[#17704A]' },
  sold: { badge: 'bg-[#E2E8F0]', text: 'text-[#0B3B5C]' },
}

// The dashboard's fixed 230px recommendation tile, or the marketplace's grid card: a third of the row, 8px gaps, a
// darker favourite disc and a cart on the action.
const VARIANTS = {
  recommendation: { card: 'w-[230px] shrink-0 gap-[10px]', favorite: 'bg-[#0B3B5C40]', actionIcon: 'arrow-right', sizes: '206px' },
  marketplace: { card: '[flex:1_1_0] min-w-0 gap-[8px]', favorite: 'bg-[#0B3B5C99]', actionIcon: 'shopping-cart', sizes: '240px' },
} as const

// One batch tile. The export paints the photo as a CSS background; it's a next/image here, with the
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
  total,
  actionLabel,
  variant = 'recommendation',
  eager = false,
}: ProductCardProps) {
  const gradeTone = gradeStyle(grade)
  const statusStyle = STATUS_STYLES[status]
  const style = VARIANTS[variant]
  // A sold batch can't be bought, so the marketplace swaps its link for a disabled "Stok habis".
  const soldOut = variant === 'marketplace' && status === 'sold'

  return (
    <article
      className={`box-border ${style.card} h-fit [box-shadow:0px_4px_16px_0px_#0B3B5C0F] flex flex-col p-[12px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[16px] ${CARD_LIFT}`}
    >
      <div className="box-border w-full h-[124px] shrink-0 flex flex-col gap-0 p-[8px] justify-between items-start [border:1px_solid_#0000001A] rounded-[4px] overflow-hidden relative">
        <Image src={image.src} alt={image.alt} fill sizes={style.sizes} loading={eager ? 'eager' : undefined} className="object-cover object-center" />
        {/* Favourite toggle from the design; not wired up yet, so it's shown but not interactive. */}
        <div className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-end items-start relative">
          <span aria-hidden="true" className={`box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center ${style.favorite} rounded-[999px]`}>
            <Icon name="heart" fill="#FFFFFF" className="box-border w-[16px] shrink-0 h-[16px]" />
          </span>
        </div>
        <div className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center relative">
          <span
            aria-label={gradeName(grade)}
            className={`box-border w-fit shrink-0 h-[22px] flex flex-row gap-0 p-[0px_8px] justify-center items-center ${gradeTone.badge} rounded-[999px]`}
          >
            <span
              aria-hidden="true"
              className={`text-[12px]/[normal] box-border ${gradeTone.text} font-poppins font-semibold text-left [white-space:nowrap]`}
            >
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
      {total && <p className="text-[13px]/[normal] box-border text-[#5B6B7C] font-inter font-medium text-left [white-space:nowrap]">{total}</p>}
      {soldOut ? (
        <button
          type="button"
          disabled
          className="box-border w-full h-[36px] shrink-0 flex flex-row gap-[6px] justify-center items-center bg-[#F7F9FC] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[999px] cursor-not-allowed"
        >
          <span className="text-[13px]/[normal] box-border text-[#5B6B7C] font-poppins font-semibold text-left [white-space:nowrap]">{actionLabel}</span>
          <Icon name="ban" fill="#5B6B7C" className="box-border w-[14px] shrink-0 h-[14px]" />
        </button>
      ) : (
        <Link
          href={href}
          aria-label={`${actionLabel} ${name}`}
          className={`group box-border w-full h-[36px] shrink-0 flex flex-row gap-[6px] justify-center items-center bg-[#F3FAFF] [outline:1px_solid_#DCEEFB] [outline-offset:-0.5px] rounded-[999px] ${PRESS_WIDE} ${FOCUS_RING}`}
        >
          <span className="text-[13px]/[normal] box-border text-[#0F6CB8] font-poppins font-semibold text-left [white-space:nowrap]">{actionLabel}</span>
          <Icon
            name={style.actionIcon}
            fill="#0F6CB8"
            className={`box-border w-[14px] shrink-0 h-[14px] ${style.actionIcon === 'arrow-right' ? ARROW_NUDGE_RIGHT : ''}`}
          />
        </Link>
      )}
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
