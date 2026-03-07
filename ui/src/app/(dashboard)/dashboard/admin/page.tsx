'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Users, Activity, AlertCircle } from 'lucide-react'
import { useRole } from '@/lib/hooks/useRole'
import { StaggerReveal, StaggerItem } from '@/components/motion/StaggerReveal'
import { StatsCard } from '@/components/dashboard/StatsCard'

export default function AdminPage() {
    const isAdmin = useRole('admin')
    const router = useRouter()

    useEffect(() => {
        if (!isAdmin) {
            router.replace('/dashboard')
        }
    }, [isAdmin, router])

    if (!isAdmin) {
        return (
            <div className="flex items-center gap-3 rounded-xl border border-[#FEE2E2] bg-[#FEF2F2] p-6 text-[#EF4444]">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Access restricted. Redirecting…</span>
            </div>
        )
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold tracking-tight text-[#0A0A0A]">Admin Panel</h1>
                <p className="mt-1 text-sm text-[#6B7280]">System overview and management tools</p>
            </div>

            <StaggerReveal className="grid gap-4 sm:grid-cols-3 mb-8">
                <StaggerItem>
                    <StatsCard title="Total Users" value="—" icon={Users} description="registered accounts" />
                </StaggerItem>
                <StaggerItem>
                    <StatsCard title="Active Roles" value="3" icon={Shield} description="admin, ai_user, user" />
                </StaggerItem>
                <StaggerItem>
                    <StatsCard title="System" value="Healthy" icon={Activity} trend="↑ All green" trendUp />
                </StaggerItem>
            </StaggerReveal>

            {/* Placeholder table */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm overflow-hidden">
                <div className="border-b border-[#E5E7EB] px-6 py-4">
                    <h2 className="text-sm font-semibold text-[#0A0A0A]">User Management</h2>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">
                        Connect <code className="rounded bg-[#F3F4F6] px-1">GET /api/v1/users</code> when user listing endpoint is available.
                    </p>
                </div>
                <div className="px-6 py-12 text-center">
                    <Shield className="mx-auto h-10 w-10 text-[#E5E7EB] mb-3" />
                    <p className="text-sm text-[#9CA3AF]">User listing endpoint coming soon.</p>
                    <p className="text-xs text-[#9CA3AF] mt-1">Add <code className="rounded bg-[#F3F4F6] px-1">GET /api/v1/users</code> to the backend to populate this table.</p>
                </div>
            </div>
        </div>
    )
}
