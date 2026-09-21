'use client'

import { useTransition } from 'react'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { OUTLINE_HOVER, PRESS } from '@/components/ui/interaction'

type RegradeButtonProps = {
  catchId: string
  label: string
  pendingLabel: string
  action: (formData: FormData) => void | Promise<void>
}

// "Nilai ulang" inside the Hasil Kesegaran form. A plain button that calls its action directly rather than a second
// submit button: it sits before "Pasang ke listing" in the form, so as a submit button Enter in the price field would
// regrade instead of publishing.
export function RegradeButton({ catchId, label, pendingLabel, action }: RegradeButtonProps) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      aria-busy={pending || undefined}
      onClick={() =>
        startTransition(async () => {
          const form = new FormData()
          form.set('id', catchId)
          await action(form)
        })
      }
      className={`box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] p-[11px_20px] justify-center items-center bg-[#FFFFFF] [outline:1.5px_solid_#0F6CB8] [outline-offset:-0.75px] rounded-[999px] cursor-pointer disabled:cursor-progress disabled:opacity-70 ${OUTLINE_HOVER} ${PRESS} ${FOCUS_RING}`}
    >
      <Icon
        name={pending ? 'loader-circle' : 'rotate-ccw'}
        fill="#0F6CB8"
        className={`box-border w-[16px] shrink-0 h-[16px] ${pending ? 'motion-safe:animate-spin' : ''}`}
      />
      <span className="text-[15px]/[normal] box-border text-[#0F6CB8] font-poppins font-semibold text-left [white-space:nowrap]">
        {pending ? pendingLabel : label}
      </span>
    </button>
  )
}
