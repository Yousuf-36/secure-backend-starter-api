'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Copy, RotateCcw, Clock, MoreHorizontal, AlertCircle } from 'lucide-react'
import { generateCompletion } from '@/lib/api/ai'
import { resolveErrorMessage } from '@/types/api'
import type { AxiosError } from 'axios'

interface CompletionEntry {
    id: string
    prompt: string
    response: string
    model: string
    tokens: number
    latency: string
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
    const [activeModel, setActiveModel] = useState('Groq')
    const [temperature, setTemperature] = useState(0.7)
    const [maxTokens, setMaxTokens] = useState(1024)
    const [activeEntry, setActiveEntry] = useState<CompletionEntry | null>(null)

    const models = ['Groq', 'Gemini', 'Ollama']
    const tokenOptions = [256, 512, 1024, 2048]

    async function handleSubmit(e?: React.FormEvent, overridePrompt?: string) {
        if (e) e.preventDefault()
        const textToSubmit = overridePrompt || prompt.trim()
        if (!textToSubmit || isLoading) return

        if (!overridePrompt) {
            setPrompt('')
        }
        setIsLoading(true)
        setError(null)
        setActiveEntry(null)

        const startTime = Date.now()

        try {
            const result = await generateCompletion({ 
                prompt: textToSubmit, 
                max_tokens: maxTokens,
                temperature: temperature
            })
            
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(2)
            
            const entry: CompletionEntry = {
                id: crypto.randomUUID(),
                prompt: textToSubmit,
                response: result.response,
                model: result.model_used || activeModel,
                tokens: maxTokens,
                latency: `${elapsed}s`,
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

    const copyToClipboard = () => {
        if (activeEntry?.response) {
            navigator.clipboard.writeText(activeEntry.response)
        }
    }

    return (
        <div className="flex flex-col md:flex-row h-full w-full overflow-hidden bg-[var(--color-bg)]">
            
            {/* LEFT PANEL (65%) */}
            <div className="flex flex-col w-full md:w-[65%] h-full bg-[var(--color-surface)] border-r border-[var(--color-border)]">
                
                {/* TOOLBAR */}
                <div className="flex items-center justify-between h-12 px-6 border-b border-[var(--color-border)] flex-shrink-0">
                    <h1 className="text-lg font-display font-bold text-[var(--color-primary)]">AI Studio</h1>
                    
                    <div className="flex items-center gap-6">
                        {/* Models */}
                        <div className="flex items-center gap-1.5 p-1 bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)]">
                            {models.map(m => (
                                <button
                                    key={m}
                                    onClick={() => setActiveModel(m)}
                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                                        activeModel === m 
                                        ? 'bg-[var(--color-accent)] text-[var(--color-dark-text)]' 
                                        : 'bg-[var(--color-surface)] text-[var(--color-secondary)] hover:text-[var(--color-primary)]'
                                    }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                        
                        {/* Temperature */}
                        <div className="hidden lg:flex items-center gap-3 text-xs font-bold text-[var(--color-secondary)]">
                            <span>Temp</span>
                            <input 
                                type="range" 
                                min="0" max="2" 
                                step="0.1" 
                                value={temperature} 
                                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                className="w-20 accent-[var(--color-accent)]" 
                            />
                            <span className="w-6">{temperature}</span>
                        </div>
                    </div>
                </div>

                {/* SCROLLABLE INNER AREA */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 relative">
                    
                    {/* PROMPT SECTION */}
                    <div className="flex flex-col flex-shrink-0">
                        <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-secondary)] mb-2">
                            Prompt
                        </label>
                        <div className="relative">
                            <textarea
                                value={prompt}
                                onChange={(e) => {
                                    setPrompt(e.target.value)
                                    e.target.style.height = 'auto'
                                    e.target.style.height = `${Math.min(e.target.scrollHeight, 400)}px`
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                        e.preventDefault()
                                        handleSubmit()
                                    }
                                }}
                                placeholder="Enter your prompt... (⌘+Enter to send)"
                                className="w-full min-h-[160px] max-h-[40vh] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-4 pb-8 font-mono text-sm text-[var(--color-primary)] resize-none focus:outline-none focus:border-[var(--color-accent)] transition-colors placeholder:text-[var(--color-secondary)]/60"
                            />
                            <div className="absolute bottom-3 right-3 text-xs font-bold text-[var(--color-muted)]">
                                {prompt.length}
                            </div>
                        </div>

                        {/* Token Row */}
                        <div className="flex flex-wrap items-center justify-between mt-4">
                            <div className="flex items-center gap-3 mb-4 sm:mb-0">
                                <span className="text-xs font-bold text-[var(--color-secondary)]">Max tokens:</span>
                                <div className="flex items-center gap-2">
                                    {tokenOptions.map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setMaxTokens(t)}
                                            className={`px-3 py-1 text-xs font-bold rounded-full border border-[var(--color-border)] transition-colors ${
                                                maxTokens === t
                                                ? 'bg-[var(--color-accent)] text-[var(--color-dark-text)]'
                                                : 'bg-[var(--color-bg)] text-[var(--color-secondary)] hover:bg-[var(--color-surface)]'
                                            }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <button
                                onClick={(e) => handleSubmit(e)}
                                disabled={!prompt.trim() || isLoading}
                                className="w-full sm:w-auto flex-1 sm:flex-none h-12 flex items-center justify-center gap-2 px-8 bg-[var(--color-accent)] text-[var(--color-dark-text)] font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all border border-[var(--color-accent)] shrink-0 max-w-[200px]"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                ) : (
                                    <>
                                        Generate <Send className="w-4 h-4 ml-1" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* ERROR STATE */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="rounded-lg border border-[var(--color-secondary)] bg-[#FEF2F2] p-4 text-[var(--color-primary)] overflow-hidden shrink-0"
                            >
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-[var(--color-secondary)] flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="text-sm font-bold">Generation Failed</h3>
                                        <p className="text-sm mt-1 mb-3">{error}</p>
                                        <button
                                            onClick={() => handleSubmit(undefined, prompt)}
                                            className="px-4 py-1.5 bg-[var(--color-secondary)] text-[var(--color-dark-text)] text-xs font-bold rounded-md"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* RESPONSE SECTION */}
                    <AnimatePresence>
                        {activeEntry && !error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] overflow-hidden shrink-0"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                                    <h3 className="text-sm font-bold text-[var(--color-primary)]">Response</h3>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={copyToClipboard}
                                            className="p-1.5 rounded-md hover:bg-[var(--color-bg)] text-[var(--color-secondary)] transition-colors"
                                            title="Copy to clipboard"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleSubmit(undefined, activeEntry.prompt)}
                                            className="p-1.5 rounded-md hover:bg-[var(--color-bg)] text-[var(--color-secondary)] transition-colors"
                                            title="Regenerate"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Content */}
                                <div className="p-5 text-sm font-medium text-[var(--color-primary)] leading-relaxed whitespace-pre-wrap">
                                    <TypewriterText text={activeEntry.response} />
                                </div>
                                
                                {/* Footer */}
                                <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--color-border)] bg-[var(--color-surface)] text-[11px] font-bold text-[var(--color-muted)] uppercase tracking-wider">
                                    <div className="flex gap-4">
                                        <span>{activeEntry.model}</span>
                                        <span className="hidden sm:inline">Tokens: {activeEntry.tokens} MAX</span>
                                    </div>
                                    <span>Latency: {activeEntry.latency}</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* RIGHT PANEL (35%) */}
            <div className="flex flex-col w-full md:w-[35%] h-[400px] md:h-full bg-[var(--color-bg)] p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wider">History</h2>
                    <button 
                        onClick={() => setHistory([])}
                        className="text-xs font-bold text-[var(--color-muted)] hover:text-[var(--color-secondary)] transition-colors px-2 py-1 rounded"
                    >
                        Clear
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {history.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
                            <Clock className="w-8 h-8 text-[var(--color-border)] mb-3" />
                            <p className="font-bold text-[var(--color-secondary)]">No completions yet</p>
                            <p className="text-xs font-semibold text-[var(--color-muted)] mt-1">Your history appears here</p>
                        </div>
                    ) : (
                        history.map((entry) => (
                            <motion.button
                                key={entry.id}
                                onClick={() => {
                                    setPrompt(entry.prompt)
                                    setActiveEntry(entry)
                                }}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="w-full text-left bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 hover:border-l-[4px] hover:border-l-[var(--color-accent)] transition-all group"
                            >
                                <p className="text-sm font-bold text-[var(--color-primary)] truncate mb-3">
                                    {entry.prompt}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-[var(--color-secondary)] flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <span className="text-[10px] uppercase font-bold text-[var(--color-dark-text)] bg-[var(--color-border)] px-1.5 py-0.5 rounded">
                                        {entry.tokens} tok
                                    </span>
                                </div>
                            </motion.button>
                        ))
                    )}
                </div>
            </div>
            
        </div>
    )
}

function TypewriterText({ text }: { text: string }) {
    const [displayed, setDisplayed] = useState('')

    useEffect(() => {
        let i = 0
        setDisplayed('')
        const interval = setInterval(() => {
            setDisplayed(text.slice(0, i))
            i += 3
            if (i > text.length + 3) clearInterval(interval)
        }, 5)
        return () => clearInterval(interval)
    }, [text])

    return (
        <>
            {displayed.split('`').map((part, i) => {
                if (i % 2 !== 0) {
                    return <code key={i} className="px-1.5 py-0.5 mx-0.5 rounded bg-[var(--color-dark-card)] text-[var(--color-dark-text)] font-mono text-xs whitespace-pre-wrap">{part}</code>
                }
                return <span key={i}>{part}</span>
            })}
            <span className="inline-block w-1.5 h-3 ml-1 bg-[var(--color-accent)] animate-pulse align-middle" />
        </>
    )
}
