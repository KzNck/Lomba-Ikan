import { SectionHeader, ViewAllLink } from '@/components/nelayan/section-header'
import { NotificationItem, type NotificationContent } from '@/components/nelayan/notification-item'
import { EmptyState } from '@/components/nelayan/empty-state'
import type { NavItem } from '@/components/home/navbar'

type NotificationSectionProps = {
  title: string
  viewAll: NavItem
  items: NotificationContent[]
  empty: { title: string; description: string }
}

// "Notifikasi Terbaru". The empty state ("Notifikasi kosong") uses the card's 16px gap instead of 6px.
export function NotificationSection({ title, viewAll, items, empty }: NotificationSectionProps) {
  const isEmpty = items.length === 0

  return (
    <section
      className={`box-border w-full lg:w-[320px] shrink-0 flex flex-col ${isEmpty ? 'gap-[16px]' : 'gap-[6px]'} p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[20px] motion-safe:animate-fade-up`}
      style={{ animationDelay: '400ms' }}
    >
      <SectionHeader icon="bell" title={title} />
      {isEmpty ? (
        <EmptyState icon="bell" {...empty} />
      ) : (
        <>
          {/* `contents` keeps each row a direct flex child, so the card's 6px gap still sits between rows. */}
          <ul className="contents">
            {items.map((item, index) => (
              <NotificationItem key={item.id} {...item} divider={index < items.length - 1} />
            ))}
          </ul>
          <ViewAllLink {...viewAll} className="mt-[8px]" />
        </>
      )}
    </section>
  )
}
