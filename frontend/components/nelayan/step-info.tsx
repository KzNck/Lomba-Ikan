import { Icon } from '@/components/ui/icon'

type StepInfoProps = {
  text: string
  // Step 1's note wraps to two lines and top-aligns its icon; step 2's is one line and centres it.
  align: 'start' | 'center'
}

// The pale-blue "Info" note under a step's controls.
export function StepInfo({ text, align }: StepInfoProps) {
  return (
    <div
      className={`box-border w-full h-fit shrink-0 flex flex-row gap-[12px] p-[14px_16px] justify-start ${align === 'center' ? 'items-center' : 'items-start'} bg-[#F3FAFF] rounded-[12px]`}
    >
      <Icon name="info" fill="#0F6CB8" className="box-border w-[20px] shrink-0 h-[20px]" />
      <p className="text-[14px]/[21px] box-border [flex:1_1_0] text-[#0B3B5C] font-inter font-normal text-left">{text}</p>
    </div>
  )
}
