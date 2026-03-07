'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { Shield } from 'lucide-react'
import Link from 'next/link'

const ParticleField = dynamic(() => import('@/components/three/ParticleField'), { ssr: false })

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen bg-[var(--color-bg)]">
            {/* Left — Form */}
            <div className="flex flex-1 flex-col justify-center px-8 py-16 sm:px-12 lg:flex-none lg:w-[480px] xl:w-[560px] bg-[var(--color-surface)] border-r border-[var(--color-border)] relative z-10 shadow-[20px_0_40px_rgba(0,0,0,0.5)]">
                <div className="absolute top-8 left-8">
                    <Link href="/" className="flex items-center gap-2 text-[var(--color-white)] group">
                        <Shield className="w-6 h-6 text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
                        <span className="font-display font-bold text-lg tracking-tight">Launchstack</span>
                    </Link>
                </div>
                <div className="mx-auto w-full max-w-sm">
                    <RegisterForm />
                </div>
            </div>

            {/* Right — 3D visual */}
            <div className="relative hidden w-0 flex-1 lg:flex bg-[var(--color-bg)] items-center justify-center overflow-hidden">
                <Suspense fallback={<Skeleton className="h-full w-full bg-[var(--color-bg)]" />}>
                    <div className="absolute inset-0">
                        <ParticleField />
                    </div>
                </Suspense>
                {/* Overlay text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-12 text-center bg-gradient-to-t from-[var(--color-bg)] via-transparent to-[var(--color-bg)]/30 backdrop-blur-[2px]">
                    <div className="mt-auto mb-20 text-center max-w-lg">
                        <h2 className="text-4xl font-display font-bold tracking-tight text-[var(--color-text-primary)] leading-tight mb-4">
                            Ship faster.<br /><span className="text-[var(--color-text-secondary)]">Break less.</span>
                        </h2>
                        <p className="text-lg text-[var(--color-text-muted)]">
                            Join developers who skip the boring setup and get straight to building out the value.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
