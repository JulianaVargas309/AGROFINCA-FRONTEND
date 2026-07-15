export interface Permiso {
  id: number
  nombre: string
  descripcion?: string | null
  modulo?: string | null
  activo: boolean
}

export interface CreatePermisoInput {
  nombre: string
  descripcion?: string
  modulo?: string
}

export type UpdatePermisoInput = Partial<CreatePermisoInput>
