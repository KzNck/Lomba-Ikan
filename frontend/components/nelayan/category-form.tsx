'use client'

import { useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/ui/icon'
import { StepHeading } from '@/components/nelayan/step-heading'
import { StepError } from '@/components/nelayan/step-error'
import { StepInfo } from '@/components/nelayan/step-info'
import { CatchFooter } from '@/components/nelayan/catch-footer'
import { CategoryOption, type CategoryOptionContent } from '@/components/nelayan/category-option'
import { STEP_BODY } from '@/components/nelayan/catch-modal'
import { OTHER_NAME_MAX } from '@/components/nelayan/catch-content'

type CategoryFormProps = {
  title: string
  description: string
  options: CategoryOptionContent[]
  error: string
  // The "Lainnya" name field, shown once that card is picked.
  other: { label: string; placeholder: string; helper: string; error: string }
  info: string
  cancel: { href: string; label: string }
  submitLabel: string
  // The category picked earlier, when the user comes back from a later step, and the name typed for "Lainnya".
  defaultValue?: string
  defaultOtherName?: string
  onNext: (category: string, otherName?: string) => void
}

const FIELD_NAME = 'kategori'
const OTHER = 'lainnya'
const OTHER_FIELD = 'kategori-lainnya'
const PER_ROW = 4

// Step 1 of the modal: "Step Kategori" plus the modal footer. The form uses `display: contents` so its two
// children sit directly in the modal's 28px column, as in the export.
export function CategoryForm({
  title,
  description,
  options,
  error,
  other,
  info,
  cancel,
  submitLabel,
  defaultValue,
  defaultOtherName,
  onNext,
}: CategoryFormProps) {
  const [showError, setShowError] = useState(false)
  const [showOtherError, setShowOtherError] = useState(false)
  const [selected, setSelected] = useState(defaultValue)
  const otherRef = useRef<HTMLInputElement>(null)
  // Picking "Lainnya" moves straight to its name field; coming back to the step with it already picked doesn't.
  const pickedOther = useRef(false)

  useEffect(() => {
    if (selected === OTHER && pickedOther.current) otherRef.current?.focus()
  }, [selected])

  const rows = []
  for (let i = 0; i < options.length; i += PER_ROW) rows.push(options.slice(i, i + PER_ROW))

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const entries = new FormData(event.currentTarget)
    const category = entries.get(FIELD_NAME)
    if (typeof category !== 'string') {
      setShowError(true)
      return
    }
    if (category !== OTHER) return onNext(category)

    // Collapse stray spaces so "  ikan   kakap " is stored as "ikan kakap".
    const otherName = String(entries.get(OTHER_FIELD) ?? '').replace(/\s+/g, ' ').trim()
    if (!otherName) {
      setShowOtherError(true)
      otherRef.current?.focus()
      return
    }
    onNext(category, otherName)
  }

  return (
    <form
      onSubmit={handleSubmit}
      onChange={(event) => {
        const target = event.target as unknown as HTMLInputElement
        if (target.name === FIELD_NAME) {
          setShowError(false)
          pickedOther.current = target.value === OTHER
          setSelected(target.value)
        }
        if (target.name === OTHER_FIELD) setShowOtherError(false)
      }}
      noValidate
      className="contents"
    >
      <div className={`${STEP_BODY} flex flex-col gap-[14px] justify-start items-start`}>
        <StepHeading id="category-title" title={title} description={description} />
        <div
          role="radiogroup"
          aria-labelledby="category-title"
          aria-describedby={showError ? 'category-title-description category-error' : 'category-title-description'}
          aria-invalid={showError || undefined}
          className="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] justify-start items-start"
        >
          {rows.map((row, index) => (
            <div key={index} className="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-start items-start">
              {row.map((option) => (
                <CategoryOption key={option.value} name={FIELD_NAME} defaultChecked={option.value === defaultValue} {...option} />
              ))}
            </div>
          ))}
        </div>
        {/* The "Lanjut ditekan tanpa memilih kategori" state. */}
        <StepError id="category-error" message={error} show={showError} />
        {selected === OTHER && (
          <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[6px] justify-start items-start">
            <label htmlFor={OTHER_FIELD} className="text-[15px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left">
              {other.label}
            </label>
            <div
              className={`box-border w-full h-[48px] shrink-0 flex flex-row gap-[10px] p-[0px_16px] justify-start items-center bg-[#FFFFFF] ${showOtherError ? '[outline:1.5px_solid_#C23B35]' : '[outline:1px_solid_#7F8FA4]'} [outline-offset:-0.5px] rounded-[12px] focus-within:[outline-color:#0F6CB8] focus-within:[box-shadow:0px_0px_0px_2px_#FFFFFF,_0px_0px_0px_4px_#0F6CB8]`}
            >
              <Icon name="fish" fill="#5B6B7C" className="box-border w-[18px] shrink-0 h-[18px]" />
              <input
                ref={otherRef}
                id={OTHER_FIELD}
                name={OTHER_FIELD}
                defaultValue={defaultOtherName}
                maxLength={OTHER_NAME_MAX}
                autoComplete="off"
                placeholder={other.placeholder}
                aria-describedby={showOtherError ? `${OTHER_FIELD}-helper ${OTHER_FIELD}-error` : `${OTHER_FIELD}-helper`}
                aria-invalid={showOtherError || undefined}
                className="text-[15px]/[normal] box-border [flex:1_1_0] w-0 min-w-0 bg-transparent text-[#0B3B5C] placeholder:text-[#7F8FA4] font-inter font-medium text-left outline-none"
              />
            </div>
            <p id={`${OTHER_FIELD}-helper`} className="text-[13px]/[normal] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">
              {other.helper}
            </p>
            <StepError id={`${OTHER_FIELD}-error`} message={other.error} show={showOtherError} />
          </div>
        )}
        <StepInfo text={info} align="start" />
      </div>
      <CatchFooter back={cancel} submitLabel={submitLabel} />
    </form>
  )
}
