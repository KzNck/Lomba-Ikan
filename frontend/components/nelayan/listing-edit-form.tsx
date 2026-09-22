'use client'

import { useActionState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useFormStatus } from 'react-dom'
import { useFormatter, useTranslations } from 'next-intl'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { PriceField } from '@/components/nelayan/price-field'
import { priceField } from '@/components/nelayan/freshness-content'
import { editListing, type ActiveListing } from '@/components/nelayan/listing-content'
import { OUTLINE_HOVER, PRESS, SOLID_HOVER } from '@/components/ui/interaction'
import type { ListingEditState } from '@/app/nelayan/actions'

type ListingEditFormProps = {
  listing: ActiveListing
  action: (state: ListingEditState, formData: FormData) => Promise<ListingEditState>
  // Back to the drawer's detail view.
  cancelHref: string
}

// The drawer's edit mode: the catch it belongs to, then its weight and price, with Batal / Simpan pinned at the
// bottom like the detail view's actions. Saving returns to the detail view; errors come back per field and focus the
// first one.
export function ListingEditForm({ listing, action, cancelHref }: ListingEditFormProps) {
  const format = useFormatter()
  const EDIT_LISTING = editListing(useTranslations('dashboard.nelayan.listing'))
  const PRICE_FIELD = priceField(useTranslations('dashboard.nelayan.freshness'), format)
  // "8000" → "8.000" (id) / "8,000" (en), as the result modal's price field shows it. The action strips the grouping.
  const priceText = (value: number | null) => (value === null ? '' : format.number(Math.round(value)))
  // 5 → "5", 5.5 → "5,5" (id) / "5.5" (en); the action reads either separator.
  const weightText = (kg: number) => format.number(kg, { maximumFractionDigits: 2, useGrouping: false })
  const [state, formAction] = useActionState(action, {
    values: { berat: weightText(listing.detail.weightKg), harga: priceText(listing.detail.pricePerKg) },
    errors: {},
  })
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }, [state])

  const { weight } = EDIT_LISTING
  const weightError = state.errors.berat

  return (
    <form ref={formRef} action={formAction} noValidate className="contents">
      <input type="hidden" name="id" value={listing.slug} />
      {/* Scrolls on its own between the drawer's header and this form's footer (see ListingDrawer). */}
      <div className="box-border w-full [flex:1_1_0] min-h-0 overflow-y-auto overscroll-contain flex flex-col gap-[20px] p-[16px] sm:p-[24px] justify-start items-start">
        <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[14px] justify-start items-center">
          <div className="box-border w-[64px] h-[64px] shrink-0 [border:1px_solid_#0000001A] rounded-[12px] overflow-hidden relative">
            <Image src={listing.image.src} alt="" fill sizes="64px" className="object-cover object-center" />
          </div>
          <div className="box-border min-w-0 h-fit flex flex-col gap-[4px] justify-start items-start">
            <p className="text-[17px]/[22px] box-border text-[#0B3B5C] font-poppins font-semibold text-left">{listing.category}</p>
            <p className="text-[13px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left">
              {listing.grade.label} · {listing.location}
            </p>
          </div>
        </div>
        <p className="text-[14px]/[21px] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">{EDIT_LISTING.intro}</p>

        <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] justify-start items-start">
          <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start">
            <label htmlFor={weight.name} className="text-[15px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left">
              {weight.label}
            </label>
            <p id={`${weight.name}-helper`} className="text-[13px]/[normal] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">
              {weight.helper}
            </p>
          </div>
          <div
            className={`box-border w-full h-[52px] shrink-0 flex flex-row gap-[12px] p-[0px_16px] justify-start items-center bg-[#FFFFFF] ${weightError ? '[outline:1.5px_solid_#C23B35]' : '[outline:1px_solid_#7F8FA4]'} [outline-offset:-0.5px] rounded-[12px] focus-within:[outline-color:#0F6CB8] focus-within:[box-shadow:0px_0px_0px_2px_#FFFFFF,_0px_0px_0px_4px_#0F6CB8]`}
          >
            <Icon name="package" fill="#5B6B7C" className="box-border w-[18px] shrink-0 h-[18px]" />
            {/* Keyed like the price field below: React resets uncontrolled inputs after a form action. */}
            <input
              key={state.values.berat}
              id={weight.name}
              name={weight.name}
              inputMode="decimal"
              autoComplete="off"
              defaultValue={state.values.berat}
              aria-describedby={weightError ? `${weight.name}-helper ${weight.name}-error` : `${weight.name}-helper`}
              aria-invalid={weightError ? true : undefined}
              className="text-[18px]/[normal] box-border [flex:1_1_0] w-0 min-w-0 self-stretch lg:self-auto bg-transparent text-[#0B3B5C] font-poppins font-semibold text-left outline-none"
            />
            <span aria-hidden="true" className="text-[14px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">
              {weight.suffix}
            </span>
          </div>
          {weightError && (
            <p id={`${weight.name}-error`} className="box-border w-full h-fit flex flex-row gap-[8px] justify-start items-start">
              <Icon name="circle-alert" fill="#C23B35" className="box-border w-[16px] shrink-0 h-[16px] mt-[2px]" />
              <span className="text-[13px]/[20px] box-border text-[#C23B35] font-inter font-medium text-left">{weightError}</span>
            </p>
          )}
        </div>

        {/* Keyed by the submitted value so the uncontrolled input shows it again after an error. */}
        <PriceField key={state.values.harga} {...PRICE_FIELD} defaultValue={state.values.harga} error={state.errors.harga} layout="stacked" />
      </div>

      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[16px] sm:p-[16px_24px_24px_24px] justify-start items-start bg-[#FFFFFF] [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#E2E8F0]">
        {/* A stable live region, so a form-level error is announced when it appears. */}
        <div role="status" className="contents">
          {state.formError && (
            <p className="box-border w-full h-fit flex flex-row gap-[10px] p-[12px_14px] justify-start items-start bg-[#FDECEC] rounded-[12px]">
              <Icon name="circle-alert" fill="#C23B35" className="box-border w-[18px] shrink-0 h-[18px] mt-[1px]" />
              <span className="text-[14px]/[20px] box-border text-[#C23B35] font-inter font-semibold text-left">{state.formError}</span>
            </p>
          )}
        </div>
        <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-start items-start">
          <Link
            href={cancelHref}
            className={`box-border [flex:1_1_0] h-fit flex flex-row gap-[8px] p-[13px_16px] justify-center items-center bg-[#FFFFFF] [outline:1.5px_solid_#0F6CB8] [outline-offset:-0.75px] rounded-[999px] ${OUTLINE_HOVER} ${PRESS} ${FOCUS_RING}`}
          >
            <span className="text-[15px]/[normal] box-border text-[#0F6CB8] font-poppins font-semibold text-left [white-space:nowrap]">{EDIT_LISTING.cancelLabel}</span>
          </Link>
          <SaveButton />
        </div>
      </div>
    </form>
  )
}

function SaveButton() {
  const EDIT_LISTING = editListing(useTranslations('dashboard.nelayan.listing'))
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={`box-border [flex:1.4_1_0] h-fit flex flex-row gap-[8px] p-[14px_16px] justify-center items-center bg-[#0F6CB8] rounded-[999px] cursor-pointer disabled:cursor-wait disabled:opacity-80 ${pending ? '' : `${SOLID_HOVER} ${PRESS}`} ${FOCUS_RING}`}
    >
      <Icon
        name={pending ? 'loader-circle' : 'save'}
        fill="#FFFFFF"
        className={`box-border w-[16px] shrink-0 h-[16px] ${pending ? 'motion-safe:animate-spin' : ''}`}
      />
      <span className="text-[15px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">
        {pending ? EDIT_LISTING.savingLabel : EDIT_LISTING.saveLabel}
      </span>
    </button>
  )
}
