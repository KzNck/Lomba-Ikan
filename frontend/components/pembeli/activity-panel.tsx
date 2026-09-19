import { PanelHeader } from '@/components/pembeli/panel-header'
import { ActivityStat, type ActivityStatContent } from '@/components/pembeli/activity-stat'

// "Ringkasan Aktivitas".
export function ActivityPanel({ title, stats }: { title: string; stats: ActivityStatContent[] }) {
  return (
    <section className="box-border w-full h-fit shrink-0 flex flex-col gap-[10px] p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[20px]">
      <PanelHeader icon="chart-column" title={title} />
      {stats.map((stat) => (
        <ActivityStat key={stat.label} {...stat} />
      ))}
    </section>
  )
}
