import { useId } from 'react'
import { Icon, type IconName } from '@/components/ui/icon'

export type FormCardHeader = {
  icon: IconName
  title: string
  subtitle: string
}

// md is the Nelayan frame's card, lg the Pembeli frame's.
const CARD_WIDTHS = {
  md: 'w-[640px]',
  lg: 'w-[760px]',
}

type FormCardProps = FormCardHeader & {
  size?: keyof typeof CARD_WIDTHS
  // Keeps the form mounted (and its values) while another part of a multi-part form is shown.
  hidden?: boolean
  action?: (formData: FormData) => void | Promise<void>
  onSubmit?: React.FormEventHandler<HTMLFormElement>
  onChange?: React.FormEventHandler<HTMLFormElement>
  children: React.ReactNode
}

// The white card is the <form> itself, so its children keep the export's 32px rhythm.
export function FormCard({ icon, title, subtitle, size = 'md', hidden, action, onSubmit, onChange, children }: FormCardProps) {
  const titleId = useId()

  return (
    <form
      aria-labelledby={titleId}
      hidden={hidden}
      action={action}
      onSubmit={onSubmit}
      onChange={onChange}
      className={`box-border ${CARD_WIDTHS[size]} h-fit shrink-0 [box-shadow:0px_0px_0px_1px_#0000000F,_0px_1px_2px_-1px_#0000000F,_0px_2px_4px_0px_#0000000A] flex flex-col gap-[32px] p-[40px] justify-start items-start bg-[#FFFFFF] rounded-[24px] motion-safe:animate-fade-up`}
      style={{ animationDelay: '300ms' }}
    >
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[20px] justify-start items-center">
        <div className="box-border w-[64px] shrink-0 h-[64px] flex flex-row gap-0 justify-center items-center bg-[#DCEEFB] rounded-[999px]">
          <Icon name={icon} fill="#0F6CB8" className="box-border w-[30px] shrink-0 h-[30px]" />
        </div>
        <div className="box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] justify-start items-start">
          <h2
            id={titleId}
            className="text-[22px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]"
          >
            {title}
          </h2>
          <p className="text-[14px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">
            {subtitle}
          </p>
        </div>
      </div>
      {children}
    </form>
  )
}
