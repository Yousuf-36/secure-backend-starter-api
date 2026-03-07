'use client'

import { motion } from 'framer-motion'
import { Lock, Layers, Zap, Database, Box, Server } from 'lucide-react'

const features = [
    {
        icon: Lock,
        title: "JWT Auth & RBAC",
        description: "Access & HttpOnly refresh tokens. Role-based access control with robust hierarchical dependency injection.",
        tags: ["JWT", "Bcrypt", "Alembic"]
    },
    {
        icon: Layers,
        title: "AI Module Abstracted",
        description: "Plug-and-play Groq, Gemini, Hugging Face, or Ollama completions. Switch provider with 1 env variable change.",
        tags: ["Groq", "Gemini", "Ollama"]
    },
    {
        icon: Box,
        title: "Production Ready DB",
        description: "Async SQLAlchemy, connection pooling, and Pydantic v2 schemas for robust data validation.",
        tags: ["PostgreSQL", "SQLAlchemy"]
    },
    {
        icon: Zap,
        title: "FastAPI Async Core",
        description: "Fully asynchronous routing and service integration for maximum throughput and seamless concurrency.",
        tags: ["FastAPI", "Uvicorn", "AsyncIO"]
    },
    {
        icon: Server,
        title: "Docker Native",
        description: "Comes with a production-ready Dockerfile and docker-compose for frictionless development and deployment.",
        tags: ["Docker", "Docker Compose"]
    },
    {
        icon: Database,
        title: "Testing Integration",
        description: "Pytest configured out of the box with passing coverage for standard auth and lifecycle events.",
        tags: ["Pytest", "Coverage"]
    }
]

export const FeaturesSection = () => {
    return (
        <section id="features" className="py-32 bg-[var(--color-bg)] text-[var(--color-text-primary)]">
            <div className="max-w-[1280px] mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-6">
                        Everything you need. <span className="text-[var(--color-text-secondary)]">Nothing you don&apos;t.</span>
                    </h2>
                    <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed">
                        Eliminate hours of boilerplate setup. Launchstack gives you the critical building blocks required for any modern, scalable web service.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 hover:border-[var(--color-accent)]/50 hover:shadow-[0_8px_30px_var(--color-accent-dim)] group transition-all"
                        >
                            <div className="w-12 h-12 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[var(--color-accent-dim)] transition-colors">
                                <feature.icon className="w-6 h-6 text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors" />
                            </div>
                            <h3 className="text-xl font-display font-semibold mb-3">{feature.title}</h3>
                            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-6">
                                {feature.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {feature.tags.map(tag => (
                                    <span key={tag} className="px-2.5 py-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-xs font-medium text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)] transition-colors">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
