export interface Venta {
  id: number
  fecha: string
  cliente: string
  tipoProducto: string
  cantidad: number
  unidadMedida: string
  precioUnitario: number
  total: number
  descripcion?: string
  activo: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateVentaInput {
  fecha: string
  cliente: string
  tipoProducto: string
  cantidad: number
  unidadMedida: string
  precioUnitario: number
  descripcion?: string
}

export interface UpdateVentaInput {
  fecha?: string
  cliente?: string
  tipoProducto?: string
  cantidad?: number
  unidadMedida?: string
  precioUnitario?: number
  descripcion?: string
}
