import { Icon } from '@/components/ui/icon'
import { EmptyState } from '@/components/nelayan/empty-state'
import type { NavItem } from '@/components/home/navbar'
import { ArrowLink } from '@/components/pembeli/arrow-link'
import { ProductCard, type ProductCardContent } from '@/components/pembeli/product-card'

type RecommendationSectionProps = {
  title: string
  description: string
  viewAll: NavItem
  items: ProductCardContent[]
  empty: { title: string; description: string; action: NavItem }
}

const BOAT_PATH = 'M61.44001 48.25724c5.64-3.66 9.71999-9.06 12.23998-17.28001l-9.77998 1.20001 0 0.06c-3.84 0.36-8.46 0.96-16.92001 1.56l-0.18-33.54001c-0.18-0.3-1.44-0.36-1.62-0.05999l-0.06 33.72-3.72 0.23999-0.12-8.57999-23.4 0.84-0.36 8.39999c-5.46 0-9.84-0.12-17.52-0.41999 0.9 6.18 3.54 10.74 6.72 13.91999 7.68 0.18 14.46 0.36 23.1 0.42 11.64 0.12 21.3-0.06 31.62001-0.47999z'

// "Rekomendasi". The export lays the cards out as two hard-coded rows of three; one wrapping row gives the same
// grid for any number of cards. With no items it shows the "Rekomendasi kosong" state under the same banner.
export function RecommendationSection({ title, description, viewAll, items, empty }: RecommendationSectionProps) {
  return (
    <section className="box-border w-[754px] shrink-0 h-fit flex flex-col gap-0 justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[20px] overflow-hidden">
      <div className="box-border w-full h-[150px] shrink-0 [background-image:linear-gradient(180deg,_#DCEEFB_0%,_#F3FAFF_70%,_#FFFFFF_100%)] bg-no-repeat bg-[length:100%_100%] relative">
        <BannerDecoration />
        <div className="box-border w-[710px] h-fit absolute left-[22px] top-[22px] flex flex-row gap-[14px] justify-start items-start [z-index:1]">
          <div className="box-border w-[40px] shrink-0 h-[40px] flex flex-row gap-0 justify-center items-center bg-[#FFFFFF] rounded-[999px]">
            <Icon name="sparkles" fill="#0F6CB8" className="box-border w-[22px] shrink-0 h-[22px]" />
          </div>
          <div className="box-border [flex:1_1_0] h-fit flex flex-col gap-[6px] justify-start items-start">
            <div className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center">
              <h2 className="text-[19px]/[normal] box-border text-[#0F5C82] font-poppins font-semibold text-left [white-space:nowrap]">{title}</h2>
              <ArrowLink {...viewAll} size="md" />
            </div>
            <p className="text-[14px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">{description}</p>
          </div>
        </div>
      </div>
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[14px] p-[0px_18px_18px_18px] justify-start items-start">
        {items.length > 0 ? (
          <div className="box-border w-full h-fit shrink-0 flex flex-row flex-wrap gap-[14px] justify-start items-start">
            {items.map((item) => (
              <ProductCard key={item.href} {...item} />
            ))}
          </div>
        ) : (
          <EmptyState icon="fish" actionIcon="sliders-horizontal" {...empty} />
        )}
      </div>
    </section>
  )
}

// Waves and a faded boat in the banner's bottom-right corner.
function BannerDecoration() {
  return (
    <div aria-hidden="true" className="box-border w-[374px] h-[110px] absolute left-[380px] top-[40px] [z-index:0]">
      <svg
        viewBox="0 0 374 110"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="box-border w-[374px] h-[110px] absolute left-0 top-0 overflow-visible [z-index:0]"
      >
        <path d="M40 110c50-24 100-38 160-32 55 6 90-16 130-22 20-3 34-2 44 0l0 54z" fill="#65C7F533" />
      </svg>
      <div className="box-border w-[84px] h-[66px] opacity-[0.55] absolute left-[262px] top-[28px] overflow-hidden [z-index:1]">
        <svg
          viewBox="0.0000019073486328125 -8.940696716308594e-7 73.67999076843262 48.77372831106186"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="box-border w-[73.68px] h-[48.774px] absolute left-[5.16px] top-[8.683px] overflow-visible [z-index:0]"
        >
          <path d={BOAT_PATH} fill="#67B5E1" />
          <path
            d={BOAT_PATH}
            fill="none"
            stroke="#67B5E1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
      <svg
        viewBox="0 0 374 110"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="box-border w-[374px] h-[110px] absolute left-0 top-0 overflow-visible [z-index:2]"
      >
        <path d="M150 110c40-16 80-26 122-22 38 4 66-10 102-14l0 36z" fill="#65C7F552" />
      </svg>
      <svg
        viewBox="0 0 374 110"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="box-border w-[374px] h-[110px] absolute left-0 top-0 overflow-visible [z-index:3]"
      >
        <path d="M250 110c32-10 62-14 90-10 16 2 26-2 34-4l0 14z" fill="#168BE52B" />
      </svg>
    </div>
  )
}
