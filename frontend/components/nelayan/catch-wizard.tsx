'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { CatchModal } from '@/components/nelayan/catch-modal'
import { CategoryForm } from '@/components/nelayan/category-form'
import { VolumeForm } from '@/components/nelayan/volume-form'
import { IconChoiceForm } from '@/components/nelayan/icon-choice-form'
import { PhotoForm, type CatchPhoto } from '@/components/nelayan/photo-form'
import {
  catchModal,
  categoryStep,
  conditionStep,
  iceStep,
  photoStep,
  timeStep,
  volumeStep,
} from '@/components/nelayan/catch-content'
import { submitCatch } from '@/app/nelayan/actions'
import { saveCatchLocally } from '@/lib/offline/storage'
import { catchTimestamp, toModelInputs } from '@/lib/catches/model-inputs'

// What the user has entered so far. Each step writes its answer on "Lanjut", and steps 2+ also on "Kembali".
type CatchAnswers = {
  category?: string
  weight?: number
  time?: string
  condition?: string
  ice?: string
  photo?: CatchPhoto
}

// Heading of each step, focused when the step changes so keyboard and screen-reader users land on the new question.
const STEP_HEADING_IDS = ['category-title', 'volume-title', 'waktu-title', 'kondisi-title', 'es-title', 'foto-title']

// The "Tambah Tangkapan" modal as a client-side wizard: one route, the step body swapped in place. It builds its own
// copy: the photo step's captions are functions, which a server page can't pass down as props.
export function CatchWizard() {
  const t = useTranslations('dashboard.nelayan.catch')
  const categoryName = useTranslations('common.category')
  const modal = catchModal(t)
  const category = categoryStep(t, categoryName)
  const volume = volumeStep(t)
  const time = timeStep(t)
  const condition = conditionStep(t)
  const ice = iceStep(t)
  const photo = photoStep(t)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<CatchAnswers>({})
  const [status, setStatus] = useState<'analyzing' | 'saved-offline' | undefined>()

  // Only move focus on an actual step change, so the modal opens on page load without stealing it. Comparing
  // steps (rather than a "has mounted" flag) also holds up when Strict Mode runs the effect twice.
  const focusedStep = useRef(step)
  useEffect(() => {
    if (focusedStep.current === step) return
    focusedStep.current = step
    document.getElementById(STEP_HEADING_IDS[step])?.focus()
  }, [step])

  // Offline, the catch goes to the device's queue instead; online, it is saved and graded, and
  // submitCatch redirects to the result. A failed request falls back to the same local queue, so
  // nothing entered at sea is lost.
  async function submit(entered: CatchAnswers) {
    const { category: species, weight, time: hauledAt, condition: alive, ice: iceLevel, photo: taken } = entered
    if (!species || !weight || !hauledAt || !alive || !iceLevel || !taken) return

    const queueLocally = () => {
      // The queued row carries the same model inputs a synced one would, so the
      // catch can be graded from it once the device is back online.
      const inputs = toModelInputs({ category: species, time: hauledAt, ice: iceLevel, condition: alive })
      saveCatchLocally({
        species,
        weight_kg: weight,
        catch_location: '',
        catch_time: catchTimestamp(hauledAt),
        storage_method: inputs.storage_method,
        vessel_name: '-',
        status_ikan: inputs.status_ikan,
        ice_to_fish_ratio: inputs.ice_to_fish_ratio,
        ambient_temp_celsius: inputs.ambient_temp_celsius,
        fish_category: inputs.fish_category,
      })
      setStatus('saved-offline')
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      queueLocally()
      return
    }

    setStatus('analyzing')
    const form = new FormData()
    form.set('category', species)
    form.set('weight', String(weight))
    form.set('time', hauledAt)
    form.set('kondisi', alive)
    form.set('ice', iceLevel)
    form.set('photo', taken.blob, 'catch.jpg')

    try {
      await submitCatch(form)
    } catch (error) {
      // A redirect from the action surfaces as a thrown control-flow signal; let it through.
      if (error && typeof error === 'object' && 'digest' in error) throw error
      console.error('Gagal simpan tangkapan:', error)
      queueLocally()
    }
  }

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
          {...condition}
          defaultValue={answers.condition}
          onBack={(value) => {
            setAnswers((current) => ({ ...current, condition: value }))
            setStep(2)
          }}
          onNext={(value) => {
            setAnswers((current) => ({ ...current, condition: value }))
            setStep(4)
          }}
        />
      )}
      {step === 4 && (
        <IconChoiceForm
          {...ice}
          defaultValue={answers.ice}
          onBack={(value) => {
            setAnswers((current) => ({ ...current, ice: value }))
            setStep(3)
          }}
          onNext={(value) => {
            setAnswers((current) => ({ ...current, ice: value }))
            setStep(5)
          }}
        />
      )}
      {step === 5 && (
        <PhotoForm
          {...photo}
          defaultPhoto={answers.photo}
          status={status}
          onBack={(value) => {
            setAnswers((current) => ({ ...current, photo: value }))
            setStep(4)
          }}
          onNext={(value) => {
            setAnswers((current) => ({ ...current, photo: value }))
            void submit({ ...answers, photo: value })
          }}
        />
      )}
    </CatchModal>
  )
}
