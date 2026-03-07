'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export const ScreenshotsSection = () => {
    return (
        <section id="screenshots" className="py-32 bg-[var(--color-bg)] border-y border-[var(--color-border)] relative overflow-hidden">
            {/* Background Accent Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[var(--color-accent)]/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-[1280px] mx-auto px-6 relative z-10 text-center">
                <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-6 text-[var(--color-text-primary)]">
                    Pristine UI included.
                </h2>
                <p className="text-[var(--color-text-secondary)] text-lg mb-16 max-w-xl mx-auto">
                    We didn&apos;t just stop at the backend. You get a gorgeously composed React + Tailwind frontend focused on speed and aesthetics.
                </p>

                <div className="relative mx-auto w-full max-w-[1000px] h-[400px] md:h-[600px]">
                    {/* Main Dashboard Mockup */}
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute inset-0 z-20 border border-[var(--color-border)] rounded-xl md:rounded-2xl overflow-hidden bg-[var(--color-surface)] shadow-2xl flex items-center justify-center p-8"
                    >
                        <div className="w-full h-full border border-dashed border-[var(--color-border)] rounded-lg flex items-center justify-center text-[var(--color-text-muted)] flex-col gap-4 bg-[var(--color-bg)]">
                            <span className="font-mono text-sm">[ Dashboard UI Placeholder ]</span>
                            <span className="text-xs max-w-xs text-center">Replace this component with a real Next/Image of the actual application dashboard once built.</span>
                        </div>
                    </motion.div>

                    {/* AI Studio Fake Mockup (Left) */}
                    <motion.div
                        initial={{ opacity: 0, x: -50, rotate: -5 }}
                        whileInView={{ opacity: 1, x: 0, rotate: -2 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="absolute top-20 -left-4 md:-left-20 w-[240px] md:w-[320px] h-[300px] md:h-[400px] z-10 border border-[var(--color-border)] rounded-xl bg-[var(--color-surface)] shadow-2xl hidden sm:flex items-center justify-center p-4"
                    >
                        <div className="w-full h-full border border-dashed border-[var(--color-border)] rounded flex items-center justify-center text-[var(--color-text-muted)] bg-[var(--color-bg)]">
                            <span className="font-mono text-[10px] text-center p-2">[Login Screen Placeholder]</span>
                        </div>
                    </motion.div>

                    {/* Right Mockup */}
                    <motion.div
                        initial={{ opacity: 0, x: 50, rotate: 5 }}
                        whileInView={{ opacity: 1, x: 0, rotate: 2 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="absolute top-32 -right-4 md:-right-20 w-[240px] md:w-[320px] h-[300px] md:h-[400px] z-30 border border-[var(--color-border)] rounded-xl bg-[var(--color-surface)] shadow-2xl hidden sm:flex items-center justify-center p-4"
                    >
                        <div className="w-full h-full border border-dashed border-[var(--color-border)] rounded flex items-center justify-center text-[var(--color-text-muted)] bg-[var(--color-bg)]">
                            <span className="font-mono text-[10px] text-center p-2">[AI Studio Placeholder]</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
