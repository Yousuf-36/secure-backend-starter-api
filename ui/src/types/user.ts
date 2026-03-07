export interface Role {
    id: number
    name: string
}

export interface User {
    id: number
    email: string
    is_active: boolean
    roles: Role[]
}
