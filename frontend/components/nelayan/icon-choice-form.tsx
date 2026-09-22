'use client'

import { useRef, useState } from 'react'
import { StepHeading } from '@/components/nelayan/step-heading'
import { StepError } from '@/components/nelayan/step-error'
import { CatchFooter } from '@/components/nelayan/catch-footer'
import { IconOption, type IconOptionContent } from '@/components/nelayan/icon-option'
import { STEP_BODY } from '@/components/nelayan/catch-modal'

type IconChoiceFormProps = {
  // Prefix for the heading and error ids, and the radio group's form field name.
  name: string
  title: string
  description: string
  options: IconOptionContent[]
  error: string
  backLabel: string
  submitLabel: string
  // The answer picked earlier, when the user returns to this step.
  defaultValue?: string
  // "Kembali" hands back the current pick (if any) so it survives the trip back.
  onBack: (value: string | undefined) => void
  onNext: (value: string) => void
}

// A step whose answer is one card from a single row of icon cards ("Step 3 Waktu", "Step 4 Es"), plus the modal footer.
// Like the other steps, the form is `display: contents` so its two children sit in the modal's 28px column.
export function IconChoiceForm(props: IconChoiceFormProps) {
  const { name, title, description, options, error, backLabel, submitLabel, defaultValue, onBack, onNext } = props
  const [showError, setShowError] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const titleId = `${name}-title`
  const errorId = `${name}-error`

  function selected() {
    const value = formRef.current && new FormData(formRef.current).get(name)
    return typeof value === 'string' ? value : undefined
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = selected()
    if (value === undefined) {
      setShowError(true)
      return
    }
    onNext(value)
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} onChange={() => setShowError(false)} noValidate className="contents">
      <div className={`${STEP_BODY} flex flex-col gap-[16px] justify-start items-start`}>
        <StepHeading id={titleId} title={title} description={description} />
        <div
          role="radiogroup"
          aria-labelledby={titleId}
          aria-describedby={showError ? `${titleId}-description ${errorId}` : `${titleId}-description`}
          aria-invalid={showError || undefined}
          className="box-border w-full h-fit shrink-0 grid grid-cols-2 md:flex md:flex-row gap-[12px] justify-start items-stretch md:items-start"
        >
          {options.map((option) => (
            <IconOption key={option.value} name={name} defaultChecked={option.value === defaultValue} {...option} />
          ))}
        </div>
        {/* Not drawn for this step; follows step 1's "Lanjut ditekan tanpa memilih" state. */}
        <StepError id={errorId} message={error} show={showError} />
      </div>
      <CatchFooter back={{ label: backLabel, onClick: () => onBack(selected()) }} submitLabel={submitLabel} />
    </form>
  )
}
