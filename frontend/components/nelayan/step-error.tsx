import { Icon } from '@/components/ui/icon'

type StepErrorProps = {
  id: string
  message: string
  show: boolean
}

// The "Error Message" row shown when "Lanjut" is pressed with an invalid answer. The live region is always
// mounted so screen readers announce the message when it appears.
export function StepError({ id, message, show }: StepErrorProps) {
  return (
    <div aria-live="polite" className="contents">
      {show && (
        <div id={id} className="box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center">
          <Icon name="circle-alert" fill="#C23B35" className="box-border w-[18px] shrink-0 h-[18px]" />
          <p className="text-[14px]/[normal] box-border text-[#C23B35] font-inter font-medium text-left [white-space:nowrap]">{message}</p>
        </div>
      )}
    </div>
  )
}
