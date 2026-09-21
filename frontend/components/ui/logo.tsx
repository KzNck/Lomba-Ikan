import Image from 'next/image'

// Brand mark, trimmed out of fisherman-design/design-reference-png/logo-bycatchloop.png.
//
// Hanya mark-nya yang dipakai dari file itu: wordmark di PNG-nya putih solid, jadi
// hilang di atas navbar dan halaman login yang latarnya terang. Wordmark-nya tetap
// teks hidup di bawah — ikut `tone`, bisa diseleksi, dan tajam di ukuran berapa pun.
const WORDMARK_TONES = {
  dark: 'text-[#0B3B5C]',
  light: 'text-[#FFFFFF]',
}

// Ikan di mark aslinya putih dan ada glow gelap transparan di tengah — keduanya cuma
// terbaca di latar gelap. Untuk latar terang (tone `dark`) dipakai versi navy: bagian
// putihnya jadi #0B3B5C dan glow-nya dibuang.
const MARK_TONES = {
  dark: '/images/logo-mark-navy.png',
  light: '/images/logo-mark.png',
}

type LogoProps = {
  tone: keyof typeof WORDMARK_TONES
}

export function Logo({ tone }: LogoProps) {
  return (
    <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-[10px] justify-start items-center">
      <Image
        src={MARK_TONES[tone]}
        alt=""
        aria-hidden="true"
        width={40}
        height={40}
        className="box-border w-[40px] shrink-0 h-[40px] object-contain"
      />
      <div className={`text-[22px]/[normal] box-border ${WORDMARK_TONES[tone]} font-poppins font-bold text-left [white-space:nowrap]`}>
        ByCatch Loop
      </div>
    </div>
  )
}
