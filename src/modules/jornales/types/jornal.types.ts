export interface Jornal {
  id: number
  fecha: string
  horas: number
  valorHora: number
  total: number
  descripcion?: string
  trabajadorId: number
  loteId?: number
  activo: boolean
  createdAt: string
  updatedAt: string
  trabajador?: { id: number; nombre: string }
  lote?: { id: number; nombre: string }
}

export interface CreateJornalInput {
  fecha: string
  horas: number
  valorHora: number
  descripcion?: string
  trabajadorId: number
  loteId?: number
}

export interface UpdateJornalInput {
  fecha?: string
  horas?: number
  valorHora?: number
  descripcion?: string
  trabajadorId?: number
  loteId?: number
}
