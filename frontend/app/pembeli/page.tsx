import { getTranslations } from 'next-intl/server'
import { TopBar } from '@/components/pembeli/top-bar'
import { RecommendationSection } from '@/components/pembeli/recommendation-section'
import { NotificationPanel } from '@/components/pembeli/notification-panel'
import { ActivityPanel } from '@/components/pembeli/activity-panel'
import { dashboardCopy, PEMBELI_NOTIFICATIONS } from '@/components/pembeli/content'
import { loadPembeliDashboard } from '@/lib/pembeli/dashboard'

export default async function PembeliDashboardPage() {
  const [data, t] = await Promise.all([loadPembeliDashboard(), getTranslations('dashboard.pembeli.home')])
  const DASHBOARD = dashboardCopy(t)

  return (
    <div className="box-border [flex:1_1_0] flex flex-col gap-[20px] lg:gap-[28px] p-[16px] sm:p-[24px] lg:p-[32px] justify-start items-start">
      <TopBar
        greeting={DASHBOARD.greeting(data.greeting)}
        subtitle={DASHBOARD.subtitle}
        notifications={{ ...PEMBELI_NOTIFICATIONS, unreadCount: data.notifications.length }}
        user={data.user}
      />
      <div className="box-border w-full h-fit shrink-0 flex flex-col lg:flex-row gap-[20px] justify-start items-stretch lg:items-start">
        <RecommendationSection {...DASHBOARD.recommendations} items={data.recommendations} />
        <div className="box-border [flex:1_1_0] h-fit flex flex-col gap-[20px] justify-start items-start">
          <NotificationPanel {...DASHBOARD.notificationList} items={data.notifications} />
          <ActivityPanel {...DASHBOARD.activity} stats={data.activity} />
        </div>
      </div>
    </div>
  )
}
