// lib/photo/avatar-crop.ts
//
// Posisi foto profil di dalam lingkarannya: zoom, geser, dan putar. Pratinjau di
// editor dan JPEG 512px yang diunggah digambar dengan fungsi yang sama
// (drawCrop), jadi yang terlihat saat mengatur persis yang tersimpan.
//
// Geseran disimpan relatif terhadap sisi lingkaran (0.1 = sepersepuluh sisi),
// bukan piksel, supaya pengaturan yang sama berlaku di ukuran mana pun —
// pratinjau 256px maupun hasil 512px. Semua aman dipanggil di server kecuali
// yang menyentuh canvas (renderAvatar, encodeSource).

export type Rotation = 0 | 90 | 180 | 270

export type AvatarCrop = {
    // 1 = sisi pendek foto pas selebar lingkaran.
    zoom: number
    // Pusat foto dari pusat lingkaran, dalam sisi lingkaran.
    x: number
    y: number
    rotation: Rotation
}

export const DEFAULT_CROP: AvatarCrop = { zoom: 1, x: 0, y: 0, rotation: 0 }
export const MAX_ZOOM = 4
/** Sisi foto profil yang diunggah; cuma tampil sebagai lingkaran kecil. */
export const AVATAR_EDGE = 512
/** Sisi terpanjang foto asli yang disimpan untuk diatur ulang nanti. */
export const SOURCE_EDGE = 1600
const JPEG_QUALITY = 0.88

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

function rotatedSize(width: number, height: number, rotation: Rotation): [number, number] {
    return rotation % 180 === 0 ? [width, height] : [height, width]
}

/** Zoom dalam batasnya, dan geseran sejauh foto masih menutupi seluruh lingkaran — tanpa celah kosong di tepi. */
export function clampCrop(crop: AvatarCrop, width: number, height: number): AvatarCrop {
    const [w, h] = rotatedSize(width, height, crop.rotation)
    const zoom = clamp(crop.zoom, 1, MAX_ZOOM)
    const scale = zoom / Math.min(w, h)
    const maxX = (w * scale - 1) / 2
    const maxY = (h * scale - 1) / 2
    return { zoom, rotation: crop.rotation, x: clamp(crop.x, -maxX, maxX), y: clamp(crop.y, -maxY, maxY) }
}

/** Gambar `image` di kotak `size`×`size` sesuai `crop`; lingkarannya adalah kotak ini. */
export function drawCrop(context: CanvasRenderingContext2D, image: ImageBitmap, size: number, crop: AvatarCrop) {
    const [w, h] = rotatedSize(image.width, image.height, crop.rotation)
    const scale = (size * crop.zoom) / Math.min(w, h)
    context.save()
    context.fillStyle = '#FFFFFF'
    context.fillRect(0, 0, size, size)
    context.imageSmoothingQuality = 'high'
    context.translate(size / 2 + crop.x * size, size / 2 + crop.y * size)
    context.rotate((crop.rotation * Math.PI) / 180)
    context.drawImage(image, (-image.width * scale) / 2, (-image.height * scale) / 2, image.width * scale, image.height * scale)
    context.restore()
}

function toJpeg(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve, reject) =>
        canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Gagal menyimpan foto'))), 'image/jpeg', JPEG_QUALITY)
    )
}

/** Foto profil jadi: JPEG persegi `AVATAR_EDGE`px, dipotong sesuai `crop`. */
export async function renderAvatar(image: ImageBitmap, crop: AvatarCrop): Promise<Blob> {
    const canvas = document.createElement('canvas')
    canvas.width = AVATAR_EDGE
    canvas.height = AVATAR_EDGE
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas tidak tersedia')
    drawCrop(context, image, AVATAR_EDGE, crop)
    return toJpeg(canvas)
}

/** Foto asli, diperkecil ke `SOURCE_EDGE`px — disimpan supaya foto bisa diatur ulang tanpa kehilangan tepinya. */
export async function encodeSource(image: ImageBitmap): Promise<Blob> {
    const scale = Math.min(1, SOURCE_EDGE / Math.max(image.width, image.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(image.width * scale)
    canvas.height = Math.round(image.height * scale)
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas tidak tersedia')
    context.imageSmoothingQuality = 'high'
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    return toJpeg(canvas)
}

/** Pengaturan dari user_metadata atau form — null kalau bentuknya tidak dikenal. */
export function parseCrop(value: unknown): AvatarCrop | null {
    const raw = typeof value === 'string' ? safeJson(value) : value
    if (!raw || typeof raw !== 'object') return null
    const { zoom, x, y, rotation } = raw as Record<string, unknown>
    const finite = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n)
    if (!finite(zoom) || !finite(x) || !finite(y) || ![0, 90, 180, 270].includes(rotation as number)) return null
    return { zoom: clamp(zoom, 1, MAX_ZOOM), x: clamp(x, -MAX_ZOOM, MAX_ZOOM), y: clamp(y, -MAX_ZOOM, MAX_ZOOM), rotation: rotation as Rotation }
}

function safeJson(value: string): unknown {
    try {
        return JSON.parse(value)
    } catch {
        return null
    }
}
