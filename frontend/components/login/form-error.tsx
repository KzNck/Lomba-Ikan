import { Icon } from '@/components/ui/icon'

// A form-level message: what the field-level error treatment in FormField can't
// carry, e.g. wrong credentials or a rate limit from Supabase.
//
// The region is always rendered, even with nothing to say, because a live region
// inserted at the same moment as its text is announced unreliably. Empty, it is
// `sr-only`, which takes it out of flow so the form's gap doesn't shift.
export function FormError({ message }: { message?: string }) {
  return (
    <div
      role="alert"
      tabIndex={-1}
      data-form-error=""
      className={
        message
          ? 'box-border w-full h-fit shrink-0 flex flex-row gap-[10px] p-[12px_14px] justify-start items-start bg-[#FDF2F2] [border:1px_solid_#F0C9C7] rounded-[12px] outline-none'
          : 'sr-only'
      }
    >
      {message && (
        <>
          <Icon name="circle-alert" fill="#C23B35" className="box-border w-[18px] shrink-0 h-[18px] mt-[1px]" />
          <p className="text-[14px]/[20px] box-border [flex:1_1_0] text-[#C23B35] font-inter font-normal text-left">
            {message}
          </p>
        </>
      )}
    </div>
  )
}
