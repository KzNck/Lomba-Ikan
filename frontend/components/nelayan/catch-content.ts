// All copy and imagery for the "Tambah Tangkapan" modal. Edit here to swap content without touching layout.
// Text lives in messages/*.json under `dashboard.nelayan.catch`; category names under `common.category`.
import type { CategoryOptionContent } from '@/components/nelayan/category-option'
import type { IconOptionContent } from '@/components/nelayan/icon-option'
import type { Translator } from '@/lib/i18n/translator'

type CatchT = Translator<'dashboard.nelayan.catch'>

// The categories the wizard offers, as stored in `catches.species`, with their card art. "Lainnya" has an icon.
export const CATEGORY_OPTIONS = [
  { value: 'campuran', image: '/images/nelayan/kategori/campuran.jpg' },
  { value: 'teri', image: '/images/nelayan/kategori/teri.jpg' },
  { value: 'udang', image: '/images/nelayan/kategori/udang.jpg' },
  { value: 'cumi-cumi-sotong', image: '/images/nelayan/kategori/cumi-cumi-sotong.jpg' },
  { value: 'ikan-pelagis-kecil', image: '/images/nelayan/kategori/ikan-pelagis-kecil.jpg' },
  { value: 'ikan-demersal', image: '/images/nelayan/kategori/ikan-demersal.jpg' },
  { value: 'rajungan', image: '/images/nelayan/kategori/rajungan.jpg' },
  { value: 'lainnya', icon: 'ellipsis' },
] as const

export type CategoryValue = (typeof CATEGORY_OPTIONS)[number]['value']

// The name typed for "Lainnya": long enough for "Ikan Kakap Merah", short enough for a listing card's title.
export const OTHER_NAME_MAX = 40

// Breadcrumb on the dashboard behind the modal, for every step and the "Hasil Kesegaran" result.
export function catchBreadcrumb(t: CatchT) {
  return {
    trail: [{ href: '/nelayan', label: t('breadcrumbHome') }],
    current: t('title'),
  }
}

export function catchModal(t: CatchT) {
  return {
    title: t('title'),
    subtitle: t('subtitle'),
    closeHref: '/nelayan',
    closeLabel: t('close'),
    steps: [t('steps.category'), t('steps.volume'), t('steps.time'), t('steps.condition'), t('steps.ice'), t('steps.photo')],
  }
}

// `categoryName` is `common.category`'s translator, shared with every listing that shows the category.
export function categoryStep(t: CatchT, categoryName: Translator<'common.category'>) {
  return {
    title: t('category.title'),
    description: t('category.description'),
    // Category art is decorative (each card is labelled), so the images carry no alt text.
    options: CATEGORY_OPTIONS.map((option) => ({ ...option, label: categoryName(option.value) })) satisfies CategoryOptionContent[],
    // Shown when "Lanjut" is pressed with nothing selected.
    error: t('category.error'),
    // "Lainnya" asks what the catch is; the name becomes the listing's category (see submitCatch).
    other: {
      label: t('category.otherLabel'),
      placeholder: t('category.otherPlaceholder'),
      helper: t('category.otherHelper'),
      error: t('category.otherError'),
    },
    info: t('category.info'),
    cancel: { href: '/nelayan', label: t('category.cancel') },
    submitLabel: t('next'),
  }
}

export function volumeStep(t: CatchT) {
  return {
    title: t('volume.title'),
    description: t('volume.description'),
    unit: 'kg',
    min: 0,
    max: 200,
    minValid: 1,
    // Starts empty so the weight is always entered, never accepted as a pre-filled guess.
    initialValue: 0,
    decreaseLabel: t('volume.decrease'),
    increaseLabel: t('volume.increase'),
    // Shown when "Lanjut" is pressed below `minValid`.
    error: t('volume.error'),
    info: t('volume.info'),
    backLabel: t('back'),
    submitLabel: t('next'),
  }
}

export function timeStep(t: CatchT) {
  return {
    name: 'waktu',
    title: t('time.title'),
    description: t('time.description'),
    options: [
      { value: 'pagi', label: t('time.options.pagi'), icon: 'sunrise' },
      { value: 'siang', label: t('time.options.siang'), icon: 'sun' },
      { value: 'sore', label: t('time.options.sore'), icon: 'sunset' },
      { value: 'kemarin-malam', label: t('time.options.kemarin-malam'), icon: 'moon' },
    ] satisfies IconOptionContent[],
    // Shown when "Lanjut" is pressed with nothing selected. Not in the export; worded after step 1's message.
    error: t('time.error'),
    backLabel: t('back'),
    submitLabel: t('next'),
  }
}

