import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'Launchstack — Secure Backend Starter',
  description: 'Production-ready API boilerplate with JWT auth, RBAC, and AI integration.',
  openGraph: {
    title: 'Launchstack',
    description: 'The secure FastAPI backend starter kit.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // We use dark mode as default for the v2.0 design system.
  return (
    <html lang="en" className="dark">
      <body className="bg-[var(--color-bg)] text-[var(--color-text-primary)] font-sans antialiased">
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  )
}
