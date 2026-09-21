import { ModalHeader } from '@/components/nelayan/modal-header'
import { ScrollLock } from '@/components/ui/scroll-lock'
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

// The body of each step (its question, controls and notes). It is the only part of the modal that scrolls, and only
// when the window is too short for the whole step: the header, stepper and footer stay in view. The 4px padding,
// taken back by the negative margin, leaves room for the cards' focus ring inside the scroll area's clip.
export const STEP_BODY = 'box-border w-[calc(100%+8px)] [flex:0_1_auto] min-h-0 overflow-y-auto overscroll-contain p-[4px] m-[-4px]'

// The "Overlay" + "Modal Tambah Tangkapan" layers. The export pins the scrim to the 1440×1100 frame; here it is
// fixed to the viewport, and the modal is centred and capped at the window's height so a fisher sees the whole
// step — and its "Lanjut" button — without scrolling the page.
export function CatchModal({ title, subtitle, closeHref, closeLabel, steps, currentStep, children }: CatchModalProps) {
  return (
    <div className="box-border fixed inset-0 overflow-y-auto overscroll-contain flex flex-col gap-0 p-[16px] justify-start items-center bg-[#0B3B5CA6] [z-index:2]">
      <ScrollLock />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="catch-modal-title"
        className="box-border w-[720px] h-fit max-h-[calc(100dvh-32px)] shrink-0 m-auto [box-shadow:0px_24px_64px_0px_#0B3B5C33] flex flex-col gap-[20px] p-[24px_32px] justify-start items-start bg-[#FFFFFF] rounded-[24px]"
      >
        <ModalHeader
          icon="fish"
          title={title}
          titleId="catch-modal-title"
          subtitle={subtitle}
          closeHref={closeHref}
          closeLabel={closeLabel}
          align="start"
        />
        <CatchStepper steps={steps} currentStep={currentStep} />
        {children}
      </div>
    </div>
  )
}
