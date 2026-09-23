// public/sw.js
//
// ByCatch Loop's service worker, registered by components/pwa/service-worker.tsx (production only).
//
// Its one job: when a page can't load for lack of signal, show /offline — where a fisher can still log a catch into
// the device's queue — instead of the browser's "no internet" page. It keeps only that page and the public files it
// needs (build assets, the category photos, icons). Dashboards, listings and anything else per user are never stored,
// so nothing of one account stays on a shared device (PRD §4). Server Actions and data requests pass straight through.
//
// Bump VERSION when this file's caching changes; the build's own assets are content-hashed and need no bump.

const VERSION = 'v1'
// The offline page's HTML.
const SHELL_CACHE = `bycatch-shell-${VERSION}`
// Hashed build files, fonts, category photos and icons: never change under the same URL, so cache-first.
const STATIC_CACHE = `bycatch-static-${VERSION}`
const OFFLINE_URL = '/offline'

// The wizard's category cards. They render only once the wizard opens, so they aren't in the page's HTML.
const CATEGORY_IMAGES = ['campuran', 'teri', 'udang', 'cumi-cumi-sotong', 'ikan-pelagis-kecil', 'ikan-demersal', 'rajungan'].map(
  (name) => `/images/nelayan/kategori/${name}.jpg`
)

// How often an online page load refreshes the saved offline page, so it follows new deploys.
const REFRESH_EVERY = 10 * 60 * 1000
let lastRefresh = 0

// "/_next/static/chunks/…" in HTML attributes, and "static/chunks/…" inside the page's inline RSC payload (which lists
// the chunks a client component loads). Both become absolute build-asset URLs.
function assetUrls(text) {
  const urls = new Set()
  for (const match of text.matchAll(/(?:\/_next\/)?(static\/(?:chunks|css|media)\/[^"'\\\s)]+)/g)) urls.add(`/_next/${match[1]}`)
  return [...urls]
}

async function cacheIfMissing(cache, url) {
  if (await cache.match(url)) return
  const response = await fetch(url)
  if (response.ok) await cache.put(url, response)
}

// Fetch /offline and everything it needs to run without a network: its scripts and styles, the fonts those styles
// load, and the category photos.
async function saveOfflinePage() {
  const response = await fetch(OFFLINE_URL, { credentials: 'same-origin', cache: 'no-store' })
  if (!response.ok) return
  const html = await response.clone().text()
  const staticCache = await caches.open(STATIC_CACHE)
  const assets = assetUrls(html)

  await Promise.all([...assets, ...CATEGORY_IMAGES, '/icons/icon-192.png'].map((url) => cacheIfMissing(staticCache, url).catch(() => {})))
  // Fonts are referenced from inside the stylesheets.
  for (const css of assets.filter((url) => url.endsWith('.css'))) {
    const sheet = await staticCache.match(css)
    if (!sheet) continue
    const fonts = assetUrls(await sheet.text()).filter((url) => url.includes('/static/media/'))
    await Promise.all(fonts.map((url) => cacheIfMissing(staticCache, url).catch(() => {})))
  }

  await (await caches.open(SHELL_CACHE)).put(OFFLINE_URL, response)
  lastRefresh = Date.now()
}

self.addEventListener('install', (event) => {
  // A failed save (installed while offline) doesn't block the install; the next online page load retries it.
  event.waitUntil(saveOfflinePage().catch(() => {}).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('bycatch-') && key !== SHELL_CACHE && key !== STATIC_CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  )
})

async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE)
  const hit = await cache.match(request)
  if (hit) return hit
  const response = await fetch(request)
  if (response.ok) cache.put(request, response.clone())
  return response
}

// Network first, never stored: pages are per user. Without a network, the saved offline page.
async function navigate(event) {
  try {
    const response = await fetch(event.request)
    if (Date.now() - lastRefresh > REFRESH_EVERY) event.waitUntil(saveOfflinePage().catch(() => {}))
    return response
  } catch {
    const offline = await caches.match(OFFLINE_URL, { cacheName: SHELL_CACHE })
    return offline ?? Response.error()
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(navigate(event))
    return
  }
  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/images/nelayan/kategori/') || url.pathname.startsWith('/icons/')) {
    event.respondWith(cacheFirst(request))
    return
  }
  // next/image asks for a resized category photo; offline, the saved original stands in.
  const source = url.pathname === '/_next/image' ? url.searchParams.get('url') : null
  if (source && CATEGORY_IMAGES.includes(source)) {
    event.respondWith(fetch(request).catch(() => caches.match(source, { cacheName: STATIC_CACHE }).then((hit) => hit ?? Response.error())))
  }
})
