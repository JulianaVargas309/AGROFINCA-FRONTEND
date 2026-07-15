export interface Jornal {
  id: number
  fecha: string
  tipoPago: "DIA" | "KILO"
  valorDia?: number | null
  cantidadDias?: number | null
  cantidadKg?: number | null
  valorKilo?: number | null
  total: number
  descripcion?: string | null
  trabajadorId: number
  loteId?: number | null
  activo: boolean
  createdAt: string
  updatedAt: string
  trabajador?: { id: number; nombre: string }
  lote?: { id: number; nombre: string }
}

export interface CreateJornalInput {
  fecha: string
  tipoPago: "DIA" | "KILO"
  valorDia?: number
  cantidadDias?: number
  cantidadKg?: number
  valorKilo?: number
  total: number
  descripcion?: string
  trabajadorId: number
  loteId?: number
}

export interface UpdateJornalInput {
  fecha?: string
  tipoPago?: "DIA" | "KILO"
  valorDia?: number
  cantidadDias?: number
  cantidadKg?: number
  valorKilo?: number
  total?: number
  descripcion?: string
  trabajadorId?: number
  loteId?: number
}
