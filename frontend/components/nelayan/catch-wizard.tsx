'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { CatchModal, STEP_BODY } from '@/components/nelayan/catch-modal'
import { CatchFooter } from '@/components/nelayan/catch-footer'
import { StepHeading } from '@/components/nelayan/step-heading'
import { Icon } from '@/components/ui/icon'
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
import { queueCatch } from '@/lib/offline/storage'
import { catchTimestamp } from '@/lib/catches/model-inputs'

// What the user has entered so far. Each step writes its answer on "Lanjut", and steps 2+ also on "Kembali".
type CatchAnswers = {
  category?: string
  // What the fisher typed for "Lainnya"; it becomes the stored category name.
  otherName?: string
  weight?: number
  time?: string
  condition?: string
  ice?: string
  photo?: CatchPhoto
}

// Heading of each step, focused when the step changes so keyboard and screen-reader users land on the new question.
const STEP_HEADING_IDS = ['category-title', 'volume-title', 'waktu-title', 'kondisi-title', 'es-title', 'foto-title']
const SAVED_HEADING_ID = 'tersimpan-title'

// The "Tambah Tangkapan" modal as a client-side wizard: one route, the step body swapped in place. It builds its own
// copy: the photo step's captions are functions, which a server page can't pass down as props. `exitHref` is where
// closing and "Batal" go: the dashboard, or the offline page (app/offline) when the app opened without signal.
export function CatchWizard({ exitHref = '/nelayan' }: { exitHref?: string }) {
  const t = useTranslations('dashboard.nelayan.catch')
  const categoryName = useTranslations('common.category')
  const modal = { ...catchModal(t), closeHref: exitHref }
  const categoryCopy = categoryStep(t, categoryName)
  const category = { ...categoryCopy, cancel: { ...categoryCopy.cancel, href: exitHref } }
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

  // Saved on the device: the heading of the done view takes focus, as a new step's would.
  useEffect(() => {
    if (status === 'saved-offline') document.getElementById(SAVED_HEADING_ID)?.focus()
  }, [status])

  // Offline, the catch goes to the device's queue instead; online, it is saved and graded, and
  // submitCatch redirects to the result. A failed request falls back to the same local queue, so
  // nothing entered at sea is lost.
  async function submit(entered: CatchAnswers) {
    const { category: species, otherName, weight, time: hauledAt, condition: alive, ice: iceLevel, photo: taken } = entered
    if (!species || !weight || !hauledAt || !alive || !iceLevel || !taken) return

    // The answers and the photo go into the device's queue as entered; OfflineSync sends them through the same save
    // as an online catch once the connection is back. The haul time is fixed now, while "pagi" still means this morning.
    const queueLocally = async () => {
      try {
        await queueCatch({
          catchTime: catchTimestamp(hauledAt),
          answers: { category: species, otherName, weight, time: hauledAt, condition: alive, ice: iceLevel },
          photo: taken.blob,
        })
        setStatus('saved-offline')
      } catch (error) {
        // Nothing to fall back to: the device can't store it (private window, storage full). Stay on the photo step.
        console.error('Gagal simpan tangkapan di perangkat:', error)
        setStatus(undefined)
      }
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      await queueLocally()
      return
    }

    setStatus('analyzing')
    const form = new FormData()
    form.set('category', species)
    if (otherName) form.set('lainnya', otherName)
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
      await queueLocally()
    }
  }

  return (
    <CatchModal {...modal} currentStep={step}>
      {step === 0 && (
        <CategoryForm
          {...category}
          defaultValue={answers.category}
          defaultOtherName={answers.otherName}
          onNext={(value, otherName) => {
            setAnswers((current) => ({ ...current, category: value, otherName }))
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
      {step === 5 && status === 'saved-offline' && (
        // Done: the catch is in the device's queue. The photo step's "Analisis foto" would queue it a second time,
        // so it gives way to "Catat tangkapan lain" (a fresh wizard) and "Selesai".
        <form
          onSubmit={(event) => {
            event.preventDefault()
            setAnswers({})
            setStatus(undefined)
            setStep(0)
          }}
          className="contents"
        >
          <div className={`${STEP_BODY} flex flex-col gap-[16px] justify-start items-start`}>
            <StepHeading id={SAVED_HEADING_ID} title={t('photo.savedOfflineTitle')} description={t('photo.savedOffline')} descriptionWraps />
            <p className="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] p-[12px_16px] justify-start items-start bg-[#E8F8F2] rounded-[12px]">
              <Icon name="circle-check" fill="#17704A" className="box-border w-[20px] shrink-0 h-[20px]" />
              <span className="text-[14px]/[20px] box-border [flex:1_1_0] text-[#17704A] font-inter font-medium text-left">{t('photo.savedOfflineNote')}</span>
            </p>
          </div>
          <CatchFooter back={{ href: exitHref, label: t('photo.savedOfflineDone') }} submitLabel={t('photo.savedOfflineAnother')} />
        </form>
      )}
      {step === 5 && status !== 'saved-offline' && (
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
