export const Rol = {
  ADMIN: "ADMIN",
  FAMILIAR: "FAMILIAR",
  CONSULTA: "CONSULTA",
  TRABAJADOR: "TRABAJADOR",
} as const

export type Rol = (typeof Rol)[keyof typeof Rol]

interface User {
  id: number
  nombre: string | null
  apellido?: string | null
  documento: string
  correo?: string | null
  telefono?: string | null
  foto?: string | null
  ultimoAcceso?: string | null
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
  correo?: string
  telefono?: string
  rol?: Rol
}

interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export type { User, LoginCredentials, RegisterData, AuthResponse }
