'use client'

import { useState } from 'react'
import { AICompletionPanel } from '@/components/dashboard/AICompletionPanel'
import { Settings2, Cpu, Zap, Library, Workflow } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRole } from '@/lib/hooks/useRole'

export default function AIPage() {
    const isAiUser = useRole('ai_user') || useRole('admin')
    const [selectedModel, setSelectedModel] = useState('groq')

    const models = [
        { id: 'groq', name: 'Llama 3 8B (Groq)', icon: Zap, active: true },
        { id: 'gemini', name: 'Gemini 1.5 Pro', icon: Workflow, active: false },
        { id: 'hf', name: 'Mistral 7B (HF)', icon: Library, active: false },
        { id: 'cohere', name: 'Command R', icon: Cpu, active: false },
    ]

    return (
        <div className="flex h-[calc(100vh-80px)] flex-col">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-[#0A0A0A]">AI Studio</h1>
                    <p className="mt-1 text-sm text-[#6B7280]">
                        High-performance inference powered by multi-model routing
                    </p>
                </div>
                {!isAiUser && (
                    <div className="inline-flex items-center rounded-lg bg-[#FEF2F2] px-3 py-1.5 text-xs font-medium text-[#EF4444] border border-[#FEE2E2]">
                        Requires ai_user role
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0 overflow-hidden">
                {/* Configuration Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hidden lg:flex flex-col gap-6 overflow-y-auto pr-2"
                >
                    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Settings2 className="h-4 w-4 text-[#6B7280]" />
                            <h2 className="text-sm font-semibold text-[#0A0A0A]">Model Selection</h2>
                        </div>
                        <div className="space-y-2">
                            {models.map((model) => (
                                <button
                                    key={model.id}
                                    onClick={() => setSelectedModel(model.id)}
                                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${selectedModel === model.id
                                            ? 'border-[#0066FF] bg-[#EEF4FF] ring-1 ring-[#0066FF]'
                                            : 'border-[#E5E7EB] bg-white hover:border-[#0066FF]/30 hover:bg-[#F9FAFB]'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <model.icon className={`h-4 w-4 ${selectedModel === model.id ? 'text-[#0066FF]' : 'text-[#9CA3AF]'}`} />
                                        <span className={`text-sm font-medium ${selectedModel === model.id ? 'text-[#0066FF]' : 'text-[#0A0A0A]'}`}>
                                            {model.name}
                                        </span>
                                    </div>
                                    {selectedModel === model.id && (
                                        <div className="h-2 w-2 rounded-full bg-[#0066FF]" />
                                    )}
                                </button>
                            ))}
                        </div>
                        {selectedModel !== 'groq' && (
                            <div className="mt-4 p-3 rounded-lg bg-[#FEF2F2] border border-[#FEE2E2] text-xs text-[#EF4444]">
                                This model requires backend proxy configuration to be fully active. Defaulting to Groq Llama 3 for inference.
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
                        <h2 className="text-sm font-semibold text-[#0A0A0A] mb-3">Parameters</h2>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-xs font-medium text-[#4B5563]">Temperature</label>
                                    <span className="text-xs text-[#9CA3AF]">0.7</span>
                                </div>
                                <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" className="w-full accent-[#0066FF]" />
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-xs font-medium text-[#4B5563]">Max Tokens</label>
                                    <span className="text-xs text-[#9CA3AF]">1000</span>
                                </div>
                                <input type="range" min="100" max="4000" step="100" defaultValue="1000" className="w-full accent-[#0066FF]" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main AI Chat/Completion Panel */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="lg:col-span-3 h-full flex flex-col min-h-0 relative"
                >
                    {/* The AICompletionPanel internally flexes to full height. We render it inside a wrapper to ensure it takes up exactly the rest of the available space. */}
                    <div className="absolute inset-0">
                        {isAiUser ? (
                            <AICompletionPanel />
                        ) : (
                            <div className="flex h-full items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white shadow-sm p-8 text-center bg-stripes">
                                <div className="max-w-sm">
                                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FEF2F2]">
                                        <Zap className="h-6 w-6 text-[#EF4444]" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-[#0A0A0A] mb-2">Role Required</h2>
                                    <p className="text-sm text-[#6B7280]">
                                        You need the <code className="bg-[#F3F4F6] px-1 py-0.5 rounded text-xs text-[#0A0A0A]">ai_user</code> role to access the AI Studio and run inference requests. Please contact your admin.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
