// Foto tangkapan diperkecil dan disimpan ulang sebagai JPEG di browser sebelum
// dikirim. Foto HP bisa 3–5 MB, sedangkan server action menerima paling banyak
// beberapa MB (serverActions.bodySizeLimit di next.config.ts); JPEG juga satu
// format yang pasti bisa dibaca Freshness API dan ditampilkan di listing.

/** Sisi terpanjang foto yang dikirim. Cukup untuk fitur warna model dan untuk kartu listing. */
const MAX_EDGE = 1600
const JPEG_QUALITY = 0.85

/**
 * JPEG yang sudah diperkecil, atau file aslinya kalau browser tidak bisa
 * membacanya (misalnya HEIC di Chrome) — Freshness API tetap bisa menilainya.
 */
export async function prepareUpload(photo: Blob): Promise<Blob> {
    let bitmap: ImageBitmap
    try {
        // from-image: foto HP yang diputar lewat EXIF tetap tegak setelah disimpan ulang.
        bitmap = await createImageBitmap(photo, { imageOrientation: 'from-image' })
    } catch {
        return photo
    }

    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) {
        bitmap.close()
        return photo
    }
    context.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()

    const jpeg = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY))
    return jpeg ?? photo
}

/** Format yang bisa ditampilkan semua browser, jadi aman dipakai sebagai foto listing. */
export function isWebImage(photo: Blob): boolean {
    return ['image/jpeg', 'image/png', 'image/webp'].includes(photo.type)
}
