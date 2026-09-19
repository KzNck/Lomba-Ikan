import Link from 'next/link'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { PRESS } from '@/components/ui/interaction'
import { CatchStepper } from '@/components/nelayan/catch-stepper'

type CatchModalProps = {
  title: string
  subtitle: string
  closeHref: string
  closeLabel: string
  steps: string[]
  currentStep: number
  // The step body and footer.
  children: React.ReactNode
}

// The "Overlay" + "Modal Tambah Tangkapan" layers. The export pins the scrim to the 1440×1100 frame; here it is
// fixed to the viewport so it covers the dashboard at any window size, and scrolls if the modal outgrows it.
export function CatchModal({ title, subtitle, closeHref, closeLabel, steps, currentStep, children }: CatchModalProps) {
  return (
    <div className="box-border fixed inset-0 overflow-y-auto flex flex-col gap-0 p-[140px_0px_0px_0px] justify-start items-center bg-[#0B3B5CA6] [z-index:2]">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="catch-modal-title"
        className="box-border w-[720px] h-fit shrink-0 [box-shadow:0px_24px_64px_0px_#0B3B5C33] flex flex-col gap-[28px] p-[32px] justify-start items-start bg-[#FFFFFF] rounded-[24px]"
      >
        <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[16px] justify-start items-start">
          <div className="box-border w-[48px] shrink-0 h-[48px] flex flex-row gap-0 justify-center items-center bg-[#DCEEFB] rounded-[999px]">
            <Icon name="fish" fill="#0F6CB8" className="box-border w-[24px] shrink-0 h-[24px]" />
          </div>
          <div className="box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] justify-start items-start">
            <h2 id="catch-modal-title" className="text-[22px]/[26px] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">
              {title}
            </h2>
            <p className="text-[14px]/[normal] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">{subtitle}</p>
          </div>
          <Link
            href={closeHref}
            aria-label={closeLabel}
            className={`box-border w-[40px] shrink-0 h-[40px] flex flex-row gap-0 justify-center items-center bg-[#F7F9FC] hover:bg-[#E3F0F9] rounded-[999px] ${PRESS} ${FOCUS_RING}`}
          >
            <Icon name="x" fill="#0B3B5C" className="box-border w-[20px] shrink-0 h-[20px]" />
          </Link>
        </div>
        <CatchStepper steps={steps} currentStep={currentStep} />
        {children}
      </div>
    </div>
  )
}
