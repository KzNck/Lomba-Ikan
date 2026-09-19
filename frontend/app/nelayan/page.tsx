import { DashboardHeader } from '@/components/nelayan/dashboard-header'
import { Breadcrumb } from '@/components/nelayan/breadcrumb'
import { SummaryCard } from '@/components/nelayan/summary-card'
import { QuickActionCard } from '@/components/nelayan/quick-action-card'
import { ListingSection } from '@/components/nelayan/listing-section'
import { NotificationSection } from '@/components/nelayan/notification-section'
import { MainDecoration } from '@/components/nelayan/main-decoration'
import { DASHBOARD, NELAYAN_USER } from '@/components/nelayan/content'

export default function NelayanDashboardPage() {
  return (
    <div className="box-border [flex:1_1_0] flex flex-col gap-0 justify-start items-start relative">
      <DashboardHeader
        greeting={DASHBOARD.greeting}
        subtitle={DASHBOARD.subtitle}
        notifications={DASHBOARD.notifications}
        user={NELAYAN_USER}
      />
      <MainDecoration tagline={DASHBOARD.tagline} />
      <div className="box-border w-full [flex:1_1_0] flex flex-col gap-[20px] p-[20px_32px_32px_32px] justify-start items-start relative [z-index:2]">
        <Breadcrumb current={DASHBOARD.breadcrumb} />
        <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[24px] justify-start items-start">
          <SummaryCard {...DASHBOARD.summary} />
          <QuickActionCard {...DASHBOARD.quickAction} />
        </div>
        {/* Stretched (the export has items-start) so both panels end on the same line. */}
        <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[24px] justify-start items-stretch">
          <ListingSection {...DASHBOARD.listings} />
          <NotificationSection {...DASHBOARD.notificationList} />
        </div>
      </div>
    </div>
  )
}
