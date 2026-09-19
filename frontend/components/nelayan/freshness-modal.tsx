import { Icon } from '@/components/ui/icon'
import { ModalHeader } from '@/components/nelayan/modal-header'
import { GradePanel, type FreshnessResult } from '@/components/nelayan/grade-panel'
import { UsageOption, type UsageOptionContent } from '@/components/nelayan/usage-option'
import { PriceField } from '@/components/nelayan/price-field'
import { SubmitButton } from '@/components/register/submit-button'
import type { FRESHNESS_MODAL, GRADE_PANEL, PRICE_FIELD } from '@/components/nelayan/freshness-content'

type FreshnessModalProps = {
  modal: typeof FRESHNESS_MODAL
  result: FreshnessResult
  gradePanel: typeof GRADE_PANEL
  recommendations: { title: string; subtitle: string; options: UsageOptionContent[] }
  price: typeof PRICE_FIELD
  // Receives the form, including the optional price.
  action: (formData: FormData) => void | Promise<void>
}

// The "Overlay" + "Modal Hasil Kesegaran" layers, shown once the catch photo has been graded. Like CatchModal, the
// scrim is fixed to the viewport (the export pins it to the 1440×1100 frame) and scrolls if the modal outgrows it.
export function FreshnessModal({ modal, result, gradePanel, recommendations, price, action }: FreshnessModalProps) {
  return (
    <div className="box-border fixed inset-0 overflow-y-auto flex flex-col gap-0 p-[72px_0px_0px_0px] justify-start items-center bg-[#0B3B5CA6] [z-index:2]">
      <form
        action={action}
        role="dialog"
        aria-modal="true"
        aria-labelledby="freshness-modal-title"
        className="box-border w-[940px] h-fit shrink-0 [box-shadow:0px_24px_64px_0px_#0B3B5C33] flex flex-col gap-[24px] p-[32px] justify-start items-start bg-[#FFFFFF] rounded-[24px]"
      >
        <ModalHeader
          icon="scan-eye"
          title={modal.title}
          titleId="freshness-modal-title"
          subtitle={modal.subtitle}
          closeHref={modal.closeHref}
          closeLabel={modal.closeLabel}
          align="center"
        />
        <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[20px] justify-start items-start">
          <GradePanel result={result} {...gradePanel} />
          <div className="box-border [flex:1_1_0] h-fit flex flex-col gap-[14px] p-[24px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[20px]">
            <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[4px] p-[0px_0px_4px_0px] justify-start items-start">
              <h3 className="text-[18px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">{recommendations.title}</h3>
              <p className="text-[14px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">{recommendations.subtitle}</p>
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
        <div className="box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[24px_0px_0px_0px] justify-between items-center [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#E2E8F0]">
          <p className="box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center">
            <Icon name="info" fill="#5B6B7C" className="box-border w-[16px] shrink-0 h-[16px]" />
            <span className="text-[12px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">{modal.disclaimer}</span>
          </p>
          <SubmitButton label={modal.submitLabel} icon="send" tone="deep" inline />
        </div>
      </form>
    </div>
  )
}