// Not in the export, which has five steps. The model grades a live catch (A) and a dead one (B) differently, so
// without this question every catch would be graded as dead and grade A could never come out — see
// lib/catches/model-inputs.ts. Worded and built like the other icon-card steps.
export function conditionStep(t: CatchT) {
  return {
    name: 'kondisi',
    title: t('condition.title'),
    description: t('condition.description'),
    options: [
      { value: 'hidup', label: t('condition.hidup'), description: t('condition.hidupDescription'), icon: 'leaf' },
      { value: 'mati', label: t('condition.mati'), description: t('condition.matiDescription'), icon: 'fish' },
    ] satisfies IconOptionContent[],
    error: t('condition.error'),
    backLabel: t('back'),
    submitLabel: t('next'),
  }
}

export function iceStep(t: CatchT) {
  return {
    name: 'es',
    title: t('ice.title'),
    description: t('ice.description'),
    options: [
      { value: 'banyak', label: t('ice.banyak'), description: t('ice.banyakDescription'), icon: 'snowflake' },
      { value: 'sedikit', label: t('ice.sedikit'), description: t('ice.sedikitDescription'), icon: 'thermometer-snowflake' },
      { value: 'tanpa', label: t('ice.tanpa'), description: t('ice.tanpaDescription'), icon: 'thermometer-sun' },
    ] satisfies IconOptionContent[],
    // Shown when "Lanjut" is pressed with nothing selected. Not in the export; worded after step 1's message.
    error: t('ice.error'),
    backLabel: t('back'),
    submitLabel: t('next'),
  }
}

export function photoStep(t: CatchT) {
  return {
    title: t('photo.title'),
    description: t('photo.description'),
    // Accessible name for the "Metode Foto" toggle (not shown).
    methodLabel: t('photo.methodLabel'),
    methods: { webcam: t('photo.webcam'), upload: t('photo.upload') },
    webcamOff: {
      title: t('photo.webcamOffTitle'),
      description: t('photo.webcamOffDescription'),
      action: t('photo.webcamOffAction'),
    },
    webcamDenied: {
      title: t('photo.webcamDeniedTitle'),
      description: t('photo.webcamDeniedDescription'),
      action: t('photo.webcamDeniedAction'),
    },
    // Not in the export: the live camera view, and "Unggah Foto" before a file is chosen.
    webcamLive: { videoLabel: t('photo.webcamLiveLabel'), caption: t('photo.webcamLiveCaption'), action: t('photo.webcamLiveAction') },
    uploadEmpty: {
      title: t('photo.uploadEmptyTitle'),
      description: t('photo.uploadEmptyDescription'),
      action: t('photo.uploadEmptyAction'),
    },
    preview: {
      alt: t('photo.previewAlt'),
      // "Foto diambil pukul 07.42"; the time is formatted in the active locale by the form.
      takenCaption: (time: string) => t('photo.takenAt', { time }),
      uploadedCaption: (time: string) => t('photo.uploadedAt', { time }),
      retake: t('photo.retake'),
      // Not in the export: the same button in "Unggah Foto" mode.
      replace: t('photo.replace'),
    },
    // Shown when "Analisis foto" is pressed without a photo. Not in the export; worded after step 1's message.
    error: t('photo.error'),
    savedOffline: t('photo.savedOffline'),
    analyzing: { title: t('photo.analyzingTitle'), description: t('photo.analyzingDescription') },
    backLabel: t('back'),
    submitLabel: t('photo.submit'),
  }
}

export type CatchModalContent = ReturnType<typeof catchModal>
export type CategoryStepContent = ReturnType<typeof categoryStep>
export type VolumeStepContent = ReturnType<typeof volumeStep>
export type TimeStepContent = ReturnType<typeof timeStep>
export type ConditionStepContent = ReturnType<typeof conditionStep>
export type IceStepContent = ReturnType<typeof iceStep>
export type PhotoStepContent = ReturnType<typeof photoStep>
