'use client'

import { useFormStatus } from 'react-dom'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { PRESS_WIDE, SOLID_HOVER } from '@/components/ui/interaction'

type BuyButtonProps = {
  label: string
  processingLabel: string
}

// "Beli sekarang · Rp …". While the purchase is sent it shows the "Memproses pembelian" state: a spinner in place of
// the cart and disabled, so a second press can't buy twice.
export function BuyButton({ label, processingLabel }: BuyButtonProps) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={`box-border w-full h-[52px] shrink-0 ${pending ? '' : '[box-shadow:0px_8px_20px_0px_#0F6CB840]'} flex flex-row ${pending ? 'gap-[10px]' : 'gap-[12px] p-[0px_24px]'} justify-center items-center [background-image:linear-gradient(90deg,_#0F6CB8_0%,_#0F5C82_100%)] bg-no-repeat bg-[length:100%_100%] rounded-[999px] cursor-pointer disabled:cursor-wait ${pending ? '' : `${SOLID_HOVER} ${PRESS_WIDE}`} ${FOCUS_RING}`}
    >
      {pending && <Icon name="loader-circle" fill="#FFFFFF" className="box-border w-[18px] shrink-0 h-[18px] motion-safe:animate-spin" />}
      <span className="text-[16px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">
        {pending ? processingLabel : label}
      </span>
      {!pending && <Icon name="shopping-cart" fill="#FFFFFF" className="box-border w-[18px] shrink-0 h-[18px]" />}
    </button>
  )
}
