'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
    {
        name: "Alex Rivera",
        role: "Founding Engineer @ NeuroLabs",
        content: "Launchstack saved us roughly 3 weeks of standard setup. The async logic and RBAC was exactly what we would have built anyway, just faster.",
        avatar: "https://i.pravatar.cc/150?u=alex"
    },
    {
        name: "Sarah Chen",
        role: "CTO @ SyntaxHQ",
        content: "Finally a boilerplate that doesn&apos;t feel like a toy. It&apos;s refreshing to see real architectural decisions encoded in the starter kit. Highly recommended.",
        avatar: "https://i.pravatar.cc/150?u=sarah"
    },
    {
        name: "Marcus Dubois",
        role: "Indie Hacker",
        content: "The AI module abstraction is chef's kiss. Swapping from OpenAI to Groq took me changing a single environment variable. Pure velocity.",
        avatar: "https://i.pravatar.cc/150?u=marcus"
    }
]

export const TestimonialsSection = () => {
    return (
        <section className="py-32 bg-[var(--color-bg)] border-y border-[var(--color-border)]">
            <div className="max-w-[1280px] mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-4 text-[var(--color-text-primary)]">
                        Don&apos;t just take our word for it.
                    </h2>
                    <p className="text-[var(--color-text-secondary)] text-lg max-w-xl mx-auto">
                        See what engineers are saying about skipping the boilerplate.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-[var(--color-surface)] border border-[var(--color-border)] p-8 rounded-2xl flex flex-col"
                        >
                            <div className="flex gap-1 mb-6 text-[var(--color-warning)]">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star key={star} className="w-4 h-4 fill-current" />
                                ))}
                            </div>
                            <p className="text-[var(--color-text-primary)] text-sm md:text-base leading-relaxed mb-8 flex-grow">
                                "{t.content}"
                            </p>
                            <div className="flex items-center gap-4">
                                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full border border-[var(--color-border)]" />
                                <div>
                                    <div className="font-semibold text-sm text-[var(--color-text-primary)]">{t.name}</div>
                                    <div className="text-xs text-[var(--color-text-muted)]">{t.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
