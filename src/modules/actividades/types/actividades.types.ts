export interface ActividadSeguimiento {
  id: number
  titulo: string
  descripcion?: string
  estado: "PENDIENTE" | "EN_PROCESO" | "FINALIZADA" | "CANCELADA"
  fechaInicio?: string
  fechaFin?: string
  tiempoInvertido?: number
  costo?: number
  responsableId: number
  loteId?: number
  cultivoId?: number
  fincaId?: number
  responsable?: { id: number; nombre: string }
  lote?: { id: number; nombre: string }
  cultivo?: { id: number; nombre: string }
  finca?: { id: number; nombre: string }
  evidencias?: Evidencia[]
  productosUtilizados?: ActividadProducto[]
  createdAt: string
}

export interface Evidencia {
  id: number
  url: string
  tipo: string
  descripcion?: string
}

export interface ActividadProducto {
  id: number
  cantidad: number
  productoId: number
  producto?: { id: number; nombre: string }
}

export interface CreateActividadInput {
  titulo: string
  descripcion?: string
  estado: string
  fechaInicio?: string
  fechaFin?: string
  tiempoInvertido?: number
  costo?: number
  responsableId: number
  loteId?: number
  cultivoId?: number
  fincaId?: number
  evidencias?: { url: string; tipo: string; descripcion?: string }[]
  productosUtilizados?: { cantidad: number; productoId: number }[]
}

export interface UpdateActividadInput {
  titulo?: string
  descripcion?: string
  estado?: string
  fechaInicio?: string
  fechaFin?: string
  tiempoInvertido?: number
  costo?: number
  responsableId?: number
  loteId?: number
  cultivoId?: number
  fincaId?: number
  evidencias?: { url: string; tipo: string; descripcion?: string }[]
  productosUtilizados?: { cantidad: number; productoId: number }[]
}

export const ESTADO_ACTIVIDAD_OPTIONS = [
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "EN_PROCESO", label: "En Proceso" },
  { value: "FINALIZADA", label: "Finalizada" },
  { value: "CANCELADA", label: "Cancelada" },
] as const
