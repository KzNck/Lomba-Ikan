import { Icon } from '@/components/ui/icon'

export type TermsNoticeContent = {
  intro: string
  terms: string
  connector: string
  privacy: string
}

// "Dengan melanjutkan, Anda menyetujui Syarat & Ketentuan dan Kebijakan Privasi."
// The two policy names are styled as links in the export; there are no policy pages to point them at yet.
export function TermsNotice({ intro, terms, connector, privacy }: TermsNoticeContent) {
  return (
    <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[14px] p-[16px] justify-start items-center bg-[#F3FAFF] rounded-[12px]">
      <div className="box-border w-[40px] shrink-0 h-[40px] flex flex-row gap-0 justify-center items-center bg-[#DCEEFB] rounded-[999px]">
        <Icon name="shield-check" fill="#0F6CB8" className="box-border w-[20px] shrink-0 h-[20px]" />
      </div>
      <p className="box-border [flex:1_1_0] h-fit flex flex-col gap-[2px] justify-start items-start">
        <span className="text-[13px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">
          {intro}
        </span>
        <span className="box-border w-fit h-fit shrink-0 flex flex-row gap-[4px] justify-start items-start">
          <span className="text-[13px]/[normal] box-border text-[#0F6CB8] font-inter font-semibold text-left [white-space:nowrap]">
            {terms}
          </span>
          <span className="text-[13px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">
            {connector}
          </span>
          <span className="text-[13px]/[normal] box-border text-[#0F6CB8] font-inter font-semibold text-left [white-space:nowrap]">
            {privacy}
          </span>
        </span>
      </p>
    </div>
  )
}
