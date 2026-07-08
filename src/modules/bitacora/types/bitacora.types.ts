export interface Bitacora {
  id: number
  fecha: string
  actividad: string
  descripcion: string
  cantidad?: number
  unidadMedida?: string
  costo: number
  observaciones?: string
  loteId: number
  cultivoId?: number
  productoId?: number
  lote?: { id: number; nombre: string }
  cultivo?: { id: number; nombre: string }
  producto?: { id: number; nombre: string }
  user?: { id: number; nombre: string }
}

export interface CreateBitacoraInput {
  fecha: string
  actividad: string
  descripcion: string
  cantidad?: number
  unidadMedida?: string
  costo?: number
  observaciones?: string
  loteId: number
  cultivoId?: number
  productoId?: number
}

export interface UpdateBitacoraInput {
  fecha?: string
  actividad?: string
  descripcion?: string
  cantidad?: number
  unidadMedida?: string
  costo?: number
  observaciones?: string
  cultivoId?: number
  productoId?: number
}

export interface BitacoraFilters {
  loteId?: number
  cultivoId?: number
  fechaDesde?: string
  fechaHasta?: string
  actividad?: string
  page?: number
  limit?: number
}
