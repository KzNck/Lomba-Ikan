import Image from 'next/image'

type CardPhotoProps = {
  src: string
  alt: string
  sizes: string
  loading?: 'eager' | 'lazy'
}

// A card's photo area. Category illustrations (/images/…) are drawn for the frame, so they fill it. A fisher's own
// photo can be any shape, so it's shown whole (object-contain) over a blurred, zoomed copy of itself that fills the
// bars — cropping it cut off whatever was near the edges. Fills its positioned parent.
export function CardPhoto({ src, alt, sizes, loading }: CardPhotoProps) {
  if (src.startsWith('/images/')) {
    return <Image src={src} alt={alt} fill sizes={sizes} loading={loading} className="object-cover object-center" />
  }

  return (
    <span className="box-border absolute inset-0 overflow-hidden bg-[#DCEEFB]">
      <Image src={src} alt="" aria-hidden="true" fill sizes={sizes} loading={loading} className="object-cover object-center scale-110 blur-md opacity-70" />
      <Image src={src} alt={alt} fill sizes={sizes} loading={loading} className="object-contain object-center" />
    </span>
  )
}
