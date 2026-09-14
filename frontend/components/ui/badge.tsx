import React from 'react'
import type { FreshnessGrade, CatchStatus, TransactionStatus } from '@/types/database'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline'
    children: React.ReactNode
}

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
    const variantStyles: Record<string, string> = {
        default: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200',
        success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800',
        warning: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800',
        danger: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800',
        info: 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-300 dark:border-sky-800',
        outline: 'border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300',
    }

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {children}
        </span>
    )
}

export function GradeBadge({ grade }: { grade: FreshnessGrade | null }) {
    if (!grade) {
        return <Badge variant="default">Memeriksa AI...</Badge>
    }

    const mapping: Record<FreshnessGrade, { variant: 'success' | 'warning' | 'danger'; label: string }> = {
        A: { variant: 'success', label: 'Grade A (Sangat Segar)' },
        B: { variant: 'warning', label: 'Grade B (Segar)' },
        C: { variant: 'danger', label: 'Grade C (Layak Konsumsi)' },
    }

    const config = mapping[grade]
    return <Badge variant={config.variant}>{config.label}</Badge>
}

export function CatchStatusBadge({ status }: { status: CatchStatus }) {
    const mapping: Record<CatchStatus, { variant: 'default' | 'info' | 'warning' | 'success' | 'danger'; label: string }> = {
        WAITING_FOR_SYNC: { variant: 'warning', label: 'Tersimpan Lokal' },
        LISTED: { variant: 'info', label: 'Tersedia di Pasar' },
        CLAIMED: { variant: 'success', label: 'Sudah Diklaim' },
        COMPLETED: { variant: 'default', label: 'Selesai' },
        EXPIRED: { variant: 'danger', label: 'Kedaluwarsa' },
    }

    const config = mapping[status]
    return <Badge variant={config.variant}>{config.label}</Badge>
}

export function TransactionStatusBadge({ status }: { status: TransactionStatus }) {
    const mapping: Record<TransactionStatus, { variant: 'default' | 'info' | 'warning' | 'success' | 'danger'; label: string }> = {
        ESCROW_PENDING: { variant: 'warning', label: 'Menunggu Escrow' },
        ESCROW_HELD: { variant: 'info', label: 'Dana Ditahan' },
        DELIVERY_SCHEDULED: { variant: 'info', label: 'Pengiriman Dijadwalkan' },
        WEIGHING_DONE: { variant: 'warning', label: 'Penimbangan Selesai' },
        RECONCILED: { variant: 'info', label: 'Terekonsiliasi' },
        COMPLETED: { variant: 'success', label: 'Selesai' },
        CANCELLED: { variant: 'danger', label: 'Dibatalkan' },
    }

    const config = mapping[status]
    return <Badge variant={config.variant}>{config.label}</Badge>
}
