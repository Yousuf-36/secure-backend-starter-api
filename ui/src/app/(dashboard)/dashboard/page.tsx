'use client'

import { useAuthStore } from '@/lib/store/authStore'
import { useRole, usePrimaryRole } from '@/lib/hooks/useRole'
import { RoleBadge } from '@/components/dashboard/RoleBadge'
import { StaggerReveal, StaggerItem } from '@/components/motion/StaggerReveal'
import { UsageChart } from '@/components/dashboard/UsageChart'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import Link from 'next/link'
import { useEffect, useState } from 'react'

function CounterAnimation({ value }: { value: number }) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        let start = 0
        const end = value
        if (start === end) return

        let totalDuration = 1000
        let incrementTime = (totalDuration / end) * 3
        
        let timer = setInterval(() => {
            start += Math.ceil(end / 40)
            if (start >= end) {
                setCount(end)
                clearInterval(timer)
            } else {
                setCount(start)
            }
        }, incrementTime)

        return () => clearInterval(timer)
    }, [value])

    return <span>{count.toLocaleString()}</span>
}

export default function DashboardPage() {
    const user = useAuthStore((s) => s.user)
    const isAdmin = useRole('admin')
    const primaryRole = usePrimaryRole()

    const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })

    return (
        <div className="pb-12 bg-[var(--color-bg)] min-h-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight text-[var(--color-primary)]">Dashboard</h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-[var(--color-primary)]">
                            Good evening{user?.email ? `, ${user.email.split('@')[0]}` : ''}
                        </p>
                        <p className="text-xs text-[var(--color-secondary)] font-medium mt-0.5">{todayDate}</p>
                    </div>
                    <div className="h-10 w-px bg-[var(--color-border)] hidden sm:block mx-2" />
                    <RoleBadge role={primaryRole} />
                </div>
            </div>

            {/* KPI ROW */}
            <StaggerReveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {/* Card 1: Dark */}
                <StaggerItem>
                    <div className="relative rounded-xl bg-[var(--color-dark-card)] p-6 shadow-sm border border-[var(--color-border)] h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">Total Requests</p>
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">+12.4%</span>
                        </div>
                        <p className="text-4xl font-display font-bold text-[var(--color-dark-text)]">
                            <CounterAnimation value={24592} />
                        </p>
                    </div>
                </StaggerItem>
                {/* Card 2: Light */}
                <StaggerItem>
                    <div className="relative rounded-xl bg-[var(--color-surface)] p-6 shadow-sm border border-[var(--color-border)] h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-secondary)]">AI Completions</p>
                            <span className="text-xs font-bold text-[var(--color-accent)] bg-[var(--color-accent-mid)] px-2 py-0.5 rounded">+8.1%</span>
                        </div>
                        <p className="text-4xl font-display font-bold text-[var(--color-primary)]">
                            <CounterAnimation value={8391} />
                        </p>
                    </div>
                </StaggerItem>
                {/* Card 3: Dark */}
                <StaggerItem>
                    <div className="relative rounded-xl bg-[var(--color-dark-card)] p-6 shadow-sm border border-[var(--color-border)] h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">Uptime</p>
                            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Operational
                            </span>
                        </div>
                        <p className="text-4xl font-display font-bold text-[var(--color-dark-text)]">99.9%</p>
                    </div>
                </StaggerItem>
                {/* Card 4: Light */}
                <StaggerItem>
                    <div className="relative rounded-xl bg-[var(--color-surface)] p-6 shadow-sm border border-[var(--color-border)] h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-secondary)]">Active Role</p>
                        </div>
                        <div>
                            <p className="text-2xl font-display font-bold text-[var(--color-primary)] capitalize">{primaryRole.replace('_', ' ')}</p>
                            <p className="text-xs font-semibold text-[var(--color-secondary)] mt-1">{isAdmin ? 'Full system access' : 'Standard access'}</p>
                        </div>
                    </div>
                </StaggerItem>
            </StaggerReveal>

            {/* MAIN GRID - 60/40 */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* LEFT (60%) */}
                <div className="lg:col-span-3 flex flex-col">
                    <StaggerReveal>
                        <StaggerItem>
                            <UsageChart />
                        </StaggerItem>
                        <StaggerItem>
                            <ActivityFeed />
                        </StaggerItem>
                    </StaggerReveal>
                </div>
                
                {/* RIGHT (40%) */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <StaggerReveal delay={0.2}>
                        {/* System Status - DARK */}
                        <StaggerItem>
                            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-dark-card)] p-6 shadow-sm">
                                <h2 className="text-lg font-bold text-[var(--color-dark-text)] mb-6">System Status</h2>
                                <div className="space-y-4">
                                    {['API Server', 'Database', 'AI Provider', 'Auth Service'].map((service) => (
                                        <div key={service} className="flex items-center justify-between border-b border-[var(--color-muted)]/20 pb-4 last:border-0 last:pb-0">
                                            <span className="text-sm font-semibold text-[var(--color-muted)]">{service}</span>
                                            <span className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                                Operational
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </StaggerItem>
                        
                        {/* Role & Permissions - LIGHT */}
                        <StaggerItem>
                            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm mt-6">
                                <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-secondary)] mb-6">Role & Permissions</h2>
                                <div className="mb-6">
                                    <RoleBadge role={primaryRole} size="md" />
                                </div>
                                <div className="space-y-3">
                                    {isAdmin ? (
                                        <>
                                            <div className="flex items-start gap-3 text-sm font-semibold text-[var(--color-primary)]">
                                                <span className="text-[var(--color-accent)] mt-0.5">✓</span> Access all dashboards
                                            </div>
                                            <div className="flex items-start gap-3 text-sm font-semibold text-[var(--color-primary)]">
                                                <span className="text-[var(--color-accent)] mt-0.5">✓</span> Manage user accounts
                                            </div>
                                            <div className="flex items-start gap-3 text-sm font-semibold text-[var(--color-primary)]">
                                                <span className="text-[var(--color-accent)] mt-0.5">✓</span> Configure AI providers
                                            </div>
                                            <div className="flex items-start gap-3 text-sm font-semibold text-[var(--color-primary)]">
                                                <span className="text-[var(--color-accent)] mt-0.5">✓</span> View system logs
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-start gap-3 text-sm font-semibold text-[var(--color-primary)]">
                                                <span className="text-[var(--color-accent)] mt-0.5">✓</span> Access standard dashboard
                                            </div>
                                            <div className="flex items-start gap-3 text-sm font-semibold text-[var(--color-primary)]">
                                                <span className="text-[var(--color-accent)] mt-0.5">✓</span> Run basic AI completions
                                            </div>
                                            <div className="flex items-start gap-3 text-sm font-semibold text-[var(--color-muted)]">
                                                <span className="text-[var(--color-border)] mt-0.5">✗</span> Manage user accounts
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </StaggerItem>

                        {/* Quick Actions - LIGHT */}
                        <StaggerItem>
                            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm mt-6">
                                <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-secondary)] mb-4">Quick Actions</h2>
                                <div className="space-y-3">
                                    <Link href="/dashboard/ai" className="flex items-center justify-center w-full h-11 border border-[var(--color-border)] rounded-lg bg-[var(--color-accent)] text-[var(--color-dark-text)] text-sm font-bold hover:bg-[var(--color-secondary)] transition-colors">
                                        Open AI Studio
                                    </Link>
                                    {isAdmin && (
                                        <Link href="/dashboard/admin" className="flex items-center justify-center w-full h-11 border border-[var(--color-border)] rounded-lg bg-[var(--color-accent)] text-[var(--color-dark-text)] text-sm font-bold hover:bg-[var(--color-secondary)] transition-colors">
                                            Admin Panel
                                        </Link>
                                    )}
                                    <Link href="/dashboard/settings" className="flex items-center justify-center w-full h-11 border border-[var(--color-border)] rounded-lg bg-[var(--color-accent)] text-[var(--color-dark-text)] text-sm font-bold hover:bg-[var(--color-secondary)] transition-colors">
                                        View Settings
                                    </Link>
                                </div>
                            </div>
                        </StaggerItem>
                    </StaggerReveal>
                </div>
            </div>
        </div>
    )
}
