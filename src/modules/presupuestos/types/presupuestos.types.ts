export interface PresupuestoPartida {
  id: number
  concepto: string
  montoPrevisto: number
  montoEjecutado: number
  categoria?: string
}

export interface Presupuesto {
  id: number
  nombre: string
  descripcion?: string
  montoTotal: number
  montoEjecutado: number
  periodoInicio: string
  periodoFin: string
  estado: "BORRADOR" | "APROBADO" | "EJECUTANDO" | "CERRADO"
  fincaId?: number
  finca?: { id: number; nombre: string }
  partidas: PresupuestoPartida[]
  createdAt: string
}

export interface CreatePresupuestoInput {
  nombre: string
  descripcion?: string
  periodoInicio: string
  periodoFin: string
  fincaId?: number
  partidas: { concepto: string; montoPrevisto: number; categoria?: string }[]
}
