import Link from 'next/link'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { PRESS, SOLID_HOVER } from '@/components/ui/interaction'
import { ScrollLock } from '@/components/ui/scroll-lock'
import { ModalHeader } from '@/components/nelayan/modal-header'
import { GradePanel, type FreshnessResult, type UngradedState } from '@/components/nelayan/grade-panel'
import { UsageOption, type UsageOptionContent } from '@/components/nelayan/usage-option'
import { PriceField } from '@/components/nelayan/price-field'
import { SubmitButton } from '@/components/register/submit-button'
import type { FreshnessModalContent, GradePanelContent, PriceFieldContent } from '@/components/nelayan/freshness-content'

type FreshnessModalProps = {
  modal: FreshnessModalContent
  // The catch being published, submitted with the form as `id`.
  catchId: string
  result: FreshnessResult
  // Set when the catch has no grade yet (see GradePanel).
  ungraded?: UngradedState
  gradePanel: GradePanelContent
  recommendations: { title: string; subtitle: string; options: UsageOptionContent[] }
  price: PriceFieldContent
  // Receives the form, including the optional price.
  action: (formData: FormData) => void | Promise<void>
  // Set when the fisher has no WhatsApp number: publishing is refused, so the footer says why and links to Akun.
  phoneMissing?: { message: string; action: { href: string; label: string } }
}

// The "Overlay" + "Modal Hasil Kesegaran" layers, shown once the catch photo has been graded. Like CatchModal, the
// scrim is fixed to the viewport (the export pins it to the 1440×1100 frame) and scrolls if the modal outgrows it.
// From lg the spacing is tighter than the export's, so the whole result fits a laptop window (about 720px tall)
// without scrolling; the card is centred vertically and only scrolls on shorter windows.
export function FreshnessModal({
  modal,
  catchId,
  result,
  ungraded,
  gradePanel,
  recommendations,
  price,
  action,
  phoneMissing,
}: FreshnessModalProps) {
  return (
    <div className="box-border fixed inset-0 overflow-y-auto overscroll-contain flex flex-col gap-0 p-0 sm:p-[16px] lg:p-[16px_0px] justify-start items-center bg-[#0B3B5CA6] z-[60] lg:z-[2]">
      <ScrollLock />
      <form
        action={action}
        role="dialog"
        aria-modal="true"
        aria-labelledby="freshness-modal-title"
        // Full screen on phones, a card on tablets, the design's 940px card from lg.
        className="box-border w-full lg:w-[940px] min-h-dvh sm:min-h-0 h-fit shrink-0 lg:my-auto [box-shadow:0px_24px_64px_0px_#0B3B5C33] flex flex-col gap-[20px] lg:gap-[16px] p-[16px] sm:p-[24px] justify-start items-start bg-[#FFFFFF] rounded-none sm:rounded-[24px] motion-safe:animate-fade-up"
      >
        <input type="hidden" name="id" value={catchId} />
        <ModalHeader
          icon="scan-eye"
          title={modal.title}
          titleId="freshness-modal-title"
          subtitle={ungraded ? ungraded.copy.subtitle : modal.subtitle}
          closeHref={modal.closeHref}
          closeLabel={modal.closeLabel}
          align="center"
        />
        <div className="box-border w-full h-fit shrink-0 flex flex-col lg:flex-row gap-[20px] justify-start items-stretch lg:items-start">
          <GradePanel result={result} ungraded={ungraded} {...gradePanel} />
          <div className="box-border [flex:1_1_0] min-w-0 h-fit flex flex-col gap-[14px] lg:gap-[10px] p-[16px] sm:p-[24px] lg:p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[20px]">
            <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[4px] p-[0px_0px_4px_0px] justify-start items-start">
              <h3 className="text-[18px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left lg:[white-space:nowrap]">{recommendations.title}</h3>
              <p className="text-[14px]/[20px] box-border text-[#5B6B7C] font-inter font-normal text-left">{recommendations.subtitle}</p>
            </div>
            {/* `contents` keeps each option a direct flex child, so the panel's 14px gap still sits between them. */}
            <ul className="contents">
              {recommendations.options.map((option) => (
                <UsageOption key={option.title} {...option} />
              ))}
            </ul>
            <PriceField {...price} />
          </div>
        </div>
        {phoneMissing && (
          <p role="status" className="box-border w-full h-fit shrink-0 flex flex-row gap-[10px] p-[12px_14px] justify-start items-start bg-[#FFF4E0] rounded-[12px]">
            <Icon name="circle-alert" fill="#8A5200" className="box-border w-[18px] shrink-0 h-[18px]" />
            <span className="text-[14px]/[20px] box-border [flex:1_1_0] text-[#5C3700] font-inter font-medium text-left">{phoneMissing.message}</span>
          </p>
        )}
        <div className="box-border w-full h-fit shrink-0 flex flex-col sm:flex-row gap-[16px] sm:gap-0 p-[20px_0px_0px_0px] sm:p-[24px_0px_0px_0px] lg:p-[16px_0px_0px_0px] justify-between items-stretch sm:items-center [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#E2E8F0]">
          <p className="box-border w-fit shrink sm:shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center">
            <Icon name="info" fill="#5B6B7C" className="box-border w-[16px] shrink-0 h-[16px]" />
            <span className="text-[12px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left sm:[white-space:nowrap]">{modal.disclaimer}</span>
          </p>
          {phoneMissing ? (
            <Link
              href={phoneMissing.action.href}
              className={`box-border w-fit shrink-0 h-fit flex flex-row gap-[10px] p-[14px_24px] justify-center items-center bg-[#0F6CB8] rounded-[999px] ${SOLID_HOVER} ${PRESS} ${FOCUS_RING}`}
            >
              <Icon name="phone" fill="#FFFFFF" className="box-border w-[16px] shrink-0 h-[16px]" />
              <span className="text-[16px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">
                {phoneMissing.action.label}
              </span>
            </Link>
          ) : (
            <SubmitButton label={modal.submitLabel} icon="send" tone="deep" inline />
          )}
        </div>
      </form>
    </div>
  )
}
