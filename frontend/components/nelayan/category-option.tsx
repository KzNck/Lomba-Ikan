import Image from 'next/image'
import { Icon, type IconName } from '@/components/ui/icon'
import { ChoiceCard } from '@/components/nelayan/choice-card'

// Photo cards set `image`; the "Lainnya" card has no photo and shows `icon` on a tinted circle instead.
export type CategoryOptionContent = {
  value: string
  label: string
} & ({ image: string; icon?: never } | { icon: IconName; image?: never })

type CategoryOptionProps = CategoryOptionContent & {
  name: string
  defaultChecked: boolean
}

// One "Kategori …" card (step 1): a 64px photo or icon circle over the label, on a fixed 140px card.
export function CategoryOption(props: CategoryOptionProps) {
  const { name, value, label, defaultChecked } = props
  return (
    <ChoiceCard name={name} value={value} defaultChecked={defaultChecked} sizeClassName="h-[140px] p-[20px_12px_16px_12px]">
      {props.image !== undefined ? (
        <div className="box-border w-[64px] h-[64px] shrink-0 rounded-[999px] overflow-hidden relative [z-index:0]">
          <Image src={props.image} alt="" fill sizes="64px" className="object-cover object-center" />
        </div>
      ) : (
        <div className="box-border w-[64px] h-[64px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#F3FAFF] rounded-[999px]">
          <Icon name={props.icon} fill="#0F6CB8" className="box-border w-[28px] shrink-0 h-[28px]" />
        </div>
      )}
      <span className="text-[14px]/[18px] box-border w-full text-[#0B3B5C] font-inter font-semibold text-center relative [z-index:1]">
        {label}
      </span>
    </ChoiceCard>
  )
}
