import { SectionHeader } from '@/components/nelayan/section-header'
import { ListingCard, type ListingCardContent } from '@/components/nelayan/listing-card'
import { EmptyState } from '@/components/nelayan/empty-state'
import type { NavItem } from '@/components/home/navbar'

type ListingSectionProps = {
  title: string
  viewAll: NavItem
  detailLabel: string
  metricLabels: { weight: string; pricePerKg: string }
  items: ListingCardContent[]
  empty: { title: string; description: string; action: NavItem }
}

// "Listing Aktif Saya". With no items it shows the "Listing kosong" state and drops the "Lihat semua" link.
export function ListingSection({ title, viewAll, detailLabel, metricLabels, items, empty }: ListingSectionProps) {
  return (
    <section
      className="box-border [flex:1_1_0] flex flex-col gap-[16px] p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[20px] motion-safe:animate-fade-up"
      style={{ animationDelay: '320ms' }}
    >
      <SectionHeader icon="tag" title={title} link={items.length > 0 ? viewAll : undefined} />
      {items.length > 0 ? (
        <div className="box-border w-full [flex:1_1_auto] grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row gap-[14px] justify-start items-stretch">
          {items.map((item) => (
            <ListingCard key={item.href} {...item} metricLabels={metricLabels} detailLabel={detailLabel} />
          ))}
        </div>
      ) : (
        <EmptyState icon="fish" {...empty} />
      )}
    </section>
  )
}
