import Link from 'next/link'
import { Shield } from 'lucide-react'

export const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-[var(--color-bg)]/80 border-b border-[var(--color-border)]">
            <Link href="/" className="flex items-center gap-2 text-[var(--color-white)]">
                <Shield className="w-6 h-6 text-[var(--color-accent)]" />
                <span className="font-display font-bold text-lg tracking-tight">Launchstack</span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--color-text-secondary)]">
                <Link href="#features" className="hover:text-[var(--color-white)] transition-colors">Features</Link>
                <Link href="#screenshots" className="hover:text-[var(--color-white)] transition-colors">Docs</Link>
                <Link href="#globe" className="hover:text-[var(--color-white)] transition-colors">Pricing</Link>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[var(--color-white)] transition-colors">GitHub</a>
            </div>

            <div className="flex items-center gap-4 text-sm font-medium">
                <Link href="/login" className="text-[var(--color-text-secondary)] hover:text-[var(--color-white)] transition-colors">
                    Sign In
                </Link>
                <Link href="/register" className="bg-[var(--color-accent)] text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors shadow-[0_0_15px_var(--color-accent-glow)]">
                    Get Started
                </Link>
            </div>
        </nav>
    )
}
