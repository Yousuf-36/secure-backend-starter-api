'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface StaggerRevealProps {
    children: ReactNode
    className?: string
    delay?: number
    staggerDelay?: number
}

const container = (staggerDelay = 0.08, delay = 0) => ({
    hidden: {},
    show: {
        transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
        },
    },
})

const item: import('framer-motion').Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
}

export function StaggerReveal({ children, className, delay = 0, staggerDelay = 0.08 }: StaggerRevealProps) {
    return (
        <motion.div
            className={className}
            variants={container(staggerDelay, delay)}
            initial="hidden"
            animate="show"
        >
            {children}
        </motion.div>
    )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <motion.div className={className} variants={item}>
            {children}
        </motion.div>
    )
}
