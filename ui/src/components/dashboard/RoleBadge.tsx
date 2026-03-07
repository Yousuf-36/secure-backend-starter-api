import { cn } from '@/lib/utils'

interface RoleBadgeProps {
    role: string
    size?: 'sm' | 'md'
}

const roleConfig: Record<string, { label: string; classes: string }> = {
    admin: { label: 'Admin', classes: 'bg-[#EEF4FF] text-[#0066FF]' },
    ai_user: { label: 'AI User', classes: 'bg-purple-50 text-purple-600' },
    user: { label: 'User', classes: 'bg-[#F0FDF4] text-[#10B981]' },
}

export function RoleBadge({ role, size = 'md' }: RoleBadgeProps) {
    const config = roleConfig[role] ?? { label: role, classes: 'bg-[#F9FAFB] text-[#6B7280]' }

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
