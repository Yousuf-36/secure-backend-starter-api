'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { registerSchema, type RegisterFormValues } from '@/lib/validators/auth.schema'
import { useAuthStore } from '@/lib/store/authStore'
import { getErrorMessage } from '@/lib/utils/errors'

export function RegisterForm() {
    const { register: registerUser, login, isLoading, error, clearError } = useAuthStore()
    const router = useRouter()
    const [success, setSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) })

    const passwordVal = watch('password') || ''

    async function onSubmit(values: RegisterFormValues) {
        try {
            clearError()
            await registerUser({ email: values.email, password: values.password })
            setSuccess(true)
            // Auto-login after register
            await login({ email: values.email, password: values.password })
            router.push('/dashboard')
        } catch {
            // handled by store
        }
    }

    const displayError = error ? getErrorMessage(error) : null

    // Determine password strength
    // 1: Weak, 2: Fair, 3: Good, 4: Strong
    let strength = 0
    if (passwordVal.length > 0) strength++
    if (passwordVal.length >= 8) strength++
    if (/[A-Z]/.test(passwordVal) && /[0-9]/.test(passwordVal)) strength++
    if (/[^A-Za-z0-9]/.test(passwordVal)) strength++

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full max-w-sm"
        >
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold tracking-tight text-[var(--color-text-primary)]">Create account</h1>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Start building your application today.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
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
                            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-xs text-[var(--color-error)] mt-1">
                                {errors.email.message}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="password" className="text-sm font-medium text-[var(--color-text-primary)]">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Min. 8 characters"
                        autoComplete="new-password"
                        {...register('password')}
                        className={`w-full h-11 px-3 rounded-lg border bg-[var(--color-bg)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:border-transparent transition-all ${errors.password
                                ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]/20'
                                : 'border-[var(--color-border)] focus:ring-[var(--color-accent)]'
                            }`}
                    />

                    {/* Password Strength Indicator */}
                    {passwordVal.length > 0 && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-2 flex gap-1">
                            {[1, 2, 3, 4].map((level) => (
                                <div
                                    key={level}
                                    className={`h-1 w-full rounded-full transition-colors duration-300 ${strength >= level
                                            ? (strength < 3 ? 'bg-[var(--color-warning)]' : 'bg-[var(--color-success)]')
                                            : 'bg-[var(--color-border)]'
                                        }`}
                                />
                            ))}
                        </motion.div>
                    )}

                    <AnimatePresence>
                        {errors.password && (
                            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-xs text-[var(--color-error)] mt-1">
                                {errors.password.message}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-[var(--color-text-primary)]">Confirm password</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        placeholder="Repeat password"
                        autoComplete="new-password"
                        {...register('confirmPassword')}
                        className={`w-full h-11 px-3 rounded-lg border bg-[var(--color-bg)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:border-transparent transition-all ${errors.confirmPassword
                                ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]/20'
                                : 'border-[var(--color-border)] focus:ring-[var(--color-accent)]'
                            }`}
                    />
                    <AnimatePresence>
                        {errors.confirmPassword && (
                            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-xs text-[var(--color-error)] mt-1">
                                {errors.confirmPassword.message}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>

                <div className="pt-2">
                    <label className="flex items-start gap-2.5 text-xs text-[var(--color-text-muted)] cursor-pointer">
                        <div className="pt-0.5">
                            <input type="checkbox" className="w-4 h-4 rounded border-[var(--color-border)] bg-[var(--color-bg)] accent-[var(--color-accent)]" required />
                        </div>
                        <span>I agree to the <Link href="#" className="hover:text-[var(--color-text-secondary)] underline decoration-[var(--color-border)] underline-offset-2">Terms of Service</Link> and <Link href="#" className="hover:text-[var(--color-text-secondary)] underline decoration-[var(--color-border)] underline-offset-2">Privacy Policy</Link>.</span>
                    </label>
                </div>

                <AnimatePresence>
                    {displayError && (
                        <motion.div initial={{ opacity: 0, y: -4, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -4, height: 0 }} className="overflow-hidden">
                            <div className="flex items-center gap-2 rounded-lg bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 p-3 text-sm text-[var(--color-error)] mt-2">
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                {displayError}
                            </div>
                        </motion.div>
                    )}
                    {success && !error && (
                        <motion.div initial={{ opacity: 0, y: -4, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -4, height: 0 }} className="overflow-hidden">
                            <div className="flex items-center gap-2 rounded-lg bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 p-3 text-sm text-[var(--color-success)] mt-2">
                                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                                Account created! Logging you in…
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 rounded-lg bg-[var(--color-white)] text-sm font-semibold text-[var(--color-bg)] hover:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.98] flex items-center justify-center mt-4"
                >
                    {isLoading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin text-[var(--color-bg)]" />Creating account…</>
                    ) : (
                        'Create account'
                    )}
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-[var(--color-text-muted)] border-t border-[var(--color-border)] pt-8">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-[var(--color-white)] hover:text-[var(--color-accent)] transition-colors">Sign in</Link>
            </div>
        </motion.div>
    )
}
