'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { generateCompletion } from '@/lib/api/ai'
import { resolveErrorMessage } from '@/types/api'
import type { AxiosError } from 'axios'

interface CompletionEntry {
    id: string
    prompt: string
    response: string
    model: string
    timestamp: Date
}

interface ApiErrorBody {
    error?: { code?: string }
}

export function AICompletionPanel() {
    const [prompt, setPrompt] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [history, setHistory] = useState<CompletionEntry[]>([])
    const [activeEntry, setActiveEntry] = useState<CompletionEntry | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!prompt.trim() || isLoading) return

        const currentPrompt = prompt.trim()
        setPrompt('')
        setIsLoading(true)
        setError(null)

        try {
            const result = await generateCompletion({ prompt: currentPrompt, max_tokens: 1000 })
            const entry: CompletionEntry = {
                id: crypto.randomUUID(),
                prompt: currentPrompt,
                response: result.response,
                model: result.model_used,
                timestamp: new Date(),
            }
            setHistory((prev) => [entry, ...prev])
            setActiveEntry(entry)
        } catch (err) {
            const axiosError = err as AxiosError<ApiErrorBody>
            const code = axiosError.response?.data?.error?.code ?? 'SERVER_ERROR'
            setError(resolveErrorMessage(code))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex h-full gap-6">
            {/* Main area */}
            <div className="flex flex-1 flex-col gap-4">
                {/* Response area */}
                <div className="flex-1 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm min-h-[320px]">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-3"
                            >
                                <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-4">
                                    <Sparkles className="h-4 w-4 text-[#0066FF] animate-pulse" />
                                    <span>Generating response…</span>
                                </div>
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-4/6" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </motion.div>
                        ) : error ? (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-start gap-3 text-[#EF4444]"
                            >
                                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-sm">Error</p>
                                    <p className="text-sm text-[#9CA3AF]">{error}</p>
                                </div>
                            </motion.div>
                        ) : activeEntry ? (
                            <motion.div
                                key={activeEntry.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[#9CA3AF]">
                                    {activeEntry.model}
                                </p>
                                <p className="whitespace-pre-wrap text-sm leading-7 text-[#0A0A0A]">
                                    {activeEntry.response}
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex h-full flex-col items-center justify-center gap-3 text-center"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF4FF]">
                                    <Sparkles className="h-6 w-6 text-[#0066FF]" />
                                </div>
                                <p className="font-medium text-[#0A0A0A]">AI Studio</p>
                                <p className="text-sm text-[#9CA3AF] max-w-xs">
                                    Enter a prompt below to generate a completion using Groq&apos;s Llama 3 model.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Prompt Input */}
                <form onSubmit={handleSubmit} className="relative">
                    <textarea
                        value={prompt}
                        onChange={(e) => {
                            setPrompt(e.target.value)
                            e.target.style.height = 'auto'
                            e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(e)
                        }}
                        placeholder="Enter your prompt… (Ctrl+Enter to submit)"
                        rows={3}
                        className="w-full resize-none rounded-xl border border-[#E5E7EB] bg-white px-4 py-3.5 pr-14 text-sm text-[#0A0A0A] placeholder-[#9CA3AF] shadow-sm outline-none ring-0 transition-all focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20"
                    />
                    <Button
                        type="submit"
                        disabled={!prompt.trim() || isLoading}
                        size="sm"
                        className="absolute bottom-3 right-3 h-8 w-8 rounded-lg bg-[#0066FF] p-0 text-white hover:bg-[#0052CC] disabled:opacity-40"
                    >
                        <Send className="h-3.5 w-3.5" />
                    </Button>
                </form>
            </div>

            {/* History sidebar */}
            <div className="hidden w-64 flex-col gap-2 lg:flex">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] px-1">
                    Recent
                </p>
                <div className="flex-1 space-y-2 overflow-y-auto">
                    {history.length === 0 ? (
                        <p className="text-xs text-[#9CA3AF] px-1">No completions yet.</p>
                    ) : (
                        history.map((entry) => (
                            <motion.button
                                key={entry.id}
                                initial={{ opacity: 0, x: 8 }}
                                animate={{ opacity: 1, x: 0 }}
                                onClick={() => setActiveEntry(entry)}
                                className={`w-full rounded-lg border p-3 text-left text-xs transition-colors ${activeEntry?.id === entry.id
                                        ? 'border-[#0066FF]/30 bg-[#EEF4FF]'
                                        : 'border-[#E5E7EB] bg-white hover:border-[#0066FF]/20 hover:bg-[#F9FAFB]'
                                    }`}
                            >
                                <p className="truncate font-medium text-[#0A0A0A]">{entry.prompt}</p>
                                <div className="mt-1 flex items-center gap-1 text-[#9CA3AF]">
                                    <Clock className="h-3 w-3" />
                                    <span>{entry.timestamp.toLocaleTimeString()}</span>
                                </div>
                            </motion.button>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
