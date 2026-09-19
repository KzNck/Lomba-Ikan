import { Icon, type IconName } from '@/components/ui/icon'

// Heading row shared by the right-column cards ("Notifikasi Terbaru", "Ringkasan Aktivitas").
export function PanelHeader({ icon, title }: { icon: IconName; title: string }) {
  return (
    <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[10px] p-[0px_0px_8px_0px] justify-start items-center">
      <Icon name={icon} fill="#0F5C82" className="box-border w-[22px] shrink-0 h-[22px]" />
      <h2 className="text-[17px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">{title}</h2>
    </div>
  )
}
