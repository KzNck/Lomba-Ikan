import type { MetadataRoute } from 'next'

// Makes ByCatch Loop installable ("Tambahkan ke layar utama" / "Install app"): its own window, the fish mark as the
// icon. Opens on Masuk, which sends a signed-in user straight to their dashboard. The service
// worker (public/sw.js) is what lets it open without signal; see components/pwa/service-worker.tsx.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ByCatch Loop',
    short_name: 'ByCatch Loop',
    description: 'A circular maritime platform that turns by-catch into added-value opportunities.',
    lang: 'en',
    start_url: '/auth/login',
    scope: '/',
    display: 'standalone',
    background_color: '#F7F9FC',
    theme_color: '#0B3B5C',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
