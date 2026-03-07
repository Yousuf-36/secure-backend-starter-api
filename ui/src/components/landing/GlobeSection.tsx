'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Canvas } from '@react-three/fiber'

const GlobeNetwork = dynamic(() => import('@/components/three/GlobeNetwork'), { ssr: false })

export const GlobeSection = () => {
    return (
        <section id="globe" className="relative py-32 bg-[var(--color-bg)] overflow-hidden">
            <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="z-10"
                >
                    <div className="text-[var(--color-accent)] text-xs font-semibold uppercase tracking-widest mb-4">
                        Built for scale
                    </div>
                    <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-6 text-[var(--color-text-primary)]">
                        Infrastructure that grows with you.
                    </h2>
                    <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed mb-8">
                        Async SQLAlchemy, connection pooling, Docker Compose for local dev, and a clean separation of concerns means your stack won&apos;t collapse under pressure.
                    </p>

                    <div className="space-y-4">
                        {[
                            "Async PostgreSQL with connection pooling",
                            "Rate limiting per endpoint built-in",
                            "Role-based access control out of the box",
                            "Alembic schema migrations configured",
                            "Ready-to-deploy Docker containers"
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: 0.2 + (i * 0.1) }}
                                className="flex items-center gap-3"
                            >
                                <div className="w-6 h-6 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center flex-shrink-0">
                                    <Check className="w-3.5 h-3.5 text-[var(--color-success)]" />
                                </div>
                                <span className="text-[var(--color-text-primary)] font-medium text-sm">{item}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Right 3D Visual */}
                <div className="relative h-[450px] md:h-[600px] w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-xl">
                    <div className="absolute inset-0 z-0">
                        <Suspense fallback={<div className="w-full h-full bg-[var(--color-surface)] animate-pulse" />}>
                            <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ antialias: true, alpha: true }}>
                                <GlobeNetwork />
                            </Canvas>
                        </Suspense>
                    </div>
                    <div className="absolute inset-0 shadow-[inset_0_0_100px_var(--color-surface)] pointer-events-none" />
                </div>
            </div>
        </section>
    )
}
