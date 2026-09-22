import { DashboardHeader } from '@/components/nelayan/dashboard-header'
import { SummaryCard } from '@/components/nelayan/summary-card'
import { QuickActionCard } from '@/components/nelayan/quick-action-card'
import { ListingSection } from '@/components/nelayan/listing-section'
import { NotificationSection } from '@/components/nelayan/notification-section'
import { MainDecoration } from '@/components/nelayan/main-decoration'
import type { ListingCardContent } from '@/components/nelayan/listing-card'
import type { NotificationContent } from '@/components/nelayan/notification-item'
import type { SummaryStatContent } from '@/components/nelayan/summary-stat'
import { useTranslations } from 'next-intl'
import { dashboardCopy } from '@/components/nelayan/content'

export type NelayanDashboardData = {
  greeting: string
  user: { name: string; initials: string }
  stats: SummaryStatContent[]
  listings: ListingCardContent[]
  notifications: NotificationContent[]
}

// The dashboard's main column. The "Tambah Tangkapan" pages render it behind their modal.
export function NelayanDashboard({ data }: { data: NelayanDashboardData }) {
  const DASHBOARD = dashboardCopy(useTranslations('dashboard.nelayan.home'))
  return (
    <div className="box-border [flex:1_1_0] flex flex-col gap-0 justify-start items-start relative">
      <DashboardHeader
        title={data.greeting}
        wave
        subtitle={DASHBOARD.subtitle}
        notifications={{ ...DASHBOARD.notifications, unreadCount: data.notifications.length }}
        user={data.user}
      />
      <MainDecoration />
      <div className="box-border w-full [flex:1_1_0] flex flex-col gap-[20px] p-[16px_16px_120px_16px] sm:p-[20px_24px_120px_24px] lg:p-[20px_32px_120px_32px] justify-start items-start relative [z-index:2]">
        <div className="box-border w-full h-fit shrink-0 flex flex-col lg:flex-row gap-[20px] lg:gap-[24px] justify-start items-stretch lg:items-start">
          <SummaryCard {...DASHBOARD.summary} stats={data.stats} />
          <QuickActionCard {...DASHBOARD.quickAction} />
        </div>
        {/* Stretched (the export has items-start) so both panels end on the same line. */}
        <div className="box-border w-full h-fit shrink-0 flex flex-col lg:flex-row gap-[20px] lg:gap-[24px] justify-start items-stretch">
          <ListingSection {...DASHBOARD.listings} items={data.listings} />
          <NotificationSection {...DASHBOARD.notificationList} items={data.notifications} />
        </div>
      </div>
    </div>
  )
}
