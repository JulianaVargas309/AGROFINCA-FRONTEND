export interface Producto {
  id: number
  nombre: string
  descripcion?: string
  categoria?: string
  unidadMedida: string
  stockActual: number
  stockMinimo: number
  precioUnitario?: number
  activo: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateProductoInput {
  nombre: string
  descripcion?: string
  categoria?: string
  unidadMedida?: string
  stockActual?: number
  stockMinimo?: number
  precioUnitario?: number
}

export interface UpdateProductoInput {
  nombre?: string
  descripcion?: string
  categoria?: string
  unidadMedida?: string
  stockActual?: number
  stockMinimo?: number
  precioUnitario?: number
  activo?: boolean
}

export interface MovimientoInventario {
  id: number
  tipo: "entrada" | "salida"
  cantidad: number
  motivo?: string
  fecha: string
  productoId: number
  producto?: { id: number; nombre: string }
  user?: { id: number; nombre: string }
}

export interface CreateMovimientoInput {
  tipo: "entrada" | "salida"
  cantidad: number
  motivo?: string
  productoId: number
}
