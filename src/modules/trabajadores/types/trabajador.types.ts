export interface Trabajador {
  id: number
  nombre: string
  documento: string
  telefono?: string
  direccion?: string
  cargo: string
  fechaIngreso: string
  activo: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateTrabajadorInput {
  nombre: string
  documento: string
  telefono?: string
  direccion?: string
  cargo: string
  fechaIngreso: string
}

export interface UpdateTrabajadorInput {
  nombre?: string
  documento?: string
  telefono?: string
  direccion?: string
  cargo?: string
  fechaIngreso?: string
  activo?: boolean
}
