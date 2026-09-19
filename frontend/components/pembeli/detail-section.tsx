import { Icon, type IconName } from '@/components/ui/icon'

type DetailSectionProps = {
  icon: IconName
  title: string
  children: React.ReactNode
  // Something beside the content, e.g. the "Lokasi" mini map (the row then centres vertically, as in the export).
  aside?: React.ReactNode
}

// One outlined block in the batch drawer: "Kondisi & Kesegaran", "Lokasi", "Rekomendasi Penggunaan",
// "Informasi Tambahan".
export function DetailSection({ icon, title, children, aside }: DetailSectionProps) {
  return (
    <section
      className={`box-border w-full h-fit shrink-0 flex flex-row gap-[14px] p-[16px] justify-start ${aside ? 'items-center' : 'items-start'} [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[14px]`}
    >
      <div className="box-border w-[36px] shrink-0 h-[36px] flex flex-row gap-0 justify-center items-center bg-[#F3FAFF] rounded-[999px]">
        <Icon name={icon} fill="#0F6CB8" className="box-border w-[18px] shrink-0 h-[18px]" />
      </div>
      <div className="box-border [flex:1_1_0] min-w-0 h-fit flex flex-col gap-[8px] justify-start items-start">
        <h3 className="text-[15px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">{title}</h3>
        {children}
      </div>
      {aside}
    </section>
  )
}

// A grey pill in "Kondisi & Kesegaran" (storage, catch time, auction time left) and the drawer's category tag.
export function DetailChip({ icon, label, size = 'md' }: { icon: IconName; label: string; size?: 'sm' | 'md' }) {
  return (
    <span
      className={`box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] ${size === 'sm' ? 'p-[4px_10px]' : 'p-[5px_10px]'} justify-start items-center bg-[#F7F9FC] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[999px]`}
    >
      <Icon name={icon} fill="#5B6B7C" className="box-border w-[14px] shrink-0 h-[14px]" />
      <span
        className={`${size === 'sm' ? 'text-[12px]/[normal] font-poppins font-semibold' : 'text-[13px]/[normal] font-inter font-medium'} box-border text-[#0B3B5C] text-left [white-space:nowrap]`}
      >
        {label}
      </span>
    </span>
  )
}
