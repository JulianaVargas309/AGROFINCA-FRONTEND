export interface ReporteInventario {
  productos: {
    nombre: string
    categoria: string
    stockActual: number
    stockMinimo: number
    unidadMedida: string
    precioUnitario?: number
    valorTotal: number
  }[]
  totalProductos: number
  valorInventario: number
  stockBajo: number
}

export interface ReporteFinanciero {
  ingresos: { mes: string; total: number }[]
  gastos: { mes: string; total: number }[]
  totalIngresos: number
  totalGastos: number
  balance: number
}

export interface ReporteProduccion {
  cultivos: {
    nombre: string
    tipo: string
    lote: string
    finca: string
    estado: string
    fechaSiembra: string
    rendimientoEstimado?: number
    gastosAsociados: number
  }[]
  totalCultivos: number
  activos: number
  cosechados: number
}

export interface ReporteCostos {
  lotes: {
    lote: string
    finca: string
    costoBitacora: number
    costoJornales: number
    costoTotal: number
    actividades: number
  }[]
}

export interface ReporteBitacora {
  registros: {
    actividad: string
    descripcion: string
    fecha: string
    lote: string
    cultivo?: string
    costo: number
    usuario: string
  }[]
  totalRegistros: number
  costoTotal: number
}

export type ReportType = "inventario" | "financiero" | "produccion" | "costos" | "bitacora"

export const REPORT_TYPES: { value: ReportType; label: string; description: string }[] = [
  { value: "inventario", label: "Inventario", description: "Productos, stock y valor del inventario" },
  { value: "financiero", label: "Financiero", description: "Ingresos y gastos mensuales" },
  { value: "produccion", label: "Producción", description: "Cultivos por estado y rendimiento" },
  { value: "costos", label: "Costos por Lote", description: "Costos acumulados de bitácora y jornales" },
  { value: "bitacora", label: "Bitácora", description: "Registro completo de actividades" },
]
