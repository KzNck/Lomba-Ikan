// Types ini mengikuti schema.sql — update kalau ada perubahan tabel

export type UserRole = 'nelayan' | 'pembeli' | 'admin'
export type FreshnessGrade = 'A' | 'B' | 'C'
export type CatchStatus =
    | 'WAITING_FOR_SYNC'
    | 'LISTED'
    | 'CLAIMED'
    | 'COMPLETED'
    | 'EXPIRED'
export type TransactionStatus =
    | 'ESCROW_PENDING'
    | 'ESCROW_HELD'
    | 'DELIVERY_SCHEDULED'
    | 'WEIGHING_DONE'
    | 'RECONCILED'
    | 'COMPLETED'
    | 'CANCELLED'

export interface Profile {
    id: string
    role: UserRole
    full_name: string
    phone: string | null
    bank_account: string | null
    ppi_location: string | null
    created_at: string
    updated_at: string
}

export interface Catch {
    id: string
    nelayan_id: string
    species: string
    weight_kg: number
    catch_location: string
    catch_time: string
    storage_method: string
    vessel_name: string
    freshness_grade: FreshnessGrade | null
    freshness_score: number | null
    freshness_notes: string | null
    status: CatchStatus
    listed_at: string | null
    expires_at: string | null
    price_per_kg: number | null
    local_id: string | null
    synced_at: string | null
    photo_url: string | null
    created_at: string
    updated_at: string
}

export interface Transaction {
    id: string
    catch_id: string
    pembeli_id: string
    nelayan_id: string
    status: TransactionStatus
    estimated_total: number
    final_weight_kg: number | null
    final_total: number | null
    delivery_scheduled_at: string | null
    ppi_location: string | null
    weighing_done_at: string | null
    weighing_officer: string | null
    qr_scan_code: string | null
    handover_confirmed_at: string | null
    handover_photo_url: string | null
    disbursed_at: string | null
    notes: string | null
    created_at: string
    updated_at: string
}

// Input types untuk create — field yang wajib diisi user
export interface CreateCatchInput {
    species: string
    weight_kg: number
    catch_location: string
    catch_time: string
    storage_method: string
    vessel_name: string
    price_per_kg?: number
    local_id?: string // untuk offline sync idempotent
    photo_url?: string
}

export interface ClaimCatchInput {
    catch_id: string
    estimated_total: number
}