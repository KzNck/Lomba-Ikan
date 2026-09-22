import Image from 'next/image'
import { currentAvatarUrl } from '@/lib/supabase/avatar'

type UserAvatarProps = {
  // Shown until the user has uploaded a photo: their initials, or the profile header's role icon.
  fallback: React.ReactNode
  // The circle's rendered width, for next/image.
  sizes: string
}

// The signed-in user's photo, filling its (positioned, clipped) circle. It reads the session token itself, so the
// header, sidebar and profile card show it without every page passing it down. Decorative: the name sits beside it.
export async function UserAvatar({ fallback, sizes }: UserAvatarProps) {
  const url = await currentAvatarUrl()
  if (!url) return fallback
  return <Image src={url} alt="" fill sizes={sizes} className="object-cover object-center" />
}
