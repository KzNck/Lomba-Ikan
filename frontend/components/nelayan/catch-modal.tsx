import { ModalHeader } from '@/components/nelayan/modal-header'
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
