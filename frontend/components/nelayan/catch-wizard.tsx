'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CatchModal } from '@/components/nelayan/catch-modal'
import { CategoryForm } from '@/components/nelayan/category-form'
import { VolumeForm } from '@/components/nelayan/volume-form'
import { IconChoiceForm } from '@/components/nelayan/icon-choice-form'
import { PhotoForm, type CatchPhoto } from '@/components/nelayan/photo-form'
import type { CATCH_MODAL, CATEGORY_STEP, VOLUME_STEP, TIME_STEP, ICE_STEP, PHOTO_STEP } from '@/components/nelayan/catch-content'

// What the user has entered so far. Each step writes its answer on "Lanjut", and steps 2+ also on "Kembali".
type CatchAnswers = {
  category?: string
  weight?: number
  time?: string
  ice?: string
  photo?: CatchPhoto
}

type CatchWizardProps = {
  modal: typeof CATCH_MODAL
  category: typeof CATEGORY_STEP
  volume: typeof VOLUME_STEP
  time: typeof TIME_STEP
  ice: typeof ICE_STEP
  photo: typeof PHOTO_STEP
}

// Heading of each step, focused when the step changes so keyboard and screen-reader users land on the new question.
const STEP_HEADING_IDS = ['category-title', 'volume-title', 'waktu-title', 'es-title', 'foto-title']

// The "Tambah Tangkapan" modal as a client-side wizard: one route, the step body swapped in place.
export function CatchWizard({ modal, category, volume, time, ice, photo }: CatchWizardProps) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<CatchAnswers>({})
  const router = useRouter()

  // Only move focus on an actual step change, so the modal opens on page load without stealing it. Comparing
  // steps (rather than a "has mounted" flag) also holds up when Strict Mode runs the effect twice.
  const focusedStep = useRef(step)
  useEffect(() => {
    if (focusedStep.current === step) return
    focusedStep.current = step
    document.getElementById(STEP_HEADING_IDS[step])?.focus()
  }, [step])

  return (
    <CatchModal {...modal} currentStep={step}>
      {step === 0 && (
        <CategoryForm
          {...category}
          defaultValue={answers.category}
          onNext={(value) => {
            setAnswers((current) => ({ ...current, category: value }))
            setStep(1)
          }}
        />
      )}
      {step === 1 && (
        <VolumeForm
          {...volume}
          initialValue={answers.weight ?? volume.initialValue}
          onBack={(weight) => {
            setAnswers((current) => ({ ...current, weight }))
            setStep(0)
          }}
          onNext={(weight) => {
            setAnswers((current) => ({ ...current, weight }))
            setStep(2)
          }}
        />
      )}
      {step === 2 && (
        <IconChoiceForm
          {...time}
          defaultValue={answers.time}
          onBack={(value) => {
            setAnswers((current) => ({ ...current, time: value }))
            setStep(1)
          }}
          onNext={(value) => {
            setAnswers((current) => ({ ...current, time: value }))
            setStep(3)
          }}
        />
      )}
      {step === 3 && (
        <IconChoiceForm
          {...ice}
          defaultValue={answers.ice}
          onBack={(value) => {
            setAnswers((current) => ({ ...current, ice: value }))
            setStep(2)
          }}
          onNext={(value) => {
            setAnswers((current) => ({ ...current, ice: value }))
            setStep(4)
          }}
        />
      )}
      {step === 4 && (
        <PhotoForm
          {...photo}
          defaultPhoto={answers.photo}
          onBack={(value) => {
            setAnswers((current) => ({ ...current, photo: value }))
            setStep(3)
          }}
          onNext={(value) => {
            setAnswers((current) => ({ ...current, photo: value }))
            // Stand-in until the photo is graded: open the "Hasil Kesegaran" result, which shows sample figures.
            // The real flow submits `answers` here, passes `status` to PhotoForm as 'analyzing' while the request
            // runs (or 'saved-offline' once it is queued offline), then opens the result for that catch.
            router.push('/nelayan/catat/hasil')
          }}
        />
      )}
    </CatchModal>
  )
}
