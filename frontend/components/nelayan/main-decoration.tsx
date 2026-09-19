import { Icon } from '@/components/ui/icon'

// The waves and signature tagline along the bottom of the main column. The export places them at top-[980px]
// and top-[1030px] left-[844px] in a 1100px × 1180px column; here they're pinned to the bottom-right instead.
// "Listing Saya" has the waves without the tagline.
export function MainDecoration({ tagline }: { tagline?: string }) {
  return (
    <>
      <div aria-hidden="true" className="box-border w-full h-[120px] absolute left-0 bottom-0 [z-index:1]">
        <svg
          viewBox="0 0 1180 90"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="box-border w-full h-[90px] absolute left-0 top-[30px] overflow-visible [z-index:0]"
        >
          <path d="M0 40c200-40 380 30 590-5 210-35 390 25 590-10l0 65-1180 0z" fill="#DCEEFB80" />
        </svg>
        <svg
          viewBox="0 0 1180 60"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="box-border w-full h-[60px] absolute left-0 top-[60px] overflow-visible [z-index:1]"
        >
          <path d="M0 30c240 30 420-30 640-5 220 25 360-15 540 5l0 30-1180 0z" fill="#DCEEFBB3" />
        </svg>
      </div>
      {tagline && (
        <div className="box-border w-fit h-fit absolute right-[31.723px] bottom-[16.651px] flex flex-row gap-[10px] justify-start items-center [z-index:3]">
          <div className="box-border relative w-[264.277px] h-[53.349px] shrink-0">
            <p className="text-[22px]/[normal] box-border [transform:rotate(-6deg)] [transform-origin:top_left] absolute left-0 top-[27.491px] text-[#0F6CB8] font-dancing font-semibold text-left [white-space:nowrap]">
              {tagline}
            </p>
          </div>
          <Icon name="fish" fill="#168BE5" className="box-border w-[30px] shrink-0 h-[30px]" />
        </div>
      )}
    </>
  )
}
