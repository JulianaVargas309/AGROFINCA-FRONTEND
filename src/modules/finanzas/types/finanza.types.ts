export interface Gasto {
  id: number
  descripcion: string
  monto: number
  categoria?: string
  fecha: string
  proveedorId?: number
  cultivoId?: number
  fincaId?: number
  loteId?: number
  proveedor?: { id: number; nombre: string }
  cultivo?: { id: number; nombre: string }
  finca?: { id: number; nombre: string }
  lote?: { id: number; nombre: string }
}

export interface CreateGastoInput {
  descripcion: string
  monto: number
  categoria?: string
  fecha?: string
  proveedorId?: number
  cultivoId?: number
  fincaId?: number
  loteId?: number
}

export interface UpdateGastoInput {
  descripcion?: string
  monto?: number
  categoria?: string
  fecha?: string
  proveedorId?: number | null
  cultivoId?: number | null
  fincaId?: number | null
  loteId?: number | null
}

export interface DetalleVenta {
  productoId: number
  cantidad: number
  precioUnitario: number
  subtotal: number
  producto?: { id: number; nombre: string }
}

export interface Venta {
  id: number
  fecha: string
  total: number
  estado: string
  clienteId: number
  cliente?: { id: number; nombre: string }
  detalles?: DetalleVenta[]
}

export interface CreateVentaInput {
  clienteId: number
  detalles: { productoId: number; cantidad: number; precioUnitario: number }[]
}

export interface UpdateVentaInput {
  estado: string
}

export interface FinanzasSummary {
  ingresosMes: number
  gastosMes: number
  balance: number
  ventasPendientes: number
  ventasCompletadas: number
  gastosPorCategoria: { categoria: string; total: number }[]
}
