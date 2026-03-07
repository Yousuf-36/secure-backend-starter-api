'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    LayoutDashboard,
    Sparkles,
    Shield,
    Settings,
    LogOut,
    ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/lib/store/authStore'
import { useRole, usePrimaryRole } from '@/lib/hooks/useRole'
import { RoleBadge } from '@/components/dashboard/RoleBadge'

const baseNavItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/ai', label: 'AI Studio', icon: Sparkles },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

const adminNavItems = [
    { href: '/dashboard/admin', label: 'Admin Panel', icon: Shield },
]

export function Sidebar() {
    const pathname = usePathname()
    const { user, logout } = useAuthStore()
    const isAdmin = useRole('admin')
    const primaryRole = usePrimaryRole()

    const navItems = isAdmin ? [...baseNavItems, ...adminNavItems] : baseNavItems

    return (
        <motion.aside
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed left-0 top-0 bottom-0 z-40 flex w-64 flex-col border-r border-[#E5E7EB] bg-white"
        >
            {/* Logo */}
            <div className="flex h-16 items-center border-b border-[#E5E7EB] px-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0066FF]">
                        <span className="text-xs font-bold text-white">LS</span>
                    </div>
                    <span className="font-semibold text-[#0A0A0A] tracking-tight text-sm">Launchstack</span>
                </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                        <Link key={item.href} href={item.href}>
                            <motion.div
                                whileHover={{ x: 2 }}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-[#EEF4FF] text-[#0066FF]'
                                        : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#0A0A0A]'
                                )}
                            >
                                <Icon className="h-4 w-4 flex-shrink-0" />
                                {item.label}
                                {isActive && (
                                    <ChevronRight className="ml-auto h-3.5 w-3.5 text-[#0066FF]" />
                                )}
                            </motion.div>
                        </Link>
                    )
                })}
            </nav>

            {/* User footer */}
            <div className="border-t border-[#E5E7EB] p-4">
                <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF4FF] text-xs font-semibold text-[#0066FF]">
                        {user?.email?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-[#0A0A0A]">{user?.email ?? '—'}</p>
                        <RoleBadge role={primaryRole} size="sm" />
                    </div>
                </div>
                <button
                    onClick={() => logout()}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#6B7280] transition-colors hover:bg-[#FEF2F2] hover:text-[#EF4444]"
                >
                    <LogOut className="h-4 w-4" />
                    Sign out
                </button>
            </div>
        </motion.aside>
    )
}
