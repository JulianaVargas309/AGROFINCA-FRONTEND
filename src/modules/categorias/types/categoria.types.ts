export interface CategoriaProducto {
  id: number
  nombre: string
  descripcion?: string
  activo: boolean
}

export interface CreateCategoriaInput {
  nombre: string
  descripcion?: string
}

export interface UpdateCategoriaInput {
  nombre?: string
  descripcion?: string
  activo?: boolean
}
