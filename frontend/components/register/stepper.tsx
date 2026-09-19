import { Icon } from '@/components/ui/icon'

const STEP_STATES = {
  // Shows a check instead of the step number.
  completed: {
    circle: 'bg-[#0F6CB8]',
    label: 'text-[#5B6B7C] font-medium',
  },
  active: {
    circle: 'bg-[#0F6CB8]',
    number: 'text-[#FFFFFF]',
    label: 'text-[#0B3B5C] font-semibold',
  },
  upcoming: {
    circle: 'bg-[#FFFFFF] [outline:1.5px_solid_#C5DDF0] [outline-offset:-0.75px]',
    number: 'text-[#5B6B7C]',
    label: 'text-[#5B6B7C] font-medium',
  },
}

type StepperProps = {
  steps: string[]
  // Zero-based index of the step the user is on. Earlier steps render as completed.
  currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <ol className="box-border w-fit h-fit shrink-0 flex flex-row gap-0 justify-start items-start motion-safe:animate-fade-up">
      {steps.map((label, index) => {
        const status = index < currentStep ? 'completed' : index === currentStep ? 'active' : 'upcoming'
        const state = STEP_STATES[status]

        return (
          // Each item carries the connector before it, so the row lays out exactly like the export's flat list.
          <li key={label} className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 justify-start items-start">
            {index > 0 && (
              <div
                aria-hidden="true"
                className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[15px_0px_0px_0px] justify-start items-start"
              >
                {/* The connector turns blue once the step it leads into has been reached. */}
                <div
                  className={`box-border w-[96px] shrink-0 h-[2px] ${index <= currentStep ? 'bg-[#0F6CB8]' : 'bg-[#C5DDF0]'}`}
                />
              </div>
            )}
            <div
              aria-current={status === 'active' ? 'step' : undefined}
              className="box-border w-[140px] shrink-0 h-fit flex flex-col gap-[10px] justify-start items-center"
            >
              <div
                aria-hidden="true"
                className={`box-border w-[32px] h-[32px] shrink-0 flex flex-row gap-0 justify-center items-center ${state.circle} rounded-[999px]`}
              >
                {status === 'completed' ? (
                  <Icon name="check" fill="#FFFFFF" className="box-border w-[16px] shrink-0 h-[16px]" />
                ) : (
                  <span className={`text-[14px]/[normal] box-border ${STEP_STATES[status].number} font-poppins font-semibold text-left [white-space:nowrap]`}>
                    {index + 1}
                  </span>
                )}
              </div>
              <span className={`text-[14px]/[normal] box-border ${state.label} font-inter text-left [white-space:nowrap]`}>
                {label}
              </span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
