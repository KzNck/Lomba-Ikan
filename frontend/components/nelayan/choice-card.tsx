import { Icon } from '@/components/ui/icon'

type ChoiceCardProps = {
  name: string
  value: string
  defaultChecked: boolean
  // The card's own padding (and height, where fixed); everything else is shared.
  sizeClassName: string
  children: React.ReactNode
}

// A radio styled as a card: the shell shared by the modal's option cards (Kategori, Waktu). Selected = tinted fill,
// 2px ring and a corner check; keyboard focus = the "Fokus keyboard" state, a 2px ring 2px outside the card.
// Children can react to selection with `group-has-[:checked]:`.
export function ChoiceCard({ name, value, defaultChecked, sizeClassName, children }: ChoiceCardProps) {
  return (
    <label
      className={`group box-border [flex:1_1_0] ${sizeClassName} flex flex-col gap-[10px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[16px] relative cursor-pointer has-[:checked]:bg-[#F3FAFF] has-[:checked]:[outline:2px_solid_#0F6CB8] has-[:checked]:[outline-offset:-1px] has-[:focus-visible]:[box-shadow:0px_0px_0px_2px_#FFFFFF,_0px_0px_0px_4px_#0F6CB8]`}
    >
      <input type="radio" name={name} value={value} defaultChecked={defaultChecked} className="sr-only" />
      {children}
      {/* The export pins the check at left-[123px] on the 155px cards, i.e. 10px from the right edge. */}
      <span
        aria-hidden="true"
        className="box-border w-[22px] h-[22px] absolute right-[10px] top-[10px] hidden group-has-[:checked]:flex flex-row gap-0 justify-center items-center bg-[#0F6CB8] rounded-[999px] [z-index:2]"
      >
        <Icon name="check" fill="#FFFFFF" className="box-border w-[14px] shrink-0 h-[14px]" />
      </span>
    </label>
  )
}
