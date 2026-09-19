import Link from 'next/link'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { ModalDialog } from '@/components/nelayan/modal-dialog'
import { OUTLINE_HOVER, PRESS, SOLID_HOVER } from '@/components/ui/interaction'

type CancelListingDialogProps = {
  listingId: string
  title: string
  body: string
  back: { href: string; label: string }
  confirmLabel: string
  // Receives the form, with the listing's slug in `id`.
  action: (formData: FormData) => void | Promise<void>
}

// "Konfirmasi batalkan listing". The export shows the dialog alone; it sits on the same scrim as the other nelayan
// modals, centred in the viewport. Opening it focuses "Kembali", the first control and the safe choice.
export function CancelListingDialog({ listingId, title, body, back, confirmLabel, action }: CancelListingDialogProps) {
  return (
    <ModalDialog
      closeHref={back.href}
      role="alertdialog"
      labelledBy="cancel-listing-title"
      describedBy="cancel-listing-body"
      className="m-auto w-[420px] rounded-[24px] [box-shadow:0px_16px_48px_0px_#0B3B5C33] motion-safe:animate-fade-up"
    >
      <form
        action={action}
        className="box-border w-full h-fit flex flex-col gap-[20px] p-[28px] justify-start items-start bg-[#FFFFFF] rounded-[24px]"
      >
        <input type="hidden" name="id" value={listingId} />
        <div className="box-border w-[48px] h-[48px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#FDECEC] rounded-[999px]">
          <Icon name="circle-x" fill="#C23B35" className="box-border w-[22px] shrink-0 h-[22px]" />
        </div>
        <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[6px] justify-start items-start">
          <h2 id="cancel-listing-title" className="text-[20px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">
            {title}
          </h2>
          <p id="cancel-listing-body" className="text-[14px]/[21px] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">
            {body}
          </p>
        </div>
        <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-end items-start">
          <Link
            href={back.href}
            scroll={false}
            className={`box-border w-fit shrink-0 h-fit flex flex-row gap-[12px] p-[13px_24px] justify-center items-center bg-[#FFFFFF] [outline:1.5px_solid_#0F6CB8] [outline-offset:-0.75px] rounded-[999px] ${OUTLINE_HOVER} ${PRESS} ${FOCUS_RING}`}
          >
            <span className="text-[16px]/[normal] box-border text-[#0F6CB8] font-poppins font-semibold text-left [white-space:nowrap]">{back.label}</span>
          </Link>
          <button
            type="submit"
            className={`box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[14px_24px] justify-start items-center bg-[#C23B35] rounded-[999px] cursor-pointer ${SOLID_HOVER} ${PRESS} ${FOCUS_RING}`}
          >
            <span className="text-[16px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">{confirmLabel}</span>
          </button>
        </div>
      </form>
    </ModalDialog>
  )
}
