import { DashboardHeader } from '@/components/nelayan/dashboard-header'
import { Breadcrumb } from '@/components/nelayan/breadcrumb'
import { MainDecoration } from '@/components/nelayan/main-decoration'
import { ListingPageHead } from '@/components/nelayan/listing-page-head'
import { DASHBOARD, NELAYAN_USER } from '@/components/nelayan/content'
import { LISTING_PAGE } from '@/components/nelayan/listing-content'

type ListingShellProps = {
  children: React.ReactNode
  // The "Detail Listing" drawer, when one is open.
  drawer?: React.ReactNode
}

// The "09 Listing Saya" main column: header, waves, breadcrumb and page title around the tabs and grid.
// Shared by the page and its loading state.
export function ListingShell({ children, drawer }: ListingShellProps) {
  return (
    <div className="box-border [flex:1_1_0] flex flex-col gap-0 justify-start items-start relative">
      <DashboardHeader
        greeting={DASHBOARD.greeting}
        subtitle={DASHBOARD.subtitle}
        notifications={DASHBOARD.notifications}
        user={NELAYAN_USER}
      />
      <MainDecoration />
      <div className="box-border w-full [flex:1_1_0] flex flex-col gap-0 justify-start items-start relative">
        {/* The export's 412px right padding leaves room for the open drawer; without one the grid takes the width. */}
        <div
          className={`box-border w-full [flex:1_1_0] flex flex-col gap-[24px] ${drawer ? 'p-[20px_412px_32px_32px]' : 'p-[20px_32px_32px_32px]'} justify-start items-start relative [z-index:2]`}
        >
          <Breadcrumb current={LISTING_PAGE.breadcrumb} />
          <ListingPageHead title={LISTING_PAGE.title} subtitle={LISTING_PAGE.subtitle} action={LISTING_PAGE.addAction} />
          {children}
        </div>
        {drawer}
      </div>
    </div>
  )
}
