'use client'

import { useAuthStore } from '@/lib/store/authStore'
import { RoleBadge } from '@/components/dashboard/RoleBadge'
import { usePrimaryRole } from '@/lib/hooks/useRole'
import { motion } from 'framer-motion'

export default function SettingsPage() {
    const user = useAuthStore((s) => s.user)
    const role = usePrimaryRole()

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold tracking-tight text-[#0A0A0A]">Settings</h1>
                <p className="mt-1 text-sm text-[#6B7280]">Manage your account preferences</p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="max-w-lg space-y-4"
            >
                {/* Profile card */}
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-sm font-semibold text-[#0A0A0A]">Profile</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF4FF] text-lg font-semibold text-[#0066FF]">
                            {user?.email?.[0]?.toUpperCase() ?? 'U'}
                        </div>
                        <div>
                            <p className="font-medium text-[#0A0A0A]">{user?.email}</p>
                            <div className="mt-1">
                                <RoleBadge role={role} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account info */}
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-sm font-semibold text-[#0A0A0A]">Account details</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-[#6B7280]">Email</span>
                            <span className="text-[#0A0A0A]">{user?.email ?? '—'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#6B7280]">Account ID</span>
                            <span className="font-mono text-[#0A0A0A]">{user?.id ?? '—'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#6B7280]">Status</span>
                            <span className={user?.is_active ? 'text-[#10B981]' : 'text-[#EF4444]'}>
                                {user?.is_active ? 'Active' : 'Suspended'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                    <h2 className="mb-1 text-sm font-semibold text-[#0A0A0A]">Security</h2>
                    <p className="text-xs text-[#9CA3AF] mb-4">
                        Session managed via JWT access token + HttpOnly refresh cookie
                    </p>
                    <div className="space-y-2 text-xs text-[#6B7280]">
                        <p>✓ Access token stored in memory only</p>
                        <p>✓ Refresh token in HttpOnly cookie (JS inaccessible)</p>
                        <p>✓ Silent token rotation on expiry</p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
