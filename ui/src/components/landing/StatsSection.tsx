'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { CheckCircle2, Zap, Layers, Code2 } from 'lucide-react'

// Simple counter animation component
const Counter = ({ value, label, icon: Icon }: { value: string, label: string, icon: any }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (isInView) {
            if (typeof value === 'string' && !value.match(/^[0-9]+$/)) {
                setCount(parseInt(value) || 0)
            } else {
                const target = parseInt(value)
                let current = 0
                const interval = setInterval(() => {
                    current += Math.ceil(target / 20)
                    if (current >= target) {
                        setCount(target)
                        clearInterval(interval)
                    } else {
                        setCount(current)
                    }
                }, 50)
            }
        }
    }, [isInView, value])

    const displayValue = isNaN(parseInt(value)) ? value : count.toString()

    return (
        <div ref={ref} className="flex flex-col items-center justify-center p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
            <div className="w-12 h-12 bg-[var(--color-accent-dim)] text-[var(--color-accent)] rounded-full flex items-center justify-center mb-4">
                <Icon className="w-6 h-6" />
            </div>
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-4xl font-display font-bold text-[var(--color-text-primary)] mb-2"
            >
                {displayValue}
            </motion.div>
            <div className="text-[var(--color-text-secondary)] font-medium text-sm text-center">
                {label}
            </div>
        </div>
    )
}

export const StatsSection = () => {
    return (
        <section className="py-24 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
            <div className="max-w-[1280px] mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <Counter value="8" label="Tests Passing" icon={CheckCircle2} />
                    <Counter value="5" label="Min Setup Time" icon={Zap} />
                    <Counter value="3" label="AI Providers" icon={Layers} />
                    <Counter value="100%" label="TypeScript Strict" icon={Code2} />
                </div>
            </div>
        </section>
    )
}
