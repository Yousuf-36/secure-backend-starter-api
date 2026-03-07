'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export const CTASection = () => {
    return (
        <section className="py-32 bg-[var(--color-bg)] overflow-hidden">
            <div className="max-w-[1280px] mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl overflow-hidden p-12 md:p-20 text-center"
                >
                    {/* Subtle Accent Glows */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-50" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[var(--color-accent)]/5 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6 text-[var(--color-text-primary)]">
                            Ready to ship?
                        </h2>
                        <p className="text-lg md:text-xl text-[var(--color-text-secondary)] mb-10">
                            Stop wiring authentication and connecting databases. Spend your weekends building product features instead of boilerplate.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                            <Link href="/register">
                                <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-[var(--color-accent)] text-white font-semibold rounded-lg shadow-[0_0_24px_var(--color-accent-glow)] hover:bg-blue-600 transition-all hover:-translate-y-0.5 whitespace-nowrap">
                                    Get Started Free
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </Link>
                            <a href="https://github.com/launchstack" target="_blank" rel="noreferrer">
                                <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] font-semibold rounded-lg hover:bg-[var(--color-border-subtle)] transition-all hover:-translate-y-0.5 whitespace-nowrap">
                                    View Source Hub
                                </button>
                            </a>
                        </div>

                        <div className="flex flex-wrapjustify-center gap-6 text-sm text-[var(--color-text-muted)] font-medium">
                            <span className="flex items-center gap-1.5 justify-center"><CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" /> No credit card required</span>
                            <span className="flex items-center gap-1.5 justify-center"><CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" /> MIT License</span>
                            <span className="flex items-center gap-1.5 justify-center"><CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" /> Open Source Foundation</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
