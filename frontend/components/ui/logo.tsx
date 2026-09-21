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

// Ikan di mark-nya putih, jadi di latar terang (tone `dark`) mark-nya ditaruh di
// tile #0B3B5C — sama seperti app icon. Di latar gelap mark-nya berdiri sendiri.
const MARK_TONES = {
  dark: 'bg-[#0B3B5C] rounded-[10px] p-[5px]',
  light: '',
}

type LogoProps = {
  tone: keyof typeof WORDMARK_TONES
}

export function Logo({ tone }: LogoProps) {
  return (
    <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-[10px] justify-start items-center">
      <div className={`box-border w-[40px] shrink-0 h-[40px] flex justify-center items-center ${MARK_TONES[tone]}`}>
        <Image
          src="/images/logo-mark.png"
          alt=""
          aria-hidden="true"
          width={40}
          height={40}
          className="box-border w-full h-full object-contain"
        />
      </div>
      <div className={`text-[22px]/[normal] box-border ${WORDMARK_TONES[tone]} font-poppins font-bold text-left [white-space:nowrap]`}>
        ByCatch Loop
      </div>
    </div>
  )
}
