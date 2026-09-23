import Link from 'next/link'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { OUTLINE_HOVER, PRESS } from '@/components/ui/interaction'
import { SubmitButton } from '@/components/register/submit-button'

// "Batal" on step 1 leaves the modal (a link); "Kembali" on steps 2–5 returns to the previous step (a button).
export type CatchFooterBack = { label: string } & ({ href: string; onClick?: never } | { onClick: () => void; href?: never })

type CatchFooterProps = {
  back: CatchFooterBack
  submitLabel: string
}

const BACK_CLASS = `box-border w-fit shrink-0 h-fit flex flex-row gap-[12px] p-[13px_20px] sm:p-[13px_28px] justify-center items-center bg-[#FFFFFF] [outline:1.5px_solid_#0F6CB8] [outline-offset:-0.75px] rounded-[999px] cursor-pointer ${OUTLINE_HOVER} ${PRESS} ${FOCUS_RING}`

// The modal's "Footer": a hairline divider, the outline back link and the gradient submit button.
// Render it inside the step's <form> so the button submits it. Below sm both buttons take less inline padding (the
// submit button's is set from here, not in the shared SubmitButton), so the longest label, "Analisis foto →", still
// fits beside "Kembali" on a 320px phone.
export function CatchFooter({ back, submitLabel }: CatchFooterProps) {
  const label = (
    <span className="text-[16px]/[normal] box-border text-[#0F6CB8] font-poppins font-semibold text-left [white-space:nowrap]">
      {back.label}
    </span>
  )

  return (
    <div className="[box-sizing:content-box] w-full md:w-[656px] h-fit shrink-0 flex flex-row gap-[12px] md:gap-0 [&>*]:flex-1 md:[&>*]:[flex:0_1_auto] max-sm:[&>[type=submit]]:p-[16px_18px_16px_20px] max-sm:[&>[type=submit]]:gap-[8px] p-[16px_0px_0px_0px] justify-between items-center [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#E2E8F0] [margin:-0.5px_0px_0px_0px]">
      {back.href !== undefined ? (
        <Link href={back.href} className={BACK_CLASS}>
          {label}
        </Link>
      ) : (
        <button type="button" onClick={back.onClick} className={BACK_CLASS}>
          {label}
        </button>
      )}
      <SubmitButton label={submitLabel} icon="arrow-right" inline />
    </div>
  )
}
