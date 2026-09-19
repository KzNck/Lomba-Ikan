import { Fragment } from 'react'
import Image from 'next/image'
import { Logo } from '@/components/ui/logo'
import { BackLink } from '@/components/login/back-link'
import { WaveDecoration } from '@/components/register/wave-decoration'
import type { NavItem } from '@/components/home/navbar'
import type { ImageContent } from '@/components/home/hero'

type LoginLayoutProps = {
  backLink: NavItem
  illustration: ImageContent
  tagline: {
    // Rendered one per line.
    headline: string[]
    body: string
  }
  // The card, placed at the export's left-[200px] top-[184px].
  children: React.ReactNode
}

// The "05 Masuk" frame. Content keeps the export's 1440px column (centred via --frame-x); the illustration,
// its fades, and the wave bleed to the window's right edge and bottom, so wide or tall screens show no gaps.
// The illustration keeps its designed 1024px height and sits on the bottom edge, so tall windows add sky above
// it instead of zooming the crop. At exactly 1440×1024 every layer lands where the export puts it.
// Layers keep the export's stacking: illustration 0, fades 1–2, wave 3, card 4, header 5, tagline 6.
export function LoginLayout({ backLink, illustration, tagline, children }: LoginLayoutProps) {
  return (
    <div className="box-border w-full min-w-[1440px] min-h-[1024px] h-dvh relative bg-[#F3FAFF] overflow-clip [--frame-x:max(0px,calc((100%_-_1440px)/2))]">
      {/* Width is 50vw + 160px at any window width: from the column's 560px mark to the right edge. */}
      <div className="box-border h-[1024px] absolute left-[calc(var(--frame-x)_+_560px)] right-0 bottom-[-40px] [z-index:0] motion-safe:animate-fade-in">
        <Image
          src={illustration.src}
          alt={illustration.alt}
          fill
          sizes="calc(50vw + 160px)"
          loading="eager"
          className="object-cover object-center"
        />
      </div>
      <div className="box-border w-[480px] absolute left-[calc(var(--frame-x)_+_560px)] top-0 bottom-0 [background-image:linear-gradient(90deg,_#F3FAFFFF_0%,_#F3FAFF00_100%)] bg-no-repeat bg-[length:100%_100%] [z-index:1]" />
      {/* Tracks the illustration's top edge: 1024 - 40 (overhang) - 180 (own height) = 804px from the bottom. */}
      <div className="box-border h-[180px] absolute left-[calc(var(--frame-x)_+_560px)] right-0 bottom-[804px] [background-image:linear-gradient(180deg,_#F3FAFFFF_0%,_#F3FAFF00_100%)] bg-no-repeat bg-[length:100%_100%] [z-index:2]" />
      <div className="absolute left-0 bottom-0 w-full [z-index:3]">
        <WaveDecoration />
      </div>
      <div className="box-border w-[1440px] absolute left-[var(--frame-x)] top-0 bottom-0">
        <div className="absolute left-[200px] top-[184px] [z-index:4] motion-safe:animate-fade-up">{children}</div>
        <div className="box-border w-fit h-fit absolute left-[120px] top-[48px] flex flex-col gap-[16px] justify-start items-start [z-index:5]">
          <Logo tone="dark" />
          <BackLink {...backLink} />
        </div>
        <div className="box-border w-[460px] h-fit absolute left-[880px] top-[176px] flex flex-col gap-[16px] justify-start items-start [z-index:6]">
          <p
            className="text-[32px]/[38px] box-border w-full text-[#0B3B5C] font-poppins font-extrabold text-left motion-safe:animate-fade-up"
            style={{ animationDelay: '100ms' }}
          >
            {tagline.headline.map((line, index) => (
              <Fragment key={line}>
                {index > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </p>
          <p
            className="text-[17px]/[26px] box-border w-full text-[#5B6B7C] font-inter font-normal text-left motion-safe:animate-fade-up"
            style={{ animationDelay: '200ms' }}
          >
            {tagline.body}
          </p>
        </div>
      </div>
    </div>
  )
}
