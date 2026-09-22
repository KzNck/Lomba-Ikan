import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { MainDecoration } from '@/components/nelayan/main-decoration'
import { useTranslations } from 'next-intl'
import { listingPage } from '@/components/nelayan/listing-content'

export type ListingHeader = {
  user: { name: string; initials: string }
}

type ListingShellProps = {
  // Absent in the loading state, which can't await the profile; a placeholder bar
  // of the same height stands in so the page doesn't shift once it arrives.
  header?: ListingHeader
  children: React.ReactNode
  // The "Detail Listing" drawer, when one is open.
  drawer?: React.ReactNode
}

// The "09 Listing Saya" main column: the header (carrying the page title) and waves around the filters and grid.
// Shared by the page and its loading state.
export function ListingShell({ header, children, drawer }: ListingShellProps) {
  const LISTING_PAGE = listingPage(useTranslations('dashboard.nelayan.listing'))
  return (
    <div className="box-border [flex:1_1_0] flex flex-col gap-0 justify-start items-start relative">
      {header ? (
        <DashboardHeader
          title={LISTING_PAGE.title}
          subtitle={LISTING_PAGE.subtitle}
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
        {/* From lg the export's 412px right padding leaves room for the open drawer; without one the grid takes the width.
            Below lg the drawer covers the screen (phones) or slides over the right edge (tablets). */}
        <div
          className={`box-border w-full [flex:1_1_0] flex flex-col gap-[24px] p-[16px_16px_120px_16px] sm:p-[20px_24px_120px_24px] ${drawer ? 'lg:p-[20px_412px_120px_32px]' : 'lg:p-[20px_32px_120px_32px]'} justify-start items-start relative [z-index:2]`}
        >
          {children}
        </div>
        {drawer}
      </div>
    </div>
  )
}
