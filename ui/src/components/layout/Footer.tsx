import { Shield, Github, Twitter, DiscIcon as Discord } from 'lucide-react'
import Link from 'next/link'

export const Footer = () => {
    return (
        <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-16 px-6">
            <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-12">
                <div className="col-span-2">
                    <Link href="/" className="flex items-center gap-2 text-[var(--color-white)] mb-4">
                        <Shield className="w-6 h-6 text-[var(--color-accent)]" />
                        <span className="font-display font-bold text-xl tracking-tight">Launchstack</span>
                    </Link>
                    <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-6 max-w-sm">
                        Production-ready backend starter kit. FastAPI, PostgreSQL, and Next.js foundation built for ship velocity and security.
                    </p>
                    <div className="flex items-center gap-4 text-[var(--color-text-muted)]">
                        <Github className="w-5 h-5 hover:text-[var(--color-white)] transition-colors cursor-pointer" />
                        <Twitter className="w-5 h-5 hover:text-[var(--color-white)] transition-colors cursor-pointer" />
                        <Discord className="w-5 h-5 hover:text-[var(--color-white)] transition-colors cursor-pointer" />
                    </div>
                </div>

                <div>
                    <h4 className="font-display font-semibold text-[var(--color-white)] mb-4">Product</h4>
                    <ul className="space-y-3 test-sm text-[var(--color-text-secondary)]">
                        <li><Link href="#features" className="hover:text-[var(--color-accent)] transition-colors">Features</Link></li>
                        <li><Link href="#globe" className="hover:text-[var(--color-accent)] transition-colors">Enterprise</Link></li>
                        <li><Link href="#" className="hover:text-[var(--color-accent)] transition-colors">Security</Link></li>
                        <li><Link href="#" className="hover:text-[var(--color-accent)] transition-colors">Pricing</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-display font-semibold text-[var(--color-white)] mb-4">Resources</h4>
                    <ul className="space-y-3 test-sm text-[var(--color-text-secondary)]">
                        <li><Link href="#" className="hover:text-[var(--color-accent)] transition-colors">Documentation</Link></li>
                        <li><Link href="#" className="hover:text-[var(--color-accent)] transition-colors">GitHub</Link></li>
                        <li><Link href="#" className="hover:text-[var(--color-accent)] transition-colors">Changelog</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-display font-semibold text-[var(--color-white)] mb-4">Legals</h4>
                    <ul className="space-y-3 test-sm text-[var(--color-text-secondary)]">
                        <li><Link href="#" className="hover:text-[var(--color-accent)] transition-colors">Privacy Policy</Link></li>
                        <li><Link href="#" className="hover:text-[var(--color-accent)] transition-colors">Terms of Service</Link></li>
                        <li><Link href="#" className="hover:text-[var(--color-accent)] transition-colors">License</Link></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-[1280px] mx-auto mt-16 pt-8 border-t border-[var(--color-border)] text-sm text-[var(--color-text-muted)] flex justify-between">
                <p>© 2026 Launchstack. All rights reserved.</p>
            </div>
        </footer>
    )
}
