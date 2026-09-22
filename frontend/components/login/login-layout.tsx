import Image from 'next/image'
import { Logo } from '@/components/ui/logo'
import { BackLink } from '@/components/login/back-link'
import { WaveDecoration } from '@/components/register/wave-decoration'
import type { NavItem } from '@/components/home/navbar'
import type { ImageContent } from '@/components/home/hero'

type LoginLayoutProps = {
  backLink: NavItem
  illustration: ImageContent
  // The card, centred in the frame below the header.
  children: React.ReactNode
}

// The "05 Masuk" frame. Content keeps the export's 1440px column (centred via --frame-x); the illustration,
// its fades, and the wave bleed to the window's right edge and bottom, so wide or tall screens show no gaps.
// The illustration keeps its designed 1024px height and sits on the bottom edge, so tall windows add sky above
// it instead of zooming the crop. At exactly 1440×1024 every layer lands where the export puts it.
// Windows shorter than 940px (the `short:` variant, most laptops) move everything up and tighten the card so the page
// fits without scrolling; below 720px it scrolls.
// Layers keep the export's stacking: illustration 0, fades 1–2, wave 3, card 4, header 5.
// All of that is from lg. Below lg the page is one column — logo and back link, then the card — with the
// illustration as a band above the wave at the bottom.
export function LoginLayout({ backLink, illustration, children }: LoginLayoutProps) {
  return (
    <div className="box-border w-full lg:min-w-[1440px] min-h-dvh lg:min-h-[720px] lg:h-dvh flex flex-col lg:block relative bg-[#F3FAFF] overflow-clip [--frame-x:max(0px,calc((100%_-_1440px)/2))]">
      {/* Width is 50vw + 160px at any window width: from the column's 560px mark to the right edge. */}
      <div className="box-border order-last lg:order-none w-full lg:w-auto h-[260px] sm:h-[340px] lg:h-[1024px] shrink-0 relative lg:absolute lg:left-[calc(var(--frame-x)_+_560px)] lg:right-0 lg:bottom-[-40px] [z-index:0] motion-safe:animate-fade-in">
        <Image
          src={illustration.src}
          alt={illustration.alt}
          fill
          sizes="calc(50vw + 160px)"
          loading="eager"
          className="object-cover object-center"
        />
        <div className="lg:hidden box-border absolute left-0 right-0 top-0 h-[120px] [background-image:linear-gradient(180deg,_#F3FAFFFF_0%,_#F3FAFF00_100%)] [z-index:1]" />
      </div>
      <div className="hidden lg:block box-border w-[480px] absolute left-[calc(var(--frame-x)_+_560px)] top-0 bottom-0 [background-image:linear-gradient(90deg,_#F3FAFFFF_0%,_#F3FAFF00_100%)] bg-no-repeat bg-[length:100%_100%] [z-index:1]" />
      {/* Tracks the illustration's top edge: 1024 - 40 (overhang) - 180 (own height) = 804px from the bottom. */}
      <div className="hidden lg:block box-border h-[180px] absolute left-[calc(var(--frame-x)_+_560px)] right-0 bottom-[804px] [background-image:linear-gradient(180deg,_#F3FAFFFF_0%,_#F3FAFF00_100%)] bg-no-repeat bg-[length:100%_100%] [z-index:2]" />
      <div className="absolute left-0 bottom-0 w-full [z-index:3]">
        <WaveDecoration />
      </div>
      <div className="box-border w-full lg:w-[1440px] flex flex-col lg:block gap-[24px] p-[20px_16px_8px] sm:p-[32px_24px_16px] lg:p-0 items-stretch sm:items-center relative lg:absolute lg:left-[var(--frame-x)] lg:top-0 lg:bottom-0 [z-index:4] lg:[z-index:auto]">
        {/* From lg the card is centred in the frame, with room above for the header. */}
        <div className="order-2 lg:order-none w-full lg:absolute lg:inset-0 lg:flex lg:items-center lg:justify-center lg:pt-[140px] lg:pb-[48px] lg:short:pt-[100px] lg:short:pb-[24px] lg:pointer-events-none [z-index:4]">
          <div className="w-full sm:w-fit sm:mx-auto lg:mx-0 lg:pointer-events-auto motion-safe:animate-fade-up">{children}</div>
        </div>
        <div className="box-border order-1 lg:order-none w-full sm:w-[580px] lg:w-fit h-fit relative lg:absolute lg:left-[120px] lg:top-[48px] lg:short:top-[24px] flex flex-col gap-[12px] lg:gap-[16px] lg:short:gap-[10px] justify-start items-start [z-index:5]">
          <Logo tone="dark" />
          <BackLink {...backLink} />
        </div>
      </div>
    </div>
  )
}
