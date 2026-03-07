'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { AlertCircle, Loader2 } from 'lucide-react'
import { loginSchema, type LoginFormValues } from '@/lib/validators/auth.schema'
import { useAuthStore } from '@/lib/store/authStore'
import { getErrorMessage } from '@/lib/utils/errors'

export function LoginForm() {
    const { login, isLoading, error, clearError } = useAuthStore()
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

    async function onSubmit(values: LoginFormValues) {
        try {
            clearError()
            await login(values)
            router.push('/dashboard')
        } catch {
            // Store catches err into 'error' state
        }
    }

    // Parse error explicitly
    const displayError = error ? getErrorMessage(error) : null

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full max-w-sm"
        >
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold tracking-tight text-[var(--color-text-primary)]">Welcome back</h1>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Sign in to your Launchstack account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-[var(--color-text-primary)]">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        autoComplete="email"
                        {...register('email')}
                        className={`w-full h-11 px-3 rounded-lg border bg-[var(--color-bg)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:border-transparent transition-all ${errors.email
                                ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]/20'
                                : 'border-[var(--color-border)] focus:ring-[var(--color-accent)]'
                            }`}
                    />
                    <AnimatePresence>
                        {errors.email && (
                            <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-xs text-[var(--color-error)] mt-1"
                            >
                                {errors.email.message}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="text-sm font-medium text-[var(--color-text-primary)]">
                            Password
                        </label>
                        <Link href="#" className="flex items-center text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                            Forgot password?
                        </Link>
                    </div>

                    <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        {...register('password')}
                        className={`w-full h-11 px-3 rounded-lg border bg-[var(--color-bg)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:border-transparent transition-all ${errors.password
                                ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]/20'
                                : 'border-[var(--color-border)] focus:ring-[var(--color-accent)]'
                            }`}
                    />
                    <AnimatePresence>
                        {errors.password && (
                            <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-xs text-[var(--color-error)] mt-1"
                            >
                                {errors.password.message}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>

                {/* Global API error */}
                <AnimatePresence>
                    {displayError && (
                        <motion.div
                            initial={{ opacity: 0, y: -4, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -4, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="flex items-center gap-2 rounded-lg bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 p-3 text-sm text-[var(--color-error)] mt-1">
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                {displayError}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 rounded-lg bg-[var(--color-accent)] text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_15px_var(--color-accent-glow)] transition-all active:scale-[0.98] flex items-center justify-center mt-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in…
                        </>
                    ) : (
                        'Sign in to Launchstack'
                    )}
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-[var(--color-text-muted)] border-t border-[var(--color-border)] pt-8">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-medium text-[var(--color-white)] hover:text-[var(--color-accent)] transition-colors">
                    Create account
                </Link>
            </div>
        </motion.div>
    )
}
