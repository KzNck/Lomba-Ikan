'use client'

import { useRef, useState } from 'react'
import { useFormatter } from 'next-intl'
import Image from 'next/image'
import { Icon } from '@/components/ui/icon'
import { useWebcam } from '@/hooks/use-webcam'
import { StepHeading } from '@/components/nelayan/step-heading'
import { StepError } from '@/components/nelayan/step-error'
import { CatchFooter } from '@/components/nelayan/catch-footer'
import { PhotoMethodToggle, type PhotoMethod } from '@/components/nelayan/photo-method-toggle'
import { PhotoPlaceholder } from '@/components/nelayan/photo-placeholder'
import { PhotoFrame, PhotoMeta } from '@/components/nelayan/photo-frame'
import { PhotoAnalyzing } from '@/components/nelayan/photo-analyzing'
import type { PhotoStepContent } from '@/components/nelayan/catch-content'
import { prepareUpload } from '@/lib/photo/prepare-upload'
import { STEP_BODY } from '@/components/nelayan/catch-modal'

export type CatchPhoto = {
  blob: Blob
  // Object URL for the preview; revoked when the photo is replaced.
  url: string
  takenAt: Date
  source: PhotoMethod
}

type PhotoFormProps = PhotoStepContent & {
  // The photo from an earlier visit to this step.
  defaultPhoto?: CatchPhoto
  // Set by whoever submits the catch: "Menganalisis foto (online)" while the photo is graded, or the offline
  // banner once the photo is queued on the device. Left unset, the step is waiting for a photo.
  status?: 'analyzing' | 'saved-offline'
  // "Kembali" hands back the current photo (if any) so it survives the trip back.
  onBack: (photo: CatchPhoto | undefined) => void
  onNext: (photo: CatchPhoto) => void
}

const HEADING_ID = 'foto-title'
const ERROR_ID = 'foto-error'

// Step 5 of the modal: "Step 5 Foto" plus the modal footer. The photo comes from the webcam or a file; the
// photo area shows whichever of the empty, blocked, live and preview states applies.
export function PhotoForm(props: PhotoFormProps) {
  const { title, description, methods, preview, error, backLabel, submitLabel, defaultPhoto, status, onBack, onNext } = props
  const format = useFormatter()
  const [method, setMethod] = useState<PhotoMethod>(defaultPhoto?.source ?? 'webcam')
  const [photo, setPhoto] = useState(defaultPhoto)
  const [showError, setShowError] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const webcam = useWebcam()

  function replacePhoto(next: CatchPhoto) {
    if (photo) URL.revokeObjectURL(photo.url)
    setPhoto(next)
    setShowError(false)
  }

  // Starting the webcam or switching method is the user acting on the "no photo" error, so it clears it.
  function changeMethod(next: PhotoMethod) {
    webcam.stop()
    setMethod(next)
    setShowError(false)
  }

  function startWebcam() {
    setShowError(false)
    webcam.start()
  }

  async function takePhoto() {
    const blob = await webcam.capture()
    if (!blob) return
    replacePhoto({ blob, url: URL.createObjectURL(blob), takenAt: new Date(), source: 'webcam' })
    webcam.stop()
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    // Clear the input so choosing the same file again still fires a change.
    event.currentTarget.value = ''
    if (!file) return
    // Shrunk and re-encoded as JPEG here, so the preview shows exactly what is sent (see lib/photo/prepare-upload.ts).
    const blob = await prepareUpload(file)
    replacePhoto({ blob, url: URL.createObjectURL(blob), takenAt: new Date(), source: 'upload' })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'analyzing') return
    if (!photo) {
      setShowError(true)
      return
    }
    webcam.stop()
    onNext(photo)
  }

  const openFilePicker = () => fileInputRef.current?.click()

  function photoArea() {
    if (method === 'webcam' && webcam.status === 'live') {
      return (
        <PhotoFrame>
          <video
            ref={webcam.attachVideo}
            autoPlay
            playsInline
            muted
            aria-label={props.webcamLive.videoLabel}
            className="box-border w-full h-full object-contain object-center"
          />
          <PhotoMeta
            icon="camera"
            caption={props.webcamLive.caption}
            action={{ variant: 'solid', icon: 'camera', label: props.webcamLive.action, onClick: takePhoto }}
          />
        </PhotoFrame>
      )
    }
    if (method === 'webcam' && webcam.status === 'denied') {
      const { title, description, action } = props.webcamDenied
      return (
        <PhotoPlaceholder
          tone="error"
          icon="camera-off"
          title={title}
          description={description}
          action={{ icon: 'rotate-ccw', label: action, onClick: startWebcam }}
        />
      )
    }
    if (photo) {
      return (
        <PhotoFrame>
          <Image src={photo.url} alt={preview.alt} fill unoptimized sizes="656px" className="object-contain object-center" />
          <PhotoMeta
            icon="image"
            caption={(photo.source === 'webcam' ? preview.takenCaption : preview.uploadedCaption)(format.dateTime(photo.takenAt, 'time'))}
            action={
              method === 'webcam'
                ? { variant: 'outline', icon: 'rotate-ccw', label: preview.retake, onClick: startWebcam, disabled: webcam.status === 'starting' }
                : { variant: 'outline', icon: 'rotate-ccw', label: preview.replace, onClick: openFilePicker }
            }
          />
        </PhotoFrame>
      )
    }
    if (method === 'webcam') {
      const { title, description, action } = props.webcamOff
      return (
        <PhotoPlaceholder
          tone="default"
          icon="camera"
          title={title}
          description={description}
          action={{ icon: 'camera', label: action, onClick: startWebcam, disabled: webcam.status === 'starting' }}
        />
      )
    }
    const { title, description, action } = props.uploadEmpty
    return (
      <PhotoPlaceholder
        tone="default"
        icon="upload"
        title={title}
        description={description}
        action={{ icon: 'upload', label: action, onClick: openFilePicker }}
      />
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="contents">
      <div className={`${STEP_BODY} flex flex-col gap-[16px] justify-start items-start`}>
        <StepHeading id={HEADING_ID} title={title} description={description} descriptionWraps />
        {status === 'analyzing' ? (
          <PhotoAnalyzing {...props.analyzing} />
        ) : (
          <>
            <PhotoMethodToggle
              label={props.methodLabel}
              options={[
                { value: 'webcam', label: methods.webcam, icon: 'camera' },
                { value: 'upload', label: methods.upload, icon: 'upload' },
              ]}
              value={method}
              onChange={changeMethod}
            />
            {photoArea()}
            <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFile} />
            <StepError id={ERROR_ID} message={error} show={showError} />
            {status === 'saved-offline' && (
              <div role="status" className="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] p-[12px_16px] justify-start items-center bg-[#E8F8F2] rounded-[12px]">
                <Icon name="circle-check" fill="#17704A" className="box-border w-[20px] shrink-0 h-[20px]" />
                <p className="text-[14px]/[normal] box-border [flex:1_1_0] text-[#17704A] font-inter font-medium text-left">{props.savedOffline}</p>
              </div>
            )}
          </>
        )}
      </div>
      <CatchFooter back={{ label: backLabel, onClick: () => onBack(photo) }} submitLabel={submitLabel} />
    </form>
  )
}
