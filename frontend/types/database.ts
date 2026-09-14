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

export type Profile = {
    id: string
    role: UserRole
    full_name: string
    phone: string | null
    bank_account: string | null
    ppi_location: string | null
    created_at: string
    updated_at: string
}

export type Catch = {
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

export type Transaction = {
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
export type CreateCatchInput = {
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

export type ClaimCatchInput = {
    catch_id: string
    estimated_total: number
}

// Database schema definition for Supabase client
export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: Profile
                Insert: {
                    id: string
                    full_name: string
                    role?: UserRole
                    phone?: string | null
                    bank_account?: string | null
                    ppi_location?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string
                    role?: UserRole
                    phone?: string | null
                    bank_account?: string | null
                    ppi_location?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            catches: {
                Row: Catch
                Insert: {
                    id?: string
                    nelayan_id: string
                    species: string
                    weight_kg: number
                    catch_location: string
                    catch_time: string
                    storage_method: string
                    vessel_name: string
                    freshness_grade?: FreshnessGrade | null
                    freshness_score?: number | null
                    freshness_notes?: string | null
                    status?: CatchStatus
                    listed_at?: string | null
                    expires_at?: string | null
                    price_per_kg?: number | null
                    local_id?: string | null
                    synced_at?: string | null
                    photo_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    nelayan_id?: string
                    species?: string
                    weight_kg?: number
                    catch_location?: string
                    catch_time?: string
                    storage_method?: string
                    vessel_name?: string
                    freshness_grade?: FreshnessGrade | null
                    freshness_score?: number | null
                    freshness_notes?: string | null
                    status?: CatchStatus
                    listed_at?: string | null
                    expires_at?: string | null
                    price_per_kg?: number | null
                    local_id?: string | null
                    synced_at?: string | null
                    photo_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            transactions: {
                Row: Transaction
                Insert: {
                    id?: string
                    catch_id: string
                    pembeli_id: string
                    nelayan_id: string
                    status?: TransactionStatus
                    estimated_total: number
                    final_weight_kg?: number | null
                    final_total?: number | null
                    delivery_scheduled_at?: string | null
                    ppi_location?: string | null
                    weighing_done_at?: string | null
                    weighing_officer?: string | null
                    qr_scan_code?: string | null
                    handover_confirmed_at?: string | null
                    handover_photo_url?: string | null
                    disbursed_at?: string | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    catch_id?: string
                    pembeli_id?: string
                    nelayan_id?: string
                    status?: TransactionStatus
                    estimated_total?: number
                    final_weight_kg?: number | null
                    final_total?: number | null
                    delivery_scheduled_at?: string | null
                    ppi_location?: string | null
                    weighing_done_at?: string | null
                    weighing_officer?: string | null
                    qr_scan_code?: string | null
                    handover_confirmed_at?: string | null
                    handover_photo_url?: string | null
                    disbursed_at?: string | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            user_role: UserRole
            freshness_grade: FreshnessGrade
            catch_status: CatchStatus
            transaction_status: TransactionStatus
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}