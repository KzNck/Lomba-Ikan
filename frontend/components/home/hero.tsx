import Image from 'next/image'
import { PillLink } from '@/components/ui/pill-link'
import type { NavItem } from '@/components/home/navbar'

export type ImageContent = {
  src: string
  alt: string
}

type HeroProps = {
  id: string
  eyebrow: string
  headline: string
  subheadline: string
  image: ImageContent
  primaryCta: NavItem
  secondaryCta: NavItem
}

export function Hero({ id, eyebrow, headline, subheadline, image, primaryCta, secondaryCta }: HeroProps) {
  return (
    <section id={id} className="box-border w-full h-[640px] shrink-0 scroll-mt-[80px] bg-[#F3FAFF] overflow-hidden relative">
      <div className="box-border w-[880px] h-[640px] absolute left-[560px] top-0 [z-index:0] motion-safe:animate-fade-in">
        <Image src={image.src} alt={image.alt} fill preload sizes="880px" className="object-cover object-center" />
      </div>
      <div className="box-border w-[400px] h-[640px] absolute left-[540px] top-0 [background-image:linear-gradient(90deg,_#F3FAFFFF_0%,_#F3FAFFFF_32%,_#F3FAFFB3_55%,_#F3FAFF00_100%)] bg-no-repeat bg-[length:100%_100%] [z-index:1]" />
      <div className="box-border w-[600px] h-fit absolute left-[120px] top-[72px] flex flex-col gap-[20px] justify-start items-start [z-index:2]">
        <p className="text-[13px]/[normal] box-border text-[#0F6CB8] font-poppins font-semibold tracking-[1.6px] text-left [white-space:nowrap] motion-safe:animate-fade-up">
          {eyebrow}
        </p>
        <h1
          className="text-[56px]/[63px] box-border w-full text-[#0B3B5C] font-poppins font-extrabold text-left motion-safe:animate-fade-up"
          style={{ animationDelay: '100ms' }}
        >
          {headline}
        </h1>
        <p
          className="text-[18px]/[29px] box-border w-[540px] text-[#5B6B7C] font-inter font-normal text-left motion-safe:animate-fade-up"
          style={{ animationDelay: '200ms' }}
        >
          {subheadline}
        </p>
        <div
          className="box-border w-fit h-fit shrink-0 flex flex-row gap-[16px] p-[16px_0px_0px_0px] justify-start items-center motion-safe:animate-fade-up"
          style={{ animationDelay: '300ms' }}
        >
          <PillLink
            {...primaryCta}
            variant="primary"
            size="lg"
            withArrow
            className="[box-shadow:0px_8px_20px_0px_#168BE540]"
          />
          <PillLink {...secondaryCta} variant="outline" size="lg" withArrow />
        </div>
      </div>
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="box-border w-[1440px] h-[120px] absolute left-0 top-[520px] overflow-visible [z-index:3] motion-safe:animate-wave-drift"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="hero-wave-back-fill" gradientUnits="userSpaceOnUse" x1="0" y1="60" x2="1440" y2="60">
            <stop offset="0%" stopColor="rgb(21,131,220)" stopOpacity="1" />
            <stop offset="45%" stopColor="rgb(58,174,238)" stopOpacity="0.902" />
            <stop offset="80%" stopColor="rgb(101,199,245)" stopOpacity="0.251" />
            <stop offset="100%" stopColor="rgb(101,199,245)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 50 C 200 12 400 26 600 64 C 800 100 1000 98 1200 70 C 1310 56 1390 46 1440 42 L1440 120 L0 120 Z"
          fill="url(#hero-wave-back-fill)"
        />
      </svg>
      <svg
        viewBox="0 0 1440 92"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="box-border w-[1440px] h-[92px] absolute left-0 top-[548px] overflow-visible [z-index:4] motion-safe:animate-wave-drift"
        style={{ animationDelay: '-3.5s' }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="hero-wave-highlight-fill" gradientUnits="userSpaceOnUse" x1="0" y1="46" x2="1440" y2="46">
            <stop offset="0%" stopColor="rgb(101,199,245)" stopOpacity="0.702" />
            <stop offset="55%" stopColor="rgb(154,218,248)" stopOpacity="0.502" />
            <stop offset="100%" stopColor="rgb(154,218,248)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 34 C 230 6 450 24 670 56 C 880 84 1090 82 1270 60 C 1350 50 1405 44 1440 42 L1440 92 L0 92 Z"
          fill="url(#hero-wave-highlight-fill)"
        />
      </svg>
      <svg
        viewBox="0 0 1440 68"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="box-border w-[1440px] h-[68px] absolute left-0 top-[572px] overflow-visible [z-index:5]"
        aria-hidden="true"
      >
        <path d="M0 46 C 320 74 640 22 940 36 C 1180 46 1320 22 1440 10 L1440 68 L0 68 Z" fill="#F7F9FC" />
      </svg>
    </section>
  )
}
