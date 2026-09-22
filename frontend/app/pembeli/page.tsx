import { getTranslations } from 'next-intl/server'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { initialsOf } from '@/lib/nelayan/dashboard-data'
import { RecommendationSection } from '@/components/pembeli/recommendation-section'
import { ActivityPanel } from '@/components/pembeli/activity-panel'
import { dashboardCopy } from '@/components/pembeli/content'
import { loadPembeliDashboard } from '@/lib/pembeli/dashboard'

export default async function PembeliDashboardPage() {
  const [data, t] = await Promise.all([loadPembeliDashboard(), getTranslations('dashboard.pembeli.home')])
  const DASHBOARD = dashboardCopy(t)

  return (
    <div className="box-border [flex:1_1_0] flex flex-col gap-0 justify-start items-start relative">
      <DashboardHeader
        title={DASHBOARD.greeting(data.greeting)}
        wave
        subtitle={DASHBOARD.subtitle}
        user={{ name: data.user.name, initials: initialsOf(data.user.name) }}
        accountHref="/pembeli/akun"
      />
      <div className="box-border w-full [flex:1_1_0] flex flex-col gap-[20px] p-[16px] sm:p-[24px] lg:p-[32px] justify-start items-start">
        <div className="box-border w-full h-fit shrink-0 flex flex-col lg:flex-row gap-[20px] justify-start items-stretch lg:items-start">
          <RecommendationSection {...DASHBOARD.recommendations} items={data.recommendations} />
          <div className="box-border [flex:1_1_0] h-fit flex flex-col gap-[20px] justify-start items-start">
            <ActivityPanel {...DASHBOARD.activity} stats={data.activity} />
          </div>
        </div>
      </div>
    </div>
  )
}
