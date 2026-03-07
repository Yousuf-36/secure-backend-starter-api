'use client'

import { AICompletionPanel } from '@/components/dashboard/AICompletionPanel'

export default function AIPage() {
    return (
        <div className="flex h-[calc(100vh-80px)] flex-col">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight text-[#0A0A0A]">AI Studio</h1>
                <p className="mt-1 text-sm text-[#6B7280]">
                    Powered by Groq · Llama 3 8B · Requires <code className="rounded bg-[#F3F4F6] px-1 py-0.5 text-xs">ai_user</code> or <code className="rounded bg-[#F3F4F6] px-1 py-0.5 text-xs">admin</code> role
                </p>
            </div>
            <div className="flex-1 overflow-hidden">
                <AICompletionPanel />
            </div>
        </div>
    )
}
