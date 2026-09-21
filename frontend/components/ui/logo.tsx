import Image from 'next/image'

// Logo utuh — mark dan wordmark — dipotong dari fisherman-design/design-reference-png/:
// logo-navy-bycatchloop.png untuk latar terang (tone `dark`), logo-bycatchloop.png untuk
// latar gelap (tone `light`). Keduanya ditampilkan setinggi 48px.
const LOGO_TONES = {
  dark: { src: '/images/logo-navy.png', width: 191 },
  light: { src: '/images/logo-white.png', width: 183 },
}

type LogoProps = {
  tone: keyof typeof LOGO_TONES
}

export function Logo({ tone }: LogoProps) {
  const { src, width } = LOGO_TONES[tone]
  return (
    <Image
      src={src}
      alt="ByCatch Loop"
      width={width}
      height={48}
      className="box-border shrink-0 h-[48px] w-auto object-contain"
    />
  )
}
