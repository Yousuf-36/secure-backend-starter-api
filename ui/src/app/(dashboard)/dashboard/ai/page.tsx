'use client'

import { AICompletionPanel } from '@/components/dashboard/AICompletionPanel'
import { useRole } from '@/lib/hooks/useRole'

export default function AIPage() {
    const isAiUser = useRole('ai_user') || useRole('admin')

    if (!isAiUser) {
        return (
            <div className="flex h-full items-center justify-center p-8 text-center bg-[var(--color-bg)]">
                <div className="max-w-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm p-8">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                        <span className="text-red-600 text-2xl font-bold">!</span>
                    </div>
                    <h2 className="text-lg font-bold text-[var(--color-primary)] mb-2">Role Required</h2>
                    <p className="text-sm font-semibold text-[var(--color-secondary)]">
                        You need the <code className="bg-[var(--color-bg)] px-1 py-0.5 rounded text-xs">ai_user</code> role to access the AI Studio. Please contact your admin.
                    </p>
                </div>
            </div>
        )
    }

    // Pass styling classes so the panel takes up the exact full viewport height (minus the dashboard layout padding if any)
    // The design requests full viewport height no outer scroll. The dashboard layout wraps it, so we use min-h-0 and flex-1.
    return (
        <div className="w-[calc(100vw-256px)] h-[calc(100vh)] absolute top-0 -ml-12 overflow-hidden flex flex-col bg-[var(--color-bg)]">
            <AICompletionPanel />
        </div>
    )
}
