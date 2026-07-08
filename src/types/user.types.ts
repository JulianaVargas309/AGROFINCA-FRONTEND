export const Rol = {
  ADMIN: "ADMIN",
  FAMILIAR: "FAMILIAR",
  CONSULTA: "CONSULTA",
} as const

export type Rol = (typeof Rol)[keyof typeof Rol]

interface User {
  id: number
  nombre: string | null
  documento: string
  rol: Rol
  activo: boolean
  createdAt: string
  updatedAt: string
}

interface LoginCredentials {
  documento: string
  password: string
}

interface RegisterData {
  documento: string
  rol?: Rol
}

interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export type { User, LoginCredentials, RegisterData, AuthResponse }
