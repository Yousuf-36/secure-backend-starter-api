'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    trend?: string
    trendUp?: boolean
    description?: string
    className?: string
    children?: ReactNode
}

export function StatsCard({
    title,
    value,
    icon: Icon,
    trend,
    trendUp,
    description,
    className,
}: StatsCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
            transition={{ duration: 0.2 }}
            className={cn(
                'rounded-xl border border-[#E5E7EB] bg-white p-8 shadow-sm',
                className
            )}
        >
            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-[#6B7280]">{title}</p>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF4FF]">
                    <Icon className="h-4.5 w-4.5 text-[#0066FF]" />
                </div>
            </div>
            <p className="text-3xl font-semibold tracking-tight text-[#0A0A0A]">{value}</p>
            {(trend ?? description) && (
                <p className="mt-2 text-sm">
                    {trend && (
                        <span className={trendUp ? 'text-[#10B981]' : 'text-[#EF4444]'}>
                            {trend}{' '}
                        </span>
                    )}
                    {description && <span className="text-[#9CA3AF]">{description}</span>}
                </p>
            )}
        </motion.div>
    )
}
