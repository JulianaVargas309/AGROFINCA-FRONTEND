export interface User {
  id: number
  nombre: string
  apellido?: string | null
  documento: string
  correo?: string | null
  telefono?: string | null
  rol: string
  foto?: string | null
  ultimoAcceso?: string | null
  activo: boolean
  createdAt: string
  updatedAt: string
  roleId?: number | null
  role?: { id: number; nombre: string } | null
}

export interface CreateUserInput {
  nombre: string
  apellido?: string
  documento: string
  correo?: string
  telefono?: string
  password: string
  rol: string
}

export interface UpdateUserInput {
  nombre?: string
  apellido?: string
  correo?: string
  telefono?: string
  roleId?: number | null
  activo?: boolean
}
