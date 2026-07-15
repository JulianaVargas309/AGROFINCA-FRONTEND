export interface ActividadAsignada {
  id: number
  titulo: string
  descripcion?: string
  estado: string
  fechaAsignacion: string
  fechaInicio?: string
  fechaFin?: string
  prioridad: string
  trabajadorId: number
  loteId?: number
  cultivoId?: number
  trabajador?: { id: number; nombre: string }
  lote?: { id: number; nombre: string }
  cultivo?: { id: number; nombre: string }
}

export interface CreateActividadAsignadaInput {
  titulo: string
  descripcion?: string
  estado?: string
  fechaAsignacion?: string
  fechaInicio?: string
  fechaFin?: string
  prioridad?: string
  trabajadorId: number
  loteId?: number
  cultivoId?: number
}

export interface UpdateActividadAsignadaInput {
  titulo?: string
  descripcion?: string
  estado?: string
  fechaInicio?: string
  fechaFin?: string
  prioridad?: string
  trabajadorId?: number
  loteId?: number
  cultivoId?: number
}
