import { Icon, type IconName } from '@/components/ui/icon'
import { ChoiceCard } from '@/components/nelayan/choice-card'

export type IconOptionContent = {
  value: string
  label: string
  icon: IconName
  // A second line under the label (the Es step's cards).
  description?: string
}

type IconOptionProps = IconOptionContent & {
  name: string
  defaultChecked: boolean
}

// One "Opsi …" card from the Waktu and Es steps: a 56px icon circle over the label (and description, when set);
// the card hugs its content.
// The circle deepens from #F3FAFF to #DCEEFB when the card is selected.
export function IconOption({ name, value, label, icon, description, defaultChecked }: IconOptionProps) {
  return (
    <ChoiceCard name={name} value={value} defaultChecked={defaultChecked} sizeClassName="h-auto p-[24px_12px_20px_12px]">
      <div className="box-border w-[56px] h-[56px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#F3FAFF] group-has-[:checked]:bg-[#DCEEFB] rounded-[999px] relative [z-index:0]">
        <Icon name={icon} fill="#0F6CB8" className="box-border w-[28px] shrink-0 h-[28px]" />
      </div>
      <span className="text-[15px]/[normal] box-border w-full text-[#0B3B5C] font-inter font-semibold text-center relative [z-index:1]">
        {label}
      </span>
      {description && (
        <span className="text-[13px]/[18px] box-border w-full text-[#5B6B7C] font-inter font-normal text-center relative [z-index:2]">
          {description}
        </span>
      )}
    </ChoiceCard>
  )
}
