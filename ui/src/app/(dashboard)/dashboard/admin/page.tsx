'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Users, Activity, AlertCircle, Search, Filter, MoreVertical, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react'
import { useRole } from '@/lib/hooks/useRole'
import { StaggerReveal, StaggerItem } from '@/components/motion/StaggerReveal'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { motion } from 'framer-motion'
import { RoleBadge } from '@/components/dashboard/RoleBadge'

const MOCK_USERS = [
    { id: 'usr_1a2b3c', email: 'admin@launchstack.dev', role: 'admin', status: 'active', lastLogin: '2 mins ago' },
    { id: 'usr_4d5e6f', email: 'ai.handler@launchstack.dev', role: 'ai_user', status: 'active', lastLogin: '1 hour ago' },
    { id: 'usr_7g8h9i', email: 'demo.user@example.com', role: 'user', status: 'active', lastLogin: '3 hours ago' },
    { id: 'usr_0j1k2l', email: 'test.account@startup.io', role: 'user', status: 'suspended', lastLogin: '5 days ago' },
    { id: 'usr_3m4n5o', email: 'developer@agency.com', role: 'ai_user', status: 'active', lastLogin: '10 mins ago' },
]

const MOCK_LOGS = [
    { id: 1, action: 'User suspension', target: 'usr_0j1k2l', time: '5 days ago', actor: 'admin' },
    { id: 2, action: 'API Key Rotated', target: 'System', time: '1 week ago', actor: 'admin' },
    { id: 3, action: 'Role Updated to ai_user', target: 'usr_4d5e6f', time: '2 weeks ago', actor: 'admin' },
]

export default function AdminPage() {
    const isAdmin = useRole('admin')
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')

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

    const filteredUsers = MOCK_USERS.filter(u => u.email.includes(searchQuery.toLowerCase()))

    return (
        <div className="pb-12">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-[#0A0A0A]">Admin Panel</h1>
                    <p className="mt-1 text-sm text-[#6B7280]">System overview, access control, and user management</p>
                </div>
                <button className="flex items-center gap-2 rounded-xl bg-[#0A0A0A] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#1A1A1A] shadow-sm">
                    <ArrowUpRight className="h-4 w-4" />
                    Export Report
                </button>
            </div>

            <StaggerReveal className="grid gap-4 sm:grid-cols-3 mb-8">
                <StaggerItem>
                    <StatsCard title="Total Users" value="1,284" icon={Users} description="+12% from last month" trendUp trend="12%" />
                </StaggerItem>
                <StaggerItem>
                    <StatsCard title="Active Roles" value="3" icon={Shield} description="admin, ai_user, user" />
                </StaggerItem>
                <StaggerItem>
                    <StatsCard title="System Health" value="100%" icon={Activity} trend="All checks passing" trendUp />
                </StaggerItem>
            </StaggerReveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Table Area */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                    className="lg:col-span-2 space-y-6"
                >
                    <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm overflow-hidden flex flex-col">
                        <div className="border-b border-[#E5E7EB] px-6 py-5 flex items-center justify-between bg-[#FAFAFA]">
                            <div>
                                <h2 className="text-base font-semibold text-[#0A0A0A]">User Management</h2>
                                <p className="text-xs text-[#6B7280] mt-0.5">Manage authentication and RBAC roles.</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="rounded-lg border border-[#E5E7EB] pl-9 pr-4 py-1.5 text-sm outline-none transition-colors focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] w-48"
                                    />
                                </div>
                                <button className="flex items-center justify-center p-2 rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6] transition-colors">
                                    <Filter className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white border-b border-[#E5E7EB]">
                                    <tr>
                                        <th className="px-6 py-3 font-medium text-[#6B7280]">User</th>
                                        <th className="px-6 py-3 font-medium text-[#6B7280]">Role</th>
                                        <th className="px-6 py-3 font-medium text-[#6B7280]">Status</th>
                                        <th className="px-6 py-3 font-medium text-[#6B7280]">Last Login</th>
                                        <th className="px-6 py-3 font-medium text-[#6B7280] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E5E7EB]">
                                    {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                                        <tr key={u.id} className="hover:bg-[#FAFAFA] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-[#EEF4FF] text-[#0066FF] flex items-center justify-center font-medium text-xs">
                                                        {u.email[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-[#0A0A0A]">{u.email}</div>
                                                        <div className="text-xs text-[#9CA3AF] font-mono mt-0.5">{u.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <RoleBadge role={u.role as 'admin' | 'ai_user' | 'user'} size="sm" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${u.status === 'active' ? 'bg-[#ECFDF5] text-[#10B981]' : 'bg-[#FEF2F2] text-[#EF4444]'}`}>
                                                    {u.status === 'active' ? 'Active' : 'Suspended'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-[#6B7280] text-xs">
                                                {u.lastLogin}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-[#9CA3AF] hover:text-[#0A0A0A] transition-colors p-1">
                                                    <MoreVertical className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-[#6B7280]">
                                                No users found matching "{searchQuery}"
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>

                {/* Sidebar Area */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.2 }}
                    className="space-y-6 lg:col-span-1"
                >
                    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                        <h2 className="text-base font-semibold text-[#0A0A0A] mb-4">System Checks</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 border border-[#E5E7EB] rounded-xl p-3 bg-[#FAFAFA]">
                                <div className="h-8 w-8 rounded-full bg-[#ECFDF5] flex items-center justify-center">
                                    <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-[#0A0A0A]">Database Config</p>
                                    <p className="text-xs text-[#6B7280]">PostgreSQL connected</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 border border-[#E5E7EB] rounded-xl p-3 bg-[#FAFAFA]">
                                <div className="h-8 w-8 rounded-full bg-[#ECFDF5] flex items-center justify-center">
                                    <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-[#0A0A0A]">API Keys Set</p>
                                    <p className="text-xs text-[#6B7280]">Groq API configured</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                        <h2 className="text-base font-semibold text-[#0A0A0A] mb-4">Audit Logs</h2>
                        <div className="space-y-4 relative before:absolute before:inset-y-2 before:-left-3 before:w-0.5 before:bg-[#F3F4F6] ml-3">
                            {MOCK_LOGS.map((log) => (
                                <div key={log.id} className="relative flex items-start gap-4">
                                    <div className="absolute -left-[18px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#0A0A0A] ring-4 ring-white" />
                                    <div>
                                        <p className="text-sm font-medium text-[#0A0A0A]">{log.action}</p>
                                        <p className="text-xs text-[#6B7280] mt-0.5">
                                            {log.target} · by <span className="font-medium text-[#0A0A0A]">{log.actor}</span>
                                        </p>
                                        <p className="text-[11px] text-[#9CA3AF] mt-1 flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {log.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
