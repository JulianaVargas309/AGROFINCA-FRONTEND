export interface Finca {
  id: number
  nombre: string
  ubicacion?: string
  hectareas?: number
  descripcion?: string
  activo: boolean
  userId: number
  createdAt: string
  updatedAt: string
}

export interface CreateFincaInput {
  nombre: string
  ubicacion?: string
  hectareas?: number
  descripcion?: string
}

export interface UpdateFincaInput {
  nombre?: string
  ubicacion?: string
  hectareas?: number
  descripcion?: string
}
