import { PHOTO_AREA_HEIGHT } from '@/components/nelayan/photo-frame'

type PhotoAnalyzingProps = {
  title: string
  description: string
}

// "Menganalisis foto (online)": replaces the photo controls while the photo is being graded. The export's
// spinner is a static arc (a clip-path on a filled square); it turns here for users who allow motion.
export function PhotoAnalyzing({ title, description }: PhotoAnalyzingProps) {
  return (
    <div role="status" className={`box-border w-full ${PHOTO_AREA_HEIGHT} shrink-0 flex flex-col gap-[12px] justify-center items-center bg-[#F3FAFF] rounded-[16px]`}>
      <div
        aria-hidden="true"
        className="box-border w-[44px] h-[44px] shrink-0 bg-[#0F6CB8] [clip-path:path('M22_0_C34.15_0_44_9.85_44_22_C44_34.15_34.15_44_22_44_C9.85_44_0_34.15_0_22_L4.4_22_C4.4_31.72_12.28_39.6_22_39.6_C31.72_39.6_39.6_31.72_39.6_22_C39.6_12.28_31.72_4.4_22_4.4_L22_0_Z')] motion-safe:animate-spin"
      />
      <p className="text-[16px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">{title}</p>
      <p className="text-[14px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">{description}</p>
    </div>
  )
}
