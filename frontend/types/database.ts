// Types ini mengikuti schema.sql — update kalau ada perubahan tabel

export type UserRole = 'nelayan' | 'pembeli' | 'admin'
// Sub-grade lengkap dari model AI. Enum `freshness_grade` di database memakai
// nilai yang sama persis (lihat supabase/schema.sql).
export type FreshnessGrade = 'A1' | 'A2' | 'A3' | 'B1' | 'B2' | 'B3'

/** Metode penyimpanan yang dikenali model AI; dibatasi CHECK di database. */
export type StorageMethod = 'crushed_ice' | 'chilled_seawater' | 'ambient'

/** Status ikan saat ditangkap. */
export type StatusIkan = 'HIDUP' | 'MATI'

/** Kategori tangkapan untuk keperluan hilirisasi. */
export type FishCategory = 'campuran' | 'teri_non_grade' | 'rucah'
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
    storage_method: StorageMethod
    vessel_name: string
    // Field tambahan yang dibutuhkan model AI (fusion visual+tabular).
    status_ikan: StatusIkan | null
    ice_to_fish_ratio: number | null
    ambient_temp_celsius: number | null
    fish_category: FishCategory | null
    freshness_grade: FreshnessGrade | null
    freshness_score: number | null
    freshness_notes: string | null
    hilirisasi_recommendation: string | null
    ai_override_applied: boolean | null
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
    storage_method: StorageMethod
    vessel_name: string
    // Diturunkan dari jawaban wizard; ikut disimpan karena model AI memakainya.
    status_ikan?: StatusIkan
    ice_to_fish_ratio?: number
    ambient_temp_celsius?: number
    fish_category?: FishCategory
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
                    storage_method: StorageMethod
                    vessel_name: string
                    status_ikan?: StatusIkan | null
                    ice_to_fish_ratio?: number | null
                    ambient_temp_celsius?: number | null
                    fish_category?: FishCategory | null
                    freshness_grade?: FreshnessGrade | null
                    freshness_score?: number | null
                    freshness_notes?: string | null
                    hilirisasi_recommendation?: string | null
                    ai_override_applied?: boolean | null
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
                    storage_method?: StorageMethod
                    vessel_name?: string
                    status_ikan?: StatusIkan | null
                    ice_to_fish_ratio?: number | null
                    ambient_temp_celsius?: number | null
                    fish_category?: FishCategory | null
                    freshness_grade?: FreshnessGrade | null
                    freshness_score?: number | null
                    freshness_notes?: string | null
                    hilirisasi_recommendation?: string | null
                    ai_override_applied?: boolean | null
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
                Relationships: [
                    {
                        foreignKeyName: 'catches_nelayan_id_fkey'
                        columns: ['nelayan_id']
                        isOneToOne: false
                        referencedRelation: 'profiles'
                        referencedColumns: ['id']
                    },
                ]
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
                Relationships: [
                    {
                        foreignKeyName: 'transactions_catch_id_fkey'
                        columns: ['catch_id']
                        isOneToOne: false
                        referencedRelation: 'catches'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'transactions_pembeli_id_fkey'
                        columns: ['pembeli_id']
                        isOneToOne: false
                        referencedRelation: 'profiles'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'transactions_nelayan_id_fkey'
                        columns: ['nelayan_id']
                        isOneToOne: false
                        referencedRelation: 'profiles'
                        referencedColumns: ['id']
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            // supabase/transaction-contact.sql
            get_transaction_contact: {
                Args: { p_transaction_id: string }
                Returns: { full_name: string; phone: string | null }[]
            }
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