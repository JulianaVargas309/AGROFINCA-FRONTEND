export interface Gasto {
  id: number
  fecha: string
  categoria: string
  descripcion: string
  monto: number
  proveedor?: string
  comprobante?: string
  loteId?: number
  activo: boolean
  createdAt: string
  updatedAt: string
  lote?: { id: number; nombre: string }
}

export interface CreateGastoInput {
  fecha: string
  categoria: string
  descripcion: string
  monto: number
  proveedor?: string
  comprobante?: string
  loteId?: number
}

export interface UpdateGastoInput {
  fecha?: string
  categoria?: string
  descripcion?: string
  monto?: number
  proveedor?: string
  comprobante?: string
  loteId?: number
}
