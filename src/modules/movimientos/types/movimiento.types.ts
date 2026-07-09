export interface Movimiento {
  id: number
  tipo: string
  cantidad: number
  unidadMedida: string
  fecha: string
  descripcion?: string
  productoId: number
  loteId?: number
  userId?: number
  activo: boolean
  createdAt: string
  updatedAt: string
  producto?: { id: number; nombre: string }
  lote?: { id: number; nombre: string }
}

export interface CreateMovimientoInput {
  tipo: string
  cantidad: number
  unidadMedida: string
  fecha: string
  descripcion?: string
  productoId: number
  loteId?: number
}

export interface UpdateMovimientoInput {
  tipo?: string
  cantidad?: number
  unidadMedida?: string
  fecha?: string
  descripcion?: string
  productoId?: number
  loteId?: number
}
