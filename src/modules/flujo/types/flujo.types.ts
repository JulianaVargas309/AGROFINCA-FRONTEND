export interface FlujoEfectivo {
  id: number
  tipo: string
  categoria?: string
  monto: number
  descripcion?: string
  fecha: string
}

export interface ResumenFlujo {
  ingresos: number
  egresos: number
  balance: number
  porCategoria: { categoria: string; total: number }[]
}
