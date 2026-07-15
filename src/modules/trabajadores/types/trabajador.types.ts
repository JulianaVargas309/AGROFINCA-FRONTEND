export interface Trabajador {
  id: number
  nombre: string
  apellido?: string | null
  documento: string
  telefono?: string | null
  direccion?: string | null
  cargo: string
  fechaIngreso: string
  activo: boolean
  createdAt: string
  updatedAt: string
  correo?: string | null
  fechaNacimiento?: string | null
  eps?: string | null
  arl?: string | null
  salario?: number | null
  observaciones?: string | null
  foto?: string | null
}

export interface CreateTrabajadorInput {
  nombre: string
  apellido?: string
  documento: string
  telefono?: string
  direccion?: string
  cargo: string
  fechaIngreso: string
  correo?: string
  fechaNacimiento?: string
  eps?: string
  arl?: string
  salario?: number
  observaciones?: string
}

export interface UpdateTrabajadorInput {
  nombre?: string
  apellido?: string
  documento?: string
  telefono?: string
  direccion?: string
  cargo?: string
  fechaIngreso?: string
  activo?: boolean
  correo?: string
  fechaNacimiento?: string
  eps?: string
  arl?: string
  salario?: number
  observaciones?: string
}
