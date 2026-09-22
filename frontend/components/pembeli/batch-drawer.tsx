import Link from 'next/link'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { ModalDialog } from '@/components/nelayan/modal-dialog'
import { PhotoCarousel } from '@/components/pembeli/photo-carousel'
import { PpiMiniMap } from '@/components/pembeli/ppi-mini-map'
import { BuyButton } from '@/components/pembeli/buy-button'
import { DetailChip, DetailSection } from '@/components/pembeli/detail-section'
import { useTranslations } from 'next-intl'
import { marketplaceCopy, PPI_LOCATIONS } from '@/components/pembeli/marketplace-content'
import type { Batch } from '@/lib/marketplace/batches'
import { PRESS, PRESS_WIDE, SOLID_HOVER } from '@/components/ui/interaction'

type BatchDrawerProps = {
  batch: Batch
  // The marketplace view behind the drawer, which close, Escape and a click on the scrim go back to.
  closeHref: string
  // "Lihat batch serupa" on a sold batch: the same category in the marketplace.
  similarHref: string
  // Receives the form, with the batch's slug in `slug`.
  buyAction: (formData: FormData) => void | Promise<void>
}

const TITLE_ID = 'batch-drawer-title'

// "Detail Drawer": a 480px panel docked right over the marketplace, on the "Scrim". It's a native modal <dialog>
// (see ModalDialog), so the page behind is inert and focus starts on the close button. On phones it fills the width;
// from sm it is the 480px panel, so the layout inside goes back to the design at sm and only tap targets wait for lg. The export fixes it at the
// 1440×1024 frame's height; here it takes the window's height, the body scrolls and the buy footer stays put.
export function BatchDrawer({ batch, closeHref, similarHref, buyAction }: BatchDrawerProps) {
  const { BATCH_DRAWER, CATEGORIES, CONDITIONS, PPI_MAP } = marketplaceCopy(
    useTranslations('dashboard.pembeli.marketplace'),
    useTranslations('common.category'),
  )
  const { detail } = batch
  const condition = CONDITIONS[detail.condition]
  // A category the marketplace doesn't list falls back to the batch's own name.
  const category = CATEGORIES.find(({ value }) => value === batch.category)?.label ?? batch.name
  const location = PPI_LOCATIONS[batch.location]
  const sold = batch.status === 'sold'

  return (
    <ModalDialog
      closeHref={closeHref}
      labelledBy={TITLE_ID}
      dismissOnBackdrop
      className="m-0 ms-auto w-full sm:w-[480px] h-dvh max-h-dvh [box-shadow:-24px_0px_48px_0px_#0B3B5C40] motion-safe:animate-fade-in"
    >
      <div className="box-border w-full h-full flex flex-col gap-0 justify-start items-start bg-[#FFFFFF] overflow-hidden">
        <header className="box-border w-full h-fit shrink-0 flex flex-row gap-[16px] p-[16px_16px_12px_16px] sm:p-[24px_24px_16px_24px] justify-start items-start">
          <div className="box-border [flex:1_1_0] h-fit flex flex-col gap-[8px] justify-start items-start">
            <DetailChip icon="fish" label={category} size="sm" />
            <h2 id={TITLE_ID} className="text-[24px]/[29px] box-border w-full text-[#0B3B5C] font-poppins font-bold text-left">
              {batch.name}
            </h2>
            <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-[10px] p-[8px_14px_8px_8px] justify-start items-center bg-[#DCEEFB] rounded-[16px]">
              <div className="box-border w-[36px] shrink-0 h-[36px] flex flex-row gap-0 justify-center items-center bg-[#FFFFFF] rounded-[999px]">
                <Icon name={condition.icon} fill="#0F6CB8" className="box-border w-[18px] shrink-0 h-[18px]" />
              </div>
              <p className="box-border w-fit shrink-0 h-fit flex flex-col gap-0 justify-start items-start">
                <span className="text-[12px]/[normal] box-border text-[#0F6CB8] font-inter font-normal text-left [white-space:nowrap]">
                  {BATCH_DRAWER.gradeLabel}
                </span>
                <span className="text-[22px]/[24px] box-border text-[#0F5C82] font-poppins font-bold text-left [white-space:nowrap]">{batch.grade}</span>
              </p>
            </div>
          </div>
          <Link
            href={closeHref}
            scroll={false}
            aria-label={BATCH_DRAWER.closeLabel}
            className={`box-border w-[44px] shrink-0 h-[44px] lg:w-[40px] lg:h-[40px] flex flex-row gap-0 justify-center items-center bg-[#F7F9FC] hover:bg-[#E3F0F9] rounded-[999px] ${PRESS} ${FOCUS_RING}`}
          >
            <Icon name="x" fill="#0B3B5C" className="box-border w-[20px] shrink-0 h-[20px]" />
          </Link>
        </header>
        <div className="box-border w-full [flex:1_1_0] min-h-0 flex flex-col gap-[14px] p-[0px_16px_16px_16px] sm:p-[0px_24px_16px_24px] justify-start items-start overflow-y-auto overscroll-contain">
          <PhotoCarousel
            label={batch.name}
            photos={detail.photos}
            prevLabel={BATCH_DRAWER.photoPrevLabel}
            nextLabel={BATCH_DRAWER.photoNextLabel}
            counterLabels={detail.photos.map((_, index) => BATCH_DRAWER.photoCounter(index + 1, detail.photos.length))}
          />
          <dl className="box-border w-full h-fit shrink-0 flex flex-col sm:flex-row gap-[12px] sm:gap-0 p-[4px_0px] justify-start items-stretch sm:items-start">
            <KeyFigure icon="package" label={BATCH_DRAWER.weightLabel} value={batch.weight} />
            <KeyFigure icon="wallet" label={BATCH_DRAWER.totalLabel} value={batch.totalPrice} sub={batch.price} divided />
          </dl>
          <DetailSection icon={condition.icon} title={BATCH_DRAWER.conditionTitle}>
            <div className="box-border w-full h-fit shrink-0 flex flex-row flex-wrap gap-[8px] justify-start items-start">
              <DetailChip icon={condition.icon} label={condition.label} />
              <DetailChip icon="clock-3" label={detail.caught} />
              {detail.auctionLeft && <DetailChip icon="timer" label={BATCH_DRAWER.auctionLeft(detail.auctionLeft)} />}
            </div>
          </DetailSection>
          <DetailSection
            icon="map-pin"
            title={BATCH_DRAWER.locationTitle}
            aside={location && <PpiMiniMap lat={location.lat} lng={location.lng} tiles={PPI_MAP.tiles} />}
          >
            <p className="text-[14px]/[normal] box-border text-[#0F5C82] font-poppins font-semibold text-left sm:[white-space:nowrap]">{batch.location}</p>
            {/* Only shown once both PPIs have coordinates — see distanceFrom in lib/marketplace/batches.ts. */}
            {batch.distanceKm !== null && (
              <p className="text-[13px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left sm:[white-space:nowrap]">
                {BATCH_DRAWER.distance(batch.distanceKm)}
              </p>
            )}
          </DetailSection>
          <DetailSection icon="recycle" title={BATCH_DRAWER.usageTitle}>
            <p className="text-[14px]/[21px] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">{detail.usage}</p>
          </DetailSection>
          <DetailSection icon="info" title={BATCH_DRAWER.infoTitle}>
            <dl className="contents">
              <InfoRow label={BATCH_DRAWER.infoLabels.fisherman} value={detail.fisherman} />
              <InfoRow label={BATCH_DRAWER.infoLabels.method} value={detail.method} />
              <InfoRow label={BATCH_DRAWER.infoLabels.batchNumber} value={detail.batchNumber} />
            </dl>
          </DetailSection>
        </div>
        <footer className="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[16px] sm:p-[16px_24px_24px_24px] justify-start items-start bg-[#FFFFFF] [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#E2E8F0]">
          {sold ? (
            <>
              <div role="alert" className="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] p-[16px] justify-start items-start bg-[#FFF4E0] rounded-[14px]">
                <Icon name="circle-alert" fill="#8A5100" className="box-border w-[20px] shrink-0 h-[20px]" />
                <div className="box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] justify-start items-start">
                  <p className="text-[15px]/[normal] box-border text-[#8A5100] font-poppins font-semibold text-left [white-space:nowrap]">
                    {BATCH_DRAWER.soldOut.title}
                  </p>
                  <p className="text-[13px]/[19px] box-border w-full text-[#0B3B5C] font-inter font-normal text-left">
                    {BATCH_DRAWER.soldOut.body(category)}
                  </p>
                </div>
              </div>
              <Link
                href={similarHref}
                scroll={false}
                className={`group box-border w-full h-[52px] shrink-0 [box-shadow:0px_8px_20px_0px_#0F6CB840] flex flex-row gap-[12px] p-[0px_24px] justify-center items-center [background-image:linear-gradient(90deg,_#0F6CB8_0%,_#0F5C82_100%)] bg-no-repeat bg-[length:100%_100%] rounded-[999px] ${SOLID_HOVER} ${PRESS_WIDE} ${FOCUS_RING}`}
              >
                <span className="text-[16px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">
                  {BATCH_DRAWER.soldOut.action}
                </span>
                <Icon name="arrow-right" fill="#FFFFFF" className="box-border w-[18px] shrink-0 h-[18px]" />
              </Link>
            </>
          ) : (
            <form action={buyAction} className="box-border w-full h-fit shrink-0 flex flex-col gap-[10px] justify-start items-start">
              <input type="hidden" name="slug" value={batch.slug} />
              <BuyButton label={BATCH_DRAWER.buyLabel(batch.totalPrice)} processingLabel={BATCH_DRAWER.processingLabel} />
              <p className="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-start">
                <Icon name="message-circle" fill="#5B6B7C" className="box-border w-[14px] shrink-0 h-[14px] mt-[2px]" />
                <span className="text-[12px]/[18px] box-border [flex:1_1_0] text-[#5B6B7C] font-inter font-normal text-left">
                  {BATCH_DRAWER.buyNote}
                </span>
              </p>
            </form>
          )}
        </footer>
      </div>
    </ModalDialog>
  )
}

type KeyFigureProps = {
  icon: 'package' | 'wallet'
  label: string
  value: string
  sub?: string
  // The second figure has a hairline and 16px of space on its left.
  divided?: boolean
}

function KeyFigure({ icon, label, value, sub, divided }: KeyFigureProps) {
  return (
    <div
      className={`box-border [flex:1_1_0] h-fit flex flex-row gap-[12px] justify-start items-start ${divided ? 'p-[12px_0px_0px_0px] sm:p-[0px_0px_0px_16px] [border-width:1px_0px_0px_0px] sm:[border-width:0px_0px_0px_1px] [border-style:solid] [border-color:#E2E8F0]' : ''}`}
    >
      <div className="box-border w-[40px] shrink-0 h-[40px] flex flex-row gap-0 justify-center items-center bg-[#F3FAFF] rounded-[999px]">
        <Icon name={icon} fill="#0F6CB8" className="box-border w-[20px] shrink-0 h-[20px]" />
      </div>
      <div className="box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start">
        <dt className="text-[12px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">{label}</dt>
        <dd className="text-[24px]/[28px] box-border text-[#0B3B5C] font-poppins font-bold text-left [white-space:nowrap]">{value}</dd>
        {sub && <dd className="text-[13px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">{sub}</dd>}
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-start items-start">
      <dt className="text-[13px]/[normal] box-border w-[104px] sm:w-[130px] shrink-0 text-[#5B6B7C] font-inter font-normal text-left">{label}</dt>
      <dd className="text-[13px]/[normal] box-border [flex:1_1_0] text-[#0B3B5C] font-inter font-medium text-left">{value}</dd>
    </div>
  )
}
