export interface HistorialLaboral {
  id: number
  tipo: string
  descripcion: string
  fecha: string
  observaciones?: string
  trabajadorId: number
  trabajador?: { id: number; nombre: string }
}

export interface CreateHistorialInput {
  tipo: string
  descripcion: string
  fecha?: string
  observaciones?: string
  trabajadorId: number
}
