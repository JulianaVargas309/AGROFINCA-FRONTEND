export interface Cultivo {
  id: number
  nombre: string
  tipo: string
  variedad?: string
  fechaSiembra?: string
  areaSembrada?: number
  estado: string
  loteId: number
  fincaId: number
  activo: boolean
  createdAt: string
  updatedAt: string
  lote?: { id: number; nombre: string }
  finca?: { id: number; nombre: string }
}

export interface CreateCultivoInput {
  nombre: string
  tipo: string
  variedad?: string
  fechaSiembra?: string
  areaSembrada?: number
  estado: string
  loteId: number
  fincaId: number
}

export interface UpdateCultivoInput {
  nombre?: string
  tipo?: string
  variedad?: string
  fechaSiembra?: string
  areaSembrada?: number
  estado?: string
  loteId?: number
  fincaId?: number
}
