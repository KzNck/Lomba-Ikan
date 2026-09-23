// Antrean tangkapan yang dicatat tanpa sinyal, di IndexedDB perangkat ini. IndexedDB, bukan localStorage, karena
// fotonya ikut disimpan sebagai Blob: tanpa foto, tangkapan tidak bisa dinilai kesegarannya saat tersinkron.
//
// Yang disimpan adalah jawaban wizard apa adanya (bukan row yang sudah diterjemahkan), supaya sinkronisasi memakai
// jalur simpan yang sama dengan tangkapan online (submitCatch), plus waktu tangkap yang dihitung saat dicatat —
// jam "pagi"/"siang" dibaca relatif terhadap saat itu, bukan saat sinyal kembali. Lihat components/nelayan/offline-sync.tsx.

export type QueuedCatch = {
    // Dikirim sebagai local_id: sinkron ulang dengan id yang sama tidak membuat baris ganda.
    localId: string
    queuedAt: string
    // ISO; waktu tangkap yang sudah dihitung dari jawaban "Waktu" saat dicatat.
    catchTime: string
    answers: {
        category: string
        otherName?: string
        weight: number
        time: string
        condition: string
        ice: string
    }
    photo: Blob
}

const DB_NAME = 'bycatch-offline'
const STORE = 'catches'
// Tab lain (dan tombol "Keluar" di tab ini) diberi tahu saat isi antrean berubah.
const CHANNEL = 'bycatch-offline-queue'

function openDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1)
        request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'localId' })
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

async function withStore<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
    const db = await openDb()
    try {
        return await new Promise<T>((resolve, reject) => {
            const tx = db.transaction(STORE, mode)
            const request = run(tx.objectStore(STORE))
            tx.oncomplete = () => resolve(request.result)
            tx.onerror = () => reject(tx.error)
            tx.onabort = () => reject(tx.error)
        })
    } finally {
        db.close()
    }
}

/** Simpan tangkapan ke antrean. Melempar kalau perangkat tidak bisa menyimpannya (mis. penyimpanan penuh). */
export async function queueCatch(entry: Omit<QueuedCatch, 'localId' | 'queuedAt'>): Promise<QueuedCatch> {
    const queued: QueuedCatch = {
        ...entry,
        localId: `offline_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        queuedAt: new Date().toISOString(),
    }
    await withStore('readwrite', (store) => store.put(queued))
    changed()
    return queued
}

/** Isi antrean, yang paling lama dicatat lebih dulu. Kosong kalau IndexedDB tidak tersedia. */
export async function listQueued(): Promise<QueuedCatch[]> {
    if (typeof indexedDB === 'undefined') return []
    try {
        const entries = await withStore('readonly', (store) => store.getAll() as IDBRequest<QueuedCatch[]>)
        return entries.sort((a, b) => a.queuedAt.localeCompare(b.queuedAt))
    } catch {
        return []
    }
}

/** Hapus dari antrean setelah tersinkron — draft tidak boleh tertinggal di perangkat bersama (PRD §4). */
export async function removeQueued(localId: string): Promise<void> {
    await withStore('readwrite', (store) => store.delete(localId))
    changed()
}

// Jumlah antrean sebagai external store untuk useSyncExternalStore: nilainya disimpan di sini dan diperbarui
// secara async, karena IndexedDB tidak bisa dibaca sinkron.
let count = 0
const listeners = new Set<() => void>()
let channel: BroadcastChannel | null = null

async function refreshCount() {
    const next = (await listQueued()).length
    if (next === count) return
    count = next
    listeners.forEach((listener) => listener())
}

function changed() {
    channel?.postMessage('changed')
    void refreshCount()
}

export function subscribeQueuedCount(listener: () => void): () => void {
    if (!channel && typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel(CHANNEL)
        channel.onmessage = () => void refreshCount()
    }
    listeners.add(listener)
    void refreshCount()
    return () => listeners.delete(listener)
}

export const queuedCount = () => count
