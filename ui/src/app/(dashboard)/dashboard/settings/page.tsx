'use client'

import { useState } from 'react'
import { useAuthStore } from '@/lib/store/authStore'
import { RoleBadge } from '@/components/dashboard/RoleBadge'
import { usePrimaryRole } from '@/lib/hooks/useRole'
import { motion } from 'framer-motion'
import { Key, Shield, User, Bell, Eye, EyeOff, Save, CheckCircle2 } from 'lucide-react'

export default function SettingsPage() {
    const user = useAuthStore((s) => s.user)
    const role = usePrimaryRole()
    const [saved, setSaved] = useState(false)

    const providers = [
        { name: 'Groq', active: true, model: 'Llama 3 8B' },
        { name: 'Google Workspace', active: false, model: 'Gemini 1.5' },
        { name: 'HuggingFace', active: false, model: 'Inference' },
        { name: 'Cohere', active: false, model: 'Command R' },
    ]

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    return (
        <div className="pb-12">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-[#0A0A0A]">Settings</h1>
                    <p className="mt-1 text-sm text-[#6B7280]">Manage your account preferences and integrations</p>
                </div>
                <button
                    onClick={handleSave}
                    className="hidden lg:flex items-center gap-2 rounded-xl bg-[#0066FF] px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#0052CC] active:scale-95"
                >
                    {saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                    {saved ? 'Saved' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Left Column */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-6 lg:col-span-1"
                >
                    {/* Profile card */}
                    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <User className="h-5 w-5 text-[#0066FF]" />
                            <h2 className="text-base font-semibold text-[#0A0A0A]">Profile</h2>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#EEF4FF] text-3xl font-semibold text-[#0066FF] ring-4 ring-[#EEF4FF]/50 outline outline-1 outline-[#0066FF]/10">
                                {user?.email?.[0]?.toUpperCase() ?? 'U'}
                            </div>
                            <p className="font-semibold text-[#0A0A0A]">{user?.email ?? 'Unknown User'}</p>
                            <div className="mt-2">
                                <RoleBadge role={role} />
                            </div>
                        </div>
                    </div>

                    {/* Account info */}
                    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="h-5 w-5 text-[#10B981]" />
                            <h2 className="text-base font-semibold text-[#0A0A0A]">Account Details</h2>
                        </div>
                        <div className="space-y-4 text-sm">
                            <div className="flex flex-col gap-1 border-b border-[#F3F4F6] pb-3">
                                <span className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">Email Address</span>
                                <span className="text-[#0A0A0A] font-medium">{user?.email ?? '—'}</span>
                            </div>
                            <div className="flex flex-col gap-1 border-b border-[#F3F4F6] pb-3">
                                <span className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">Account ID</span>
                                <span className="font-mono text-[#0A0A0A] bg-[#F3F4F6] px-2 py-1 rounded w-fit">{user?.id ?? '—'}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">Status</span>
                                <span className={`inline-flex items-center gap-1.5 font-medium ${user?.is_active ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                                    <span className={`block h-2 w-2 rounded-full ${user?.is_active ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`} />
                                    {user?.is_active ? 'Active' : 'Suspended'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="h-5 w-5 text-[#8B5CF6]" />
                            <h2 className="text-base font-semibold text-[#0A0A0A]">Security Settings</h2>
                        </div>
                        <p className="text-xs text-[#6B7280] mb-4 leading-relaxed">
                            Your session is strictly managed using high-security JWT implementations featuring short-lived access tokens and HttpOnly refresh cookies.
                        </p>
                        <div className="space-y-2.5 text-xs font-medium text-[#4B5563] bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB]">
                            <p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" /> Memory-only access token</p>
                            <p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" /> HttpOnly refresh cookie</p>
                            <p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" /> Silent token rotation</p>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                    className="space-y-6 lg:col-span-2"
                >
                    {/* Provider Status */}
                    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <Key className="h-5 w-5 text-[#F59E0B]" />
                            <h2 className="text-base font-semibold text-[#0A0A0A]">AI Provider Status</h2>
                        </div>
                        <p className="text-sm text-[#6B7280] mb-6">
                            API keys are securely vaulted in the backend environment. Configure active providers via server environment variables.
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {providers.map((provider) => (
                                <div key={provider.name} className="flex flex-col gap-3 rounded-xl border border-[#E5E7EB] p-4 bg-[#FAFAFA]">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-[#0A0A0A] text-sm">{provider.name}</p>
                                            <p className="text-xs text-[#6B7280] mt-0.5">{provider.model}</p>
                                        </div>
                                        <div className={`h-2 w-2 rounded-full ${provider.active ? 'bg-[#10B981]' : 'bg-[#E5E7EB]'}`} />
                                    </div>
                                    <div className="mt-2 flex items-center justify-between pt-3 border-t border-[#F3F4F6]">
                                        <span className={`text-xs font-medium px-2 py-1 rounded-md ${provider.active ? 'bg-[#ECFDF5] text-[#10B981]' : 'bg-[#F9FAFB] text-[#9CA3AF]'}`}>
                                            {provider.active ? 'Connected' : 'Not configured'}
                                        </span>
                                        <button className="text-xs font-medium text-[#0066FF] hover:text-[#0052CC] transition-colors">
                                            Configure
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <Bell className="h-5 w-5 text-[#EF4444]" />
                            <h2 className="text-base font-semibold text-[#0A0A0A]">Notification Preferences</h2>
                        </div>
                        <div className="space-y-4">
                            {[
                                { title: 'Security Alerts', desc: 'Get notified about unauthorized access attempts and security risks.', active: true },
                                { title: 'AI Usage Limits', desc: 'Receive alerts when you approach your API rate limits.', active: true },
                                { title: 'System Updates', desc: 'Updates about Launchstack platform changes and maintenance.', active: false },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start justify-between border-b border-[#F3F4F6] pb-4 last:border-0 last:pb-0">
                                    <div>
                                        <p className="text-sm font-medium text-[#0A0A0A]">{item.title}</p>
                                        <p className="text-xs text-[#6B7280] mt-0.5">{item.desc}</p>
                                    </div>
                                    <button
                                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${item.active ? 'bg-[#10B981]' : 'bg-[#E5E7EB]'}`}
                                    >
                                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${item.active ? 'translate-x-4' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
