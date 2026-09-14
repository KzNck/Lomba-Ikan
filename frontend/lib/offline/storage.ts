// lib/offline/storage.ts
//
// Helper penyimpanan tangkapan lokal (IndexedDB / LocalStorage fallback)
// saat nelayan berada di tengah laut tanpa sinyal internet.

import type { CreateCatchInput } from '@/types/database'

const OFFLINE_CATCHES_KEY = 'nelayan_offline_catches_queue'

export interface OfflineCatchEntry extends CreateCatchInput {
    local_id: string
    created_at_local: string
}

export function saveCatchLocally(catchData: CreateCatchInput): OfflineCatchEntry {
    const local_id = catchData.local_id || `offline_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    const entry: OfflineCatchEntry = {
        ...catchData,
        local_id,
        created_at_local: new Date().toISOString(),
    }

    if (typeof window !== 'undefined') {
        const existing = getLocalCatches()
        const updated = [...existing.filter((item) => item.local_id !== local_id), entry]
        localStorage.setItem(OFFLINE_CATCHES_KEY, JSON.stringify(updated))
    }

    return entry
}

export function getLocalCatches(): OfflineCatchEntry[] {
    if (typeof window === 'undefined') return []
    try {
        const raw = localStorage.getItem(OFFLINE_CATCHES_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

export function removeLocalCatch(local_id: string): void {
    if (typeof window === 'undefined') return
    const existing = getLocalCatches()
    const filtered = existing.filter((item) => item.local_id !== local_id)
    localStorage.setItem(OFFLINE_CATCHES_KEY, JSON.stringify(filtered))
}

export function clearLocalCatches(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(OFFLINE_CATCHES_KEY)
}
