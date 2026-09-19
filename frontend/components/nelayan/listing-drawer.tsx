import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { DetailRow, DetailValue } from '@/components/nelayan/detail-row'
import { LISTING_PATH, mapHref, type ActiveListing, type LISTING_DRAWER } from '@/components/nelayan/listing-content'
import { OUTLINE_HOVER, PRESS, SOLID_HOVER } from '@/components/ui/interaction'

type ListingDrawerProps = {
  listing: ActiveListing
  labels: typeof LISTING_DRAWER
  // Where "Batalkan listing" goes: the same drawer with the confirmation dialog over it.
  cancelHref: string
}

// Chip styles by grade condition, at the drawer's 12px Poppins (the cards use 13px Inter).
const GRADE_CHIPS = {
  live: { chip: 'bg-[#E8F8F2]', icon: 'leaf', fill: '#17704A', text: 'text-[#17704A]' },
  dead: { chip: 'bg-[#F7F9FC] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px]', icon: 'snowflake', fill: '#5B6B7C', text: 'text-[#0B3B5C]' },
} as const

// Beyond this many photos, the last thumbnail slot becomes a "+N" tile.
const THUMB_SLOTS = 3

// "Detail Listing Drawer". The export places it at left-[1060px] top-[94px], 380×1086px, in a 1440×1180 frame; here
// it's pinned to the right of the area under the header and runs its full height. The page pads the grid by 412px
// (380px + the 32px gutter) while it's open. The actions footer is sticky, so on windows shorter than the page it
// stays on screen; overflow-clip (not hidden) so the aside doesn't become the footer's scroll container.
export function ListingDrawer({ listing, labels, cancelHref }: ListingDrawerProps) {
  const { image, category, location, statusLabel, grade, weight, pricePerKg, detail } = listing
  const gradeChip = GRADE_CHIPS[grade.condition]
  const thumbs = detail.photos.length > THUMB_SLOTS ? detail.photos.slice(0, THUMB_SLOTS - 1) : detail.photos
  const hiddenPhotos = detail.photos.length - thumbs.length

  return (
    <aside
      aria-labelledby="listing-drawer-title"
      className="box-border w-[380px] [box-shadow:-12px_0px_32px_0px_#0B3B5C14] absolute right-0 top-0 bottom-0 flex flex-col gap-0 justify-start items-start bg-[#FFFFFF] [border-width:0px_0px_0px_1px] [border-style:solid] [border-color:#E2E8F0] overflow-clip [z-index:3] motion-safe:animate-fade-in"
    >
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[20px_24px] justify-between items-center [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#E2E8F0]">
        <h2 id="listing-drawer-title" className="text-[20px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">
          {labels.title}
        </h2>
        <Link
          href={LISTING_PATH}
          aria-label={labels.closeLabel}
          className={`box-border w-[40px] shrink-0 h-[40px] flex flex-row gap-0 justify-center items-center bg-[#F7F9FC] hover:bg-[#E3F0F9] rounded-[999px] ${PRESS} ${FOCUS_RING}`}
        >
          <Icon name="x" fill="#0B3B5C" className="box-border w-[20px] shrink-0 h-[20px]" />
        </Link>
      </div>
      <div className="box-border w-full [flex:1_1_0] flex flex-col gap-[16px] p-[24px] justify-start items-start">
        <div className="box-border w-full h-[160px] shrink-0 [border:1px_solid_#0000001A] rounded-[12px] overflow-hidden relative">
          <Image src={image.src} alt={image.alt} fill sizes="332px" className="object-cover object-center" />
        </div>
        <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[8px] justify-start items-start">
          <div className="box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] justify-start items-start">
            <span className="box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] p-[4px_10px] justify-start items-center bg-[#DCEEFB] rounded-[999px]">
              <span className="text-[12px]/[normal] box-border text-[#0F6CB8] font-poppins font-semibold text-left [white-space:nowrap]">{statusLabel}</span>
            </span>
            <span className={`box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] p-[4px_10px] justify-start items-center ${gradeChip.chip} rounded-[999px]`}>
              <Icon name={gradeChip.icon} fill={gradeChip.fill} className="box-border w-[14px] shrink-0 h-[14px]" />
              <span className={`text-[12px]/[normal] box-border ${gradeChip.text} font-poppins font-semibold text-left [white-space:nowrap]`}>{grade.label}</span>
            </span>
          </div>
          <h3 className="text-[18px]/[23px] box-border w-full text-[#0B3B5C] font-poppins font-semibold text-left">{category}</h3>
          <p className="text-[14px]/[21px] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">{detail.description}</p>
        </div>
        <dl className="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] p-[12px_14px] justify-start items-start bg-[#F7F9FC] rounded-[12px]">
          <DrawerMetric label={labels.metricLabels.weight} value={weight} />
          <DrawerMetric label={labels.metricLabels.pricePerKg} value={pricePerKg} />
          <DrawerMetric label={labels.metricLabels.timeLeft} value={detail.timeLeft} />
        </dl>
        <DetailRow
          icon="map-pin"
          label={labels.locationLabel}
          trailing={
            <a
              href={mapHref(location)}
              className={`text-[13px]/[normal] box-border text-[#0F6CB8] hover:underline font-poppins font-semibold text-left [white-space:nowrap] rounded-[4px] ${FOCUS_RING}`}
            >
              {labels.mapLabel}
            </a>
          }
        >
          <DetailValue>{location}</DetailValue>
        </DetailRow>
        {/* These rows carry the design's chevron, but what they open isn't designed yet, so they stay static. */}
        <DetailRow icon="scan-eye" label={labels.freshnessLabel}>
          <DetailValue>{detail.freshness}</DetailValue>
        </DetailRow>
        <DetailRow icon="recycle" label={labels.usageLabel}>
          <DetailValue>{detail.usage}</DetailValue>
        </DetailRow>
        <DetailRow icon="images" label={labels.photosLabel}>
          <div className="box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] p-[4px_0px_0px_0px] justify-start items-start">
            {thumbs.map((photo, index) => (
              <div key={index} className="box-border w-[56px] shrink-0 h-[44px] [border:1px_solid_#0000001A] rounded-[8px] overflow-hidden relative">
                <Image src={photo.src} alt={photo.alt} fill sizes="56px" className="object-cover object-center" />
              </div>
            ))}
            {hiddenPhotos > 0 && (
              <div className="box-border w-[56px] shrink-0 h-[44px] flex flex-row gap-0 justify-center items-center bg-[#0B3B5C] [border:1px_solid_#0000001A] rounded-[8px]">
                <span className="text-[14px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">
                  +{hiddenPhotos}
                  <span className="sr-only"> {labels.morePhotosLabel}</span>
                </span>
              </div>
            )}
          </div>
        </DetailRow>
      </div>
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[16px_24px_24px_24px] justify-start items-start bg-[#FFFFFF] [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#E2E8F0] sticky bottom-0">
        {/* The export pads both buttons 20px a side (and the Edit icon 12px from its label), which overflows the 332px
            row by 16px once the labels render; 16px sides and an 8px gap make them fit. */}
        <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-start items-start">
          <EditAction {...labels.editAction} />
          <Link
            href={cancelHref}
            className={`box-border [flex:1_1_0] h-fit flex flex-row gap-[8px] p-[14px_16px] justify-center items-center bg-[#C23B35] rounded-[999px] ${SOLID_HOVER} ${PRESS} ${FOCUS_RING}`}
          >
            <Icon name="trash-2" fill="#FFFFFF" className="box-border w-[16px] shrink-0 h-[16px]" />
            <span className="text-[15px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">{labels.cancelLabel}</span>
          </Link>
        </div>
        <p className="text-[12px]/[normal] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">{labels.note}</p>
      </div>
    </aside>
  )
}

const EDIT_BUTTON =
  'box-border [flex:1_1_0] h-fit flex flex-row gap-[8px] p-[13px_16px] justify-center items-center bg-[#FFFFFF] [outline:1.5px_solid_#0F6CB8] [outline-offset:-0.75px] rounded-[999px]'

// A link once an edit screen exists; until then a disabled button, so it doesn't promise a page that isn't there.
function EditAction({ label, href }: { label: string; href?: string }) {
  const content = (
    <>
      <span className="text-[16px]/[normal] box-border text-[#0F6CB8] font-poppins font-semibold text-left [white-space:nowrap]">{label}</span>
      <Icon name="pencil" fill="#0F6CB8" className="box-border w-[18px] shrink-0 h-[18px]" />
    </>
  )
  return href ? (
    <Link href={href} className={`${EDIT_BUTTON} ${OUTLINE_HOVER} ${PRESS} ${FOCUS_RING}`}>
      {content}
    </Link>
  ) : (
    <button type="button" disabled className={`${EDIT_BUTTON} opacity-50 cursor-not-allowed`}>
      {content}
    </button>
  )
}

function DrawerMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="box-border [flex:1_1_0] h-fit flex flex-col gap-[2px] justify-start items-start">
      <dt className="text-[12px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">{label}</dt>
      <dd className="text-[15px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">{value}</dd>
    </div>
  )
}
