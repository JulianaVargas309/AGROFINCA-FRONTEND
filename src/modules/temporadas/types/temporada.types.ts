export interface Temporada {
  id: number
  nombre: string
  descripcion?: string
  fechaInicio: string
  fechaFin?: string
  activo: boolean
  fincaId: number
  createdAt: string
  finca?: { id: number; nombre: string }
}

export interface CreateTemporadaInput {
  nombre: string
  descripcion?: string
  fechaInicio: string
  fechaFin?: string
  fincaId: number
}

export interface UpdateTemporadaInput {
  nombre?: string
  descripcion?: string
  fechaInicio?: string
  fechaFin?: string
  activo?: boolean
  fincaId?: number
}
