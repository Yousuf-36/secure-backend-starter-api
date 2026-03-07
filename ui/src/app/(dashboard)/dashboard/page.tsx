'use client'

import { Users, Zap, Shield, Activity } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { StaggerReveal, StaggerItem } from '@/components/motion/StaggerReveal'
import { useAuthStore } from '@/lib/store/authStore'
import { useRole } from '@/lib/hooks/useRole'
import { RoleBadge } from '@/components/dashboard/RoleBadge'

export default function DashboardPage() {
    const user = useAuthStore((s) => s.user)
    const isAdmin = useRole('admin')

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold tracking-tight text-[#0A0A0A]">
                        Good evening
                        {user?.email ? `, ${user.email.split('@')[0]}` : ''} 👋
                    </h1>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm text-[#6B7280]">
                    <span>Signed in as {user?.email}</span>
                    <span>·</span>
                    <RoleBadge role={isAdmin ? 'admin' : 'user'} />
                </div>
            </div>

            {/* Stats */}
            <StaggerReveal className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StaggerItem>
                    <StatsCard title="API Status" value="Online" icon={Activity} trend="↑ 100%" trendUp description="uptime" />
                </StaggerItem>
                <StaggerItem>
                    <StatsCard title="Your Role" value={isAdmin ? 'Admin' : 'User'} icon={Shield} description="access level" />
                </StaggerItem>
                <StaggerItem>
                    <StatsCard title="AI Module" value="Active" icon={Zap} description="Groq · Llama 3 8b" />
                </StaggerItem>
                <StaggerItem>
                    <StatsCard title="Auth Method" value="JWT" icon={Users} description="HttpOnly refresh" />
                </StaggerItem>
            </StaggerReveal>

            {/* Quick action cards */}
            <StaggerReveal delay={0.2} className="grid gap-4 md:grid-cols-2">
                <StaggerItem>
                    <a
                        href="/dashboard/ai"
                        className="flex items-start gap-4 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm transition-all hover:border-[#0066FF]/30 hover:shadow-md"
                    >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF]">
                            <Zap className="h-5 w-5 text-[#0066FF]" />
                        </div>
                        <div>
                            <p className="font-medium text-[#0A0A0A]">AI Studio</p>
                            <p className="mt-1 text-sm text-[#6B7280]">
                                Generate completions using Groq&apos;s Llama 3 model.
                            </p>
                        </div>
                    </a>
                </StaggerItem>
                {isAdmin && (
                    <StaggerItem>
                        <a
                            href="/dashboard/admin"
                            className="flex items-start gap-4 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm transition-all hover:border-[#0066FF]/30 hover:shadow-md"
                        >
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF]">
                                <Shield className="h-5 w-5 text-[#0066FF]" />
                            </div>
                            <div>
                                <p className="font-medium text-[#0A0A0A]">Admin Panel</p>
                                <p className="mt-1 text-sm text-[#6B7280]">
                                    Manage users, roles, and system health.
                                </p>
                            </div>
                        </a>
                    </StaggerItem>
                )}
            </StaggerReveal>
        </div>
    )
}
