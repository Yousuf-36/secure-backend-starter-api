'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { PageTransition } from '@/components/motion/PageTransition'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-[#FAFAFA]">
            <Sidebar />
            <main className="ml-64 flex-1 overflow-y-auto">
                <PageTransition>
                    <div className="mx-auto max-w-5xl px-8 py-10">
                        {children}
                    </div>
                </PageTransition>
            </main>
        </div>
    )
}
