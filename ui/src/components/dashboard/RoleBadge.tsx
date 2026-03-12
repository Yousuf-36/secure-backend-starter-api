import { cn } from '@/lib/utils'

interface RoleBadgeProps {
    role: string
    size?: 'sm' | 'md'
}

const roleConfig: Record<string, { label: string; classes: string }> = {
    admin: { label: 'Admin', classes: 'bg-[var(--color-accent)] text-[var(--color-white)]' },
    ai_user: { label: 'AI User', classes: 'bg-[var(--color-bg)] text-[var(--color-primary)] border border-[var(--color-border)]' },
    user: { label: 'User', classes: 'bg-[var(--color-surface)] text-[var(--color-secondary)] border border-[var(--color-border)]' },
}

export function RoleBadge({ role, size = 'md' }: RoleBadgeProps) {
    const config = roleConfig[role] ?? { label: role, classes: 'bg-[var(--color-surface)] text-[var(--color-secondary)] border border-[var(--color-border)]' }

    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full font-medium uppercase tracking-wide',
                config.classes,
                size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
            )}
        >
            {config.label}
        </span>
    )
}

