import { EmptyState } from '@/components/nelayan/empty-state'
import type { NavItem } from '@/components/home/navbar'
import { ArrowLink } from '@/components/pembeli/arrow-link'
import { PanelHeader } from '@/components/pembeli/panel-header'
import { NotificationItem, type NotificationItemContent } from '@/components/pembeli/notification-item'

type NotificationPanelProps = {
  title: string
  viewAll: NavItem
  items: NotificationItemContent[]
  empty: { title: string; description: string }
}

// "Notifikasi Terbaru". With no items it shows the "Notifikasi kosong" state and drops the footer link.
export function NotificationPanel({ title, viewAll, items, empty }: NotificationPanelProps) {
  return (
    <section className="box-border w-full h-fit shrink-0 flex flex-col gap-[6px] p-[20px_20px_14px_20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[20px]">
      <PanelHeader icon="bell" title={title} />
      {items.length > 0 ? (
        <>
          {/* `contents` keeps each row a direct flex child, so the card's 6px gap still sits between rows. */}
          <ul className="contents">
            {items.map((item, index) => (
              <NotificationItem key={`${item.title}-${item.time}`} {...item} divider={index < items.length - 1} />
            ))}
          </ul>
          <div className="box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[8px_0px_4px_0px] justify-start items-start">
            <ArrowLink {...viewAll} size="sm" />
          </div>
        </>
      ) : (
        <EmptyState icon="bell" {...empty} />
      )}
    </section>
  )
}
