export interface ApiError {
    code: string
    message: string
    detail: unknown
}

export interface ApiErrorResponse {
    error: ApiError
}

export const ERROR_MESSAGES: Record<string, string> = {
    AUTH_INVALID_CREDENTIALS: 'Invalid email or password',
    AUTH_TOKEN_EXPIRED: 'Your session expired. Please log in again.',
    AUTH_INSUFFICIENT_ROLE: "You don't have permission to do that.",
    CONFLICT: 'An account with this email already exists.',
    VALIDATION_ERROR: 'Please check your inputs and try again.',
    SERVER_ERROR: 'Something went wrong. Please try again.',
    AI_UPSTREAM_ERROR: 'AI service is temporarily unavailable.',
    AUTH_REQUIRED: 'Please log in to continue.',
}

export function resolveErrorMessage(code: string): string {
    return ERROR_MESSAGES[code] ?? 'An unexpected error occurred.'
}
