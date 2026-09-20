import { DashboardHeader } from '@/components/nelayan/dashboard-header'
import { Breadcrumb } from '@/components/nelayan/breadcrumb'
import { MainDecoration } from '@/components/nelayan/main-decoration'
import { ListingPageHead } from '@/components/nelayan/listing-page-head'
import { DASHBOARD } from '@/components/nelayan/content'
import { LISTING_PAGE } from '@/components/nelayan/listing-content'

export type ListingHeader = {
  greeting: string
  user: { name: string; initials: string }
  unreadCount: number
}

type ListingShellProps = {
  // Absent in the loading state, which can't await the profile; a placeholder bar
  // of the same height stands in so the page doesn't shift once it arrives.
  header?: ListingHeader
  children: React.ReactNode
  // The "Detail Listing" drawer, when one is open.
  drawer?: React.ReactNode
}

// The "09 Listing Saya" main column: header, waves, breadcrumb and page title around the tabs and grid.
// Shared by the page and its loading state.
export function ListingShell({ header, children, drawer }: ListingShellProps) {
  return (
    <div className="box-border [flex:1_1_0] flex flex-col gap-0 justify-start items-start relative">
      {header ? (
        <DashboardHeader
          greeting={header.greeting}
          subtitle={DASHBOARD.subtitle}
          notifications={{ ...DASHBOARD.notifications, unreadCount: header.unreadCount }}
          user={header.user}
        />
      ) : (
        <div
          aria-hidden="true"
          className="box-border w-full h-[81px] shrink-0 bg-[#FFFFFF] [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#E2E8F0] [margin:0px_0px_-0.5px_0px] relative [z-index:0]"
        />
      )}
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
