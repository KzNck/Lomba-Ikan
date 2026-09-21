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

// One "Kategori …" card (step 1): a 48px photo or icon circle over the label, on a fixed 118px card — shorter than
// the export's 140px so the whole step fits a laptop screen, with the label a size up so it stays easy to read.
export function CategoryOption(props: CategoryOptionProps) {
  const { name, value, label, defaultChecked } = props
  return (
    <ChoiceCard name={name} value={value} defaultChecked={defaultChecked} sizeClassName="h-[118px] p-[12px_10px_10px_10px]">
      {props.image !== undefined ? (
        <div className="box-border w-[48px] h-[48px] shrink-0 rounded-[999px] overflow-hidden relative [z-index:0]">
          <Image src={props.image} alt="" fill sizes="48px" className="object-cover object-center" />
        </div>
      ) : (
        <div className="box-border w-[48px] h-[48px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#F3FAFF] rounded-[999px]">
          <Icon name={props.icon} fill="#0F6CB8" className="box-border w-[24px] shrink-0 h-[24px]" />
        </div>
      )}
      <span className="text-[15px]/[19px] box-border w-full text-[#0B3B5C] font-inter font-semibold text-center relative [z-index:1]">
        {label}
      </span>
    </ChoiceCard>
  )
}
