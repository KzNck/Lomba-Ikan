import { useTranslations } from 'next-intl'

const BAR = 'box-border shrink-0 bg-[#DCEEFB] rounded-[6px]'

// The auth pages (masuk, pilih role, daftar, konfirmasi) differ in layout but share the light sky background and a
// white card near the top-left of the 1440px column; this holds that much while the next one loads.
export default function AuthLoading() {
  const t = useTranslations('dashboard')
  return (
    <div className="box-border w-full min-w-[1440px] h-dvh bg-[#F3FAFF] [--frame-x:max(0px,calc((100%_-_1440px)/2))]">
      <div role="status" className="box-border w-[1440px] h-full ms-[var(--frame-x)] flex flex-col gap-[40px] p-[48px_120px] motion-safe:animate-pulse">
        <span className="sr-only">{t('loading')}</span>
        <div className="box-border w-fit h-fit flex flex-col gap-[16px]">
          <div className={`${BAR} w-[200px] h-[44px] rounded-[12px]`} />
          <div className={`${BAR} w-[160px] h-[16px]`} />
        </div>
        <div className="box-border w-[580px] ms-[80px] h-[520px] short:h-[440px] shrink-0 flex flex-col gap-[20px] p-[48px] bg-[#FFFFFF] rounded-[24px] [box-shadow:0px_16px_40px_0px_#0B3B5C14]">
          <div className={`${BAR} w-[320px] h-[32px]`} />
          <div className={`${BAR} w-[260px] h-[16px]`} />
          <div className="box-border w-full h-[50px] shrink-0 bg-[#F3FAFF] rounded-[12px]" />
          <div className="box-border w-full h-[50px] shrink-0 bg-[#F3FAFF] rounded-[12px]" />
          <div className="box-border w-full h-[56px] shrink-0 bg-[#DCEEFB] rounded-[999px]" />
        </div>
      </div>
    </div>
  )
}
