export interface Caja {
  id: number
  nombre: string
  saldoActual: number
  descripcion?: string
  activo: boolean
}

export interface MovimientoCaja {
  id: number
  tipo: "INGRESO" | "EGRESO" | "TRASLADO"
  monto: number
  concepto: string
  referencia?: string
  fecha: string
  cajaId: number
  userId: number
  caja?: { id: number; nombre: string }
  user?: { id: number; nombre: string }
}

export interface CreateMovimientoInput {
  tipo: "INGRESO" | "EGRESO" | "TRASLADO"
  monto: number
  concepto: string
  referencia?: string
  cajaId: number
}
