'use client'

const MOCK_ACTIVITY = [
    { id: 1, method: 'POST', endpoint: '/api/v1/ai/completion', status: 200, time: '2 mins ago' },
    { id: 2, method: 'GET', endpoint: '/api/v1/auth/me', status: 200, time: '15 mins ago' },
    { id: 3, method: 'POST', endpoint: '/api/v1/auth/login', status: 401, time: '1 hour ago' },
    { id: 4, method: 'PATCH', endpoint: '/api/v1/users/profile', status: 200, time: '3 hours ago' },
    { id: 5, method: 'DELETE', endpoint: '/api/v1/sessions/active', status: 200, time: '5 hours ago' },
    { id: 6, method: 'GET', endpoint: '/api/v1/system/health', status: 502, time: '1 day ago' },
    { id: 7, method: 'POST', endpoint: '/api/v1/auth/refresh', status: 200, time: '2 days ago' },
    { id: 8, method: 'GET', endpoint: '/api/v1/ai/models', status: 200, time: '2 days ago' },
]

const methodColors: Record<string, string> = {
    GET: 'bg-[var(--color-accent)] text-[var(--color-dark-text)]',
    POST: 'bg-[var(--color-secondary)] text-[var(--color-dark-text)]',
    DELETE: 'bg-red-900 text-[var(--color-dark-text)]',
    PATCH: 'bg-[var(--color-muted)] text-[var(--color-dark-text)]',
}

const statusColors = (status: number) => {
    if (status >= 200 && status < 300) return 'text-emerald-800 bg-emerald-100 border-emerald-300'
    if (status >= 400 && status < 500) return 'text-amber-800 bg-amber-100 border-amber-300'
    return 'text-red-800 bg-red-100 border-red-300'
}

export function ActivityFeed() {
    return (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm overflow-hidden mt-6">
            <div className="border-b border-[var(--color-border)] px-6 py-5 bg-[var(--color-surface)]">
                <h2 className="text-lg font-bold text-[var(--color-primary)]">Recent Activity</h2>
                <p className="text-xs text-[var(--color-secondary)] mt-0.5 font-medium">Live API request log</p>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[var(--color-bg)]/60 border-b border-[var(--color-border)]">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-[var(--color-secondary)] text-[11px] uppercase tracking-widest">Method</th>
                            <th className="px-6 py-4 font-semibold text-[var(--color-secondary)] text-[11px] uppercase tracking-widest">Endpoint</th>
                            <th className="px-6 py-4 font-semibold text-[var(--color-secondary)] text-[11px] uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 font-semibold text-[var(--color-secondary)] text-[11px] uppercase tracking-widest text-right">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                        {MOCK_ACTIVITY.map((log) => (
                            <tr key={log.id} className="hover:bg-[var(--color-bg)]/40 transition-colors">
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center justify-center rounded px-2.5 py-1 text-[10px] font-bold tracking-widest ${methodColors[log.method]}`}>
                                        {log.method}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-mono text-xs font-semibold text-[var(--color-primary)]">
                                    {log.endpoint}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${statusColors(log.status)}`}>
                                        {log.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-xs text-[var(--color-muted)] text-right font-medium">
                                    {log.time}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
