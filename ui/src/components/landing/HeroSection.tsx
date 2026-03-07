'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ArrowRight, ShieldCheck, Cpu } from 'lucide-react'
import Link from 'next/link'

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), { ssr: false })

export const HeroSection = () => {
    return (
        <section className="relative min-h-[100vh] w-full flex items-center justify-center overflow-hidden bg-[var(--color-bg)] pt-20 border-b border-[var(--color-border)]">
            <div className="max-w-[1280px] w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

                {/* Left Content */}
                <div className="flex flex-col items-start pt-16">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/50 backdrop-blur-md text-[var(--color-text-secondary)] text-xs uppercase tracking-widest font-semibold mb-8 shadow-sm"
                    >
                        <ShieldCheck className="w-4 h-4 text-[var(--color-success)]" />
                        Launchstack v1.0
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.06, ease: "easeOut" }}
                        className="text-5xl md:text-6xl font-display font-bold leading-[1.1] tracking-[-0.03em] mb-6 text-[var(--color-text-primary)]"
                    >
                        The secure backend that <span className="text-[var(--color-accent)]">doesn’t compromise.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
                        className="text-lg md:text-xl text-[var(--color-text-secondary)] leading-[1.6] max-w-lg mb-10"
                    >
                        FastAPI + PostgreSQL + Next.js. Production-ready authentication, role-based access control, and seamless AI integration. Built for scale.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.18, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
                    >
                        <Link href="/register" className="w-full sm:w-auto">
                            <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-[var(--color-accent)] text-white font-semibold rounded-lg shadow-[0_0_24px_var(--color-accent-glow)] hover:bg-blue-600 transition-all hover:-translate-y-0.5 whitespace-nowrap">
                                Start building
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                        <a href="https://github.com/launchstack" target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                            <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] font-semibold rounded-lg hover:bg-[var(--color-border)] transition-all hover:-translate-y-0.5 whitespace-nowrap">
                                View Documentation
                            </button>
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-12 flex items-center gap-6 text-[var(--color-text-muted)] text-sm font-medium"
                    >
                        <div className="flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-[var(--color-accent)]" /> Tested up to 10k req/s
                        </div>
                        <div className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-[var(--color-success)]" /> 100% Type Safe
                        </div>
                    </motion.div>
                </div>

                {/* Right 3D Visual */}
                <div className="relative h-[500px] lg:h-[700px] w-full hidden md:flex items-center justify-center">
                    <div className="absolute inset-0 w-full h-full">
                        <Suspense fallback={<div className="w-full h-full bg-[var(--color-surface)] animate-pulse rounded-2xl" />}>
                            <HeroScene />
                        </Suspense>
                    </div>

                    {/* Floating Code Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", opacity: { duration: 0.8 }, scale: { duration: 0.8 } }}
                        whileHover={{ scale: 1.05 }}
                        className="relative z-10 w-[320px] bg-[#0A0A0A]/80 backdrop-blur-xl border border-[var(--color-border)] p-5 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] lg:-ml-[20%]"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                            <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                            <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                        </div>
                        <pre className="text-xs font-mono text-gray-300 leading-relaxed overflow-x-hidden">
                            <span className="text-purple-400">@router.post</span>(&quot;/auth/login&quot;)<br />
                            <span className="text-blue-400">async def</span> login(<br />
                            &nbsp;&nbsp;db: AsyncSession,<br />
                            &nbsp;&nbsp;req: LoginRequest<br />
                            ):<br />
                            &nbsp;&nbsp;<span className="text-gray-500"># Verify credentials</span><br />
                            &nbsp;&nbsp;user = <span className="text-blue-400">await</span> auth_service(req)<br />
                            &nbsp;&nbsp;<br />
                            &nbsp;&nbsp;<span className="text-gray-500"># Issue strict JWTs</span><br />
                            &nbsp;&nbsp;<span className="text-blue-400">return</span> create_tokens(user)
                        </pre>
                    </motion.div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-[var(--color-text-muted)]"
            >
                <ChevronDown className="w-6 h-6" />
            </motion.div>
        </section>
    )
}
