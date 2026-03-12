'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const MOCK_DATA = [
    { day: 'Mon', value: 120 },
    { day: 'Tue', value: 340 },
    { day: 'Wed', value: 210 },
    { day: 'Thu', value: 450 },
    { day: 'Fri', value: 390 },
    { day: 'Sat', value: 680 },
    { day: 'Sun', value: 710 },
]

export function UsageChart() {
    const [period, setPeriod] = useState('7d')
    const maxVal = Math.max(...MOCK_DATA.map(d => d.value))
    
    // Generate path
    const points = MOCK_DATA.map((d, i) => {
        const x = (i / (MOCK_DATA.length - 1)) * 800
        const y = 220 - (d.value / maxVal) * 180
        return `${x},${y}`
    }).join(' L ')
    
    const dPath = `M 0,220 L ${points} L 800,220 Z`
    const linePath = `M ${points}`
    
    return (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-lg font-bold text-[var(--color-primary)] tracking-tight">API Usage</h2>
                    <p className="text-sm text-[var(--color-secondary)]">Request volume over time</p>
                </div>
                <div className="flex items-center gap-2 p-1 bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)]">
                    <button 
                        onClick={() => setPeriod('7d')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${period === '7d' ? 'bg-[var(--color-accent)] text-[var(--color-dark-text)] shadow-sm' : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)]'}`}
                    >
                        7d
                    </button>
                    <button 
                        onClick={() => setPeriod('30d')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${period === '30d' ? 'bg-[var(--color-accent)] text-[var(--color-dark-text)] shadow-sm' : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)]'}`}
                    >
                        30d
                    </button>
                </div>
            </div>
            
            <div className="relative w-full h-[240px]">
                {/* Custom SVG area chart matching palette */}
                <svg viewBox="0 0 800 240" className="w-full h-full preserve-aspect-ratio-none">
                    <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="var(--color-surface)" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    
                    {/* Grid lines */}
                    {[0, 1, 2, 3].map(i => (
                        <line 
                            key={i} 
                            x1="0" 
                            y1={40 + i * 60} 
                            x2="800" 
                            y2={40 + i * 60} 
                            stroke="var(--color-border)" 
                            strokeDasharray="4 4" 
                            strokeOpacity="0.6" 
                        />
                    ))}
                    
                    {/* Data Area */}
                    <motion.path 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        d={dPath} 
                        fill="url(#areaGradient)" 
                    />
                    
                    {/* Data Line */}
                    <motion.path 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        d={linePath} 
                        fill="none" 
                        stroke="var(--color-accent)" 
                        strokeWidth="3.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    />
                    
                    {/* Data Points */}
                    {MOCK_DATA.map((d, i) => {
                        const x = (i / (MOCK_DATA.length - 1)) * 800
                        const y = 220 - (d.value / maxVal) * 180
                        return (
                            <motion.circle 
                                key={i}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                cx={x} 
                                cy={y} 
                                r="5.5" 
                                fill="var(--color-surface)" 
                                stroke="var(--color-accent)" 
                                strokeWidth="2.5"
                                className="hover:r-8 hover:stroke-[3px] transition-all cursor-crosshair"
                            />
                        )
                    })}
                </svg>
                
                {/* X Axis Labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs font-semibold text-[var(--color-muted)] px-2 translate-y-6">
                    {MOCK_DATA.map(d => <span key={d.day}>{d.day}</span>)}
                </div>
            </div>
            <div className="h-6" />
        </div>
    )
}
