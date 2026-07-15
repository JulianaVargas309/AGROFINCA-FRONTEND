export interface AuthData {
  accessToken: string
  refreshToken: string
  user: {
    id: number
    nombre: string | null
    documento: string
    correo?: string | null
    telefono?: string | null
    ultimoAcceso?: string | null
    foto?: string | null
    rol: string
    activo?: boolean
    createdAt?: string
  }
}

export interface LoginInput {
  documento: string
  password: string
}

export interface RegisterInput {
  documento: string
  rol?: string
}
