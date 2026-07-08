export interface Lote {
  id: number
  nombre: string
  area?: number
  descripcion?: string
  activo: boolean
  fincaId: number
  createdAt: string
  updatedAt: string
}

export interface CreateLoteInput {
  nombre: string
  area?: number
  descripcion?: string
  fincaId: number
}

export interface UpdateLoteInput {
  nombre?: string
  area?: number
  descripcion?: string
  activo?: boolean
}
