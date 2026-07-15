export interface Compra {
  id: number
  numeroFactura?: string
  fecha: string
  total: number
  estado: string
  proveedorId?: number
  proveedor?: { id: number; nombre: string }
  detalles?: DetalleCompra[]
  observaciones?: string
  createdAt: string
}

export interface DetalleCompra {
  id: number
  cantidad: number
  precioUnitario: number
  subtotal: number
  productoId: number
  producto?: { id: number; nombre: string }
}

export interface CreateCompraInput {
  numeroFactura?: string
  fecha?: string
  proveedorId?: number
  detalles: { productoId: number; cantidad: number; precioUnitario: number }[]
  observaciones?: string
}

export interface UpdateEstadoCompraInput {
  estado: string
}
