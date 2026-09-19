import { TopBar } from '@/components/pembeli/top-bar'
import { RecommendationSection } from '@/components/pembeli/recommendation-section'
import { NotificationPanel } from '@/components/pembeli/notification-panel'
import { ActivityPanel } from '@/components/pembeli/activity-panel'
import { DASHBOARD, PEMBELI_NOTIFICATIONS, PEMBELI_USER } from '@/components/pembeli/content'

export default function PembeliDashboardPage() {
  return (
    <div className="box-border [flex:1_1_0] flex flex-col gap-[28px] p-[32px] justify-start items-start">
      <TopBar greeting={DASHBOARD.greeting} subtitle={DASHBOARD.subtitle} notifications={PEMBELI_NOTIFICATIONS} user={PEMBELI_USER} />
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[20px] justify-start items-start">
        <RecommendationSection {...DASHBOARD.recommendations} />
        <div className="box-border [flex:1_1_0] h-fit flex flex-col gap-[20px] justify-start items-start">
          <NotificationPanel {...DASHBOARD.notificationList} />
          <ActivityPanel {...DASHBOARD.activity} />
        </div>
      </div>
    </div>
  )
}
