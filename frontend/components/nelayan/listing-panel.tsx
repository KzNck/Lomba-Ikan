import { SectionHeader } from '@/components/nelayan/section-header'

// The white "Card Listing Aktif Saya" panel that holds the grid's empty and loading states.
export function ListingPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="box-border w-full h-fit shrink-0 flex flex-col gap-[16px] p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[20px]">
      <SectionHeader icon="tag" title={title} />
      {children}
    </section>
  )
}
