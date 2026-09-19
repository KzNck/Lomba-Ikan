'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// off → starting (permission prompt) → live, or → denied when the camera can't be opened (permission refused,
// no camera, or an insecure origin where `navigator.mediaDevices` is missing).
export type WebcamStatus = 'off' | 'starting' | 'live' | 'denied'

export function useWebcam() {
  const [status, setStatus] = useState<WebcamStatus>('off')
  const streamRef = useRef<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  // Bumped by stop(), so a permission prompt answered after stop() doesn't leave a camera running.
  const requestRef = useRef(0)

  const release = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }, [])

  const stop = useCallback(() => {
    requestRef.current += 1
    release()
    setStatus('off')
  }, [release])

  const start = useCallback(async () => {
    const request = ++requestRef.current
    setStatus('starting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      if (request !== requestRef.current) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }
      streamRef.current = stream
      setStatus('live')
    } catch {
      if (request === requestRef.current) setStatus('denied')
    }
  }, [])

  // Callback ref for the <video>: it only mounts once the stream is live, so attach the stream as it appears.
  const attachVideo = useCallback((video: HTMLVideoElement | null) => {
    videoRef.current = video
    if (video) video.srcObject = streamRef.current
  }, [])

  // Grabs the current frame as a JPEG. A press that lands before the first frame waits for it.
  const capture = useCallback(async () => {
    const video = videoRef.current
    if (!video) return null
    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      await new Promise((resolve) => video.addEventListener('loadeddata', resolve, { once: true }))
    }
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)
    return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9))
  }, [])

  // Turn the camera off (and void any pending request) when the step unmounts (Kembali, closing the modal).
  useEffect(
    () => () => {
      requestRef.current += 1
      release()
    },
    [release],
  )

  return { status, start, stop, capture, attachVideo }
}
