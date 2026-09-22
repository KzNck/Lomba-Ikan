'use client'

import { useFormStatus } from 'react-dom'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { PRESS, SOLID_HOVER } from '@/components/ui/interaction'

// "Simpan perubahan", and its "Menyimpan…" state (spinner, no save icon) while the form is being sent.
export function SaveButton({ label, savingLabel }: { label: string; savingLabel: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={`box-border w-full sm:w-fit shrink-0 ${pending ? 'h-[56px] gap-[10px] p-[0px_26px]' : 'h-fit gap-[12px] p-[16px_26px_16px_28px] [box-shadow:0px_8px_20px_0px_#0F6CB840]'} flex flex-row justify-center items-center [background-image:linear-gradient(90deg,_#0F6CB8_0%,_#0F5C82_100%)] bg-no-repeat bg-[length:100%_100%] rounded-[999px] cursor-pointer disabled:cursor-wait ${pending ? '' : `${SOLID_HOVER} ${PRESS}`} ${FOCUS_RING}`}
    >
      {pending && <Icon name="loader-circle" fill="#FFFFFF" className="box-border w-[18px] shrink-0 h-[18px] motion-safe:animate-spin" />}
      <span className="text-[16px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">
        {pending ? savingLabel : label}
      </span>
      {!pending && <Icon name="save" fill="#FFFFFF" className="box-border w-[18px] shrink-0 h-[18px]" />}
    </button>
  )
}
