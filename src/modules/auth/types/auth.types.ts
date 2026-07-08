export interface AuthData {
  accessToken: string
  refreshToken: string
  user: {
    id: number
    nombre: string | null
    documento: string
    rol: string
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
