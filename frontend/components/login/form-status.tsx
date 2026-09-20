import { Icon } from '@/components/ui/icon'

// A non-urgent confirmation, e.g. "a new link is on its way". Polite, so it waits
// for a pause rather than cutting in.
//
// Like FormError, the region is always rendered and only its text changes: a live
// region inserted together with its text is announced unreliably. Empty, it is
// `sr-only`, which keeps it out of the layout.
export function FormStatus({ message }: { message?: string }) {
  return (
    <div
      role="status"
      className={
        message
          ? 'box-border w-full h-fit shrink-0 flex flex-row gap-[10px] p-[12px_14px] justify-start items-start bg-[#E8F8F2] [border:1px_solid_#BFE6D4] rounded-[12px]'
          : 'sr-only'
      }
    >
      {message && (
        <>
          <Icon name="circle-check" fill="#17704A" className="box-border w-[18px] shrink-0 h-[18px] mt-[1px]" />
          <p className="text-[14px]/[20px] box-border [flex:1_1_0] text-[#17704A] font-inter font-normal text-left">
            {message}
          </p>
        </>
      )}
    </div>
  )
}
