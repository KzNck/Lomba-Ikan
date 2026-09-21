'use client'

import { useState } from 'react'
import { StepHeading } from '@/components/nelayan/step-heading'
import { StepError } from '@/components/nelayan/step-error'
import { StepInfo } from '@/components/nelayan/step-info'
import { CatchFooter } from '@/components/nelayan/catch-footer'
import { VolumeControl } from '@/components/nelayan/volume-control'
import { VolumeSlider } from '@/components/nelayan/volume-slider'
import { STEP_BODY } from '@/components/nelayan/catch-modal'

type VolumeFormProps = {
  title: string
  description: string
  unit: string
  // Slider range, and the smallest weight "Lanjut" accepts.
  min: number
  max: number
  minValid: number
  initialValue: number
  decreaseLabel: string
  increaseLabel: string
  error: string
  info: string
  backLabel: string
  submitLabel: string
  // Both hand back the current weight, so it survives a trip back to step 1.
  onBack: (weight: number) => void
  onNext: (weight: number) => void
}

// Step 2 of the modal: "Step Volume" plus the modal footer. Like step 1, the form is `display: contents` so its
// two children sit directly in the modal's 28px column.
export function VolumeForm(props: VolumeFormProps) {
  const { title, description, unit, min, max, minValid, initialValue, error, info, backLabel, submitLabel, onBack, onNext } = props
  const [value, setValue] = useState(initialValue)
  const [showError, setShowError] = useState(false)

  function handleChange(next: number) {
    setValue(next)
    setShowError(false)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (value < minValid) {
      setShowError(true)
      return
    }
    onNext(value)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="contents">
      <div className={`${STEP_BODY} flex flex-col gap-[16px] justify-start items-start`}>
        <StepHeading id="volume-title" title={title} description={description} />
        <VolumeControl
          value={value}
          min={min}
          max={max}
          unit={unit}
          decreaseLabel={props.decreaseLabel}
          increaseLabel={props.increaseLabel}
          invalid={showError}
          onChange={handleChange}
        />
        {/* The "Lanjut ditekan saat berat 0 kg" state. */}
        <StepError id="volume-error" message={error} show={showError} />
        <VolumeSlider
          name="berat"
          value={value}
          min={min}
          max={max}
          unit={unit}
          labelledBy="volume-title"
          describedBy={showError ? 'volume-title-description volume-error' : 'volume-title-description'}
          invalid={showError}
          onChange={handleChange}
        />
        <StepInfo text={info} align="center" />
      </div>
      <CatchFooter back={{ label: backLabel, onClick: () => onBack(value) }} submitLabel={submitLabel} />
    </form>
  )
}
