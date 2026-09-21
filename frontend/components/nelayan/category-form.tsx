'use client'

import { useState } from 'react'
import { StepHeading } from '@/components/nelayan/step-heading'
import { StepError } from '@/components/nelayan/step-error'
import { StepInfo } from '@/components/nelayan/step-info'
import { CatchFooter } from '@/components/nelayan/catch-footer'
import { CategoryOption, type CategoryOptionContent } from '@/components/nelayan/category-option'
import { STEP_BODY } from '@/components/nelayan/catch-modal'

type CategoryFormProps = {
  title: string
  description: string
  options: CategoryOptionContent[]
  error: string
  info: string
  cancel: { href: string; label: string }
  submitLabel: string
  // The category picked earlier, when the user comes back from a later step.
  defaultValue?: string
  onNext: (category: string) => void
}

const FIELD_NAME = 'kategori'
const PER_ROW = 4

// Step 1 of the modal: "Step Kategori" plus the modal footer. The form uses `display: contents` so its two
// children sit directly in the modal's 28px column, as in the export.
export function CategoryForm({ title, description, options, error, info, cancel, submitLabel, defaultValue, onNext }: CategoryFormProps) {
  const [showError, setShowError] = useState(false)

  const rows = []
  for (let i = 0; i < options.length; i += PER_ROW) rows.push(options.slice(i, i + PER_ROW))

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const category = new FormData(event.currentTarget).get(FIELD_NAME)
    if (typeof category !== 'string') {
      setShowError(true)
      return
    }
    onNext(category)
  }

  return (
    <form onSubmit={handleSubmit} onChange={() => setShowError(false)} noValidate className="contents">
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
        <StepInfo text={info} align="start" />
      </div>
      <CatchFooter back={cancel} submitLabel={submitLabel} />
    </form>
  )
}
