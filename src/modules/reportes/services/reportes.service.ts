import { apiGet } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type {
  ReporteInventario,
  ReporteFinanciero,
  ReporteProduccion,
  ReporteCostos,
  ReporteBitacora,
  ReportType,
} from "../types/reporte.types"

interface Finca { id: number; nombre: string }
interface Lote { id: number; nombre: string; fincaId: number }
interface Producto { id: number; nombre: string; categoria?: string; stockActual: number; stockMinimo: number; unidadMedida: string; precioUnitario?: number }
interface Gasto { id: number; monto: number; fecha: string; categoria?: string; cultivoId?: number; loteId?: number; lote?: { id: number; nombre: string }; finca?: { id: number; nombre: string } }
interface Venta { id: number; total: number; fecha: string; estado: string }
interface Cultivo { id: number; nombre: string; tipo: string; estado: string; fechaSiembra: string; rendimientoEstimado?: number; lote?: { id: number; nombre: string; finca?: { id: number; nombre: string } } }
interface BitacoraEntry { id: number; actividad: string; descripcion: string; fecha: string; costo: number; lote?: { id: number; nombre: string }; cultivo?: { id: number; nombre: string }; user?: { id: number; nombre: string } }
interface JornalEntry { id: number; montoPagado?: number; lote?: { id: number; nombre: string } }

export const reportesService = {
  async generateReport(type: ReportType): Promise<ReporteInventario | ReporteFinanciero | ReporteProduccion | ReporteCostos | ReporteBitacora> {
    switch (type) {
      case "inventario": return generateInventario()
      case "financiero": return generateFinanciero()
      case "produccion": return generateProduccion()
      case "costos": return generateCostos()
      case "bitacora": return generateBitacora()
    }
  },
}

async function generateInventario(): Promise<ReporteInventario> {
  const productos = await apiGet<Producto[]>(API_ENDPOINTS.PRODUCTOS).catch(() => [] as Producto[])
  const items = productos.map((p) => ({
    nombre: p.nombre,
    categoria: p.categoria || "Sin categoría",
    stockActual: p.stockActual,
    stockMinimo: p.stockMinimo,
    unidadMedida: p.unidadMedida,
    precioUnitario: p.precioUnitario,
    valorTotal: (p.precioUnitario || 0) * p.stockActual,
  }))
  return {
    productos: items,
    totalProductos: items.length,
    valorInventario: items.reduce((s, i) => s + i.valorTotal, 0),
    stockBajo: items.filter((i) => i.stockActual <= i.stockMinimo).length,
  }
}

async function generateFinanciero(): Promise<ReporteFinanciero> {
  const [gastos, ventas] = await Promise.all([
    apiGet<Gasto[]>(API_ENDPOINTS.GASTOS).catch(() => [] as Gasto[]),
    apiGet<Venta[]>(API_ENDPOINTS.VENTAS).catch(() => [] as Venta[]),
  ])

  const months = getLastMonths(6)
  const ventasValidas = ventas.filter((v) => v.estado !== "ANULADA")

  const ingresos = months.map(([label, desde, hasta]) => ({
    mes: label,
    total: ventasValidas.filter((v) => v.fecha >= desde && v.fecha < hasta).reduce((s, v) => s + v.total, 0),
  }))
  const gastosMensuales = months.map(([label, desde, hasta]) => ({
    mes: label,
    total: gastos.filter((g) => g.fecha >= desde && g.fecha < hasta).reduce((s, g) => s + g.monto, 0),
  }))

  return {
    ingresos,
    gastos: gastosMensuales,
    totalIngresos: ingresos.reduce((s, i) => s + i.total, 0),
    totalGastos: gastosMensuales.reduce((s, g) => s + g.total, 0),
    balance: 0,
  }
}

function getLastMonths(count: number): [string, string, string][] {
  const months: [string, string, string][] = []
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const label = d.toLocaleString("es-CO", { month: "long", year: "numeric" })
    const desde = new Date(d.getFullYear(), d.getMonth(), 1).toISOString()
    const hasta = new Date(d.getFullYear(), d.getMonth() + 1, 1).toISOString()
    months.push([label, desde, hasta])
  }
  return months
}

async function generateProduccion(): Promise<ReporteProduccion> {
  const fincas = await apiGet<Finca[]>(API_ENDPOINTS.FINCAS).catch(() => [] as Finca[])

  const lotesPromises = fincas.map((f) =>
    apiGet<Lote[]>(`${API_ENDPOINTS.LOTES}?fincaId=${f.id}`).catch(() => [] as Lote[]),
  )
  const lotes = (await Promise.all(lotesPromises)).flat()
  const cultivosPromises = lotes.map((l) =>
    apiGet<Cultivo[]>(`${API_ENDPOINTS.CULTIVOS}?loteId=${l.id}`).catch(() => [] as Cultivo[]),
  )
  const cultivosRaw = (await Promise.all(cultivosPromises)).flat()
  const gastos = await apiGet<Gasto[]>(API_ENDPOINTS.GASTOS).catch(() => [] as Gasto[])

  const cultivos = cultivosRaw.map((c) => {
    const lote = lotes.find((l) => l.id === c.lote?.id)
    const finca = fincas.find((f) => lotes.some((l) => l.id === lote?.id && f.id === l.fincaId))
    const gastosAsociados = gastos.filter((g) => g.cultivoId === c.id || g.loteId === lote?.id).reduce((s, g) => s + g.monto, 0)
    return {
      nombre: c.nombre,
      tipo: c.tipo,
      lote: lote?.nombre || "Sin lote",
      finca: finca?.nombre || "Sin finca",
      estado: c.estado,
      fechaSiembra: c.fechaSiembra,
      rendimientoEstimado: c.rendimientoEstimado,
      gastosAsociados,
    }
  })

  return {
    cultivos,
    totalCultivos: cultivos.length,
    activos: cultivos.filter((c) => c.estado === "ACTIVO").length,
    cosechados: cultivos.filter((c) => c.estado === "COSECHADO").length,
  }
}

async function generateCostos(): Promise<ReporteCostos> {
  const fincas = await apiGet<Finca[]>(API_ENDPOINTS.FINCAS).catch(() => [] as Finca[])
  const lotesPromises = fincas.map((f) =>
    apiGet<Lote[]>(`${API_ENDPOINTS.LOTES}?fincaId=${f.id}`).catch(() => [] as Lote[]),
  )
  const lotes = (await Promise.all(lotesPromises)).flat()

  const lotesData = await Promise.all(
    lotes.map(async (l) => {
      const [bitacoras, jornales] = await Promise.all([
        apiGet<BitacoraEntry[]>(`${API_ENDPOINTS.BITACORA}?loteId=${l.id}`).catch(() => [] as BitacoraEntry[]),
        apiGet<JornalEntry[]>(`${API_ENDPOINTS.JORNALES}?loteId=${l.id}`).catch(() => [] as JornalEntry[]),
      ])
      const costoBitacora = bitacoras.reduce((s, b) => s + (b.costo || 0), 0)
      const costoJornales = jornales.reduce((s, j) => s + (j.montoPagado || 0), 0)
      const finca = fincas.find((f) => f.id === l.fincaId)
      return {
        lote: l.nombre,
        finca: finca?.nombre || "",
        costoBitacora,
        costoJornales,
        costoTotal: costoBitacora + costoJornales,
        actividades: bitacoras.length + jornales.length,
      }
    }),
  )

  return { lotes: lotesData }
}

async function generateBitacora(): Promise<ReporteBitacora> {
  const registros = await apiGet<BitacoraEntry[]>(API_ENDPOINTS.BITACORA).catch(() => [] as BitacoraEntry[])
  const items = registros.map((r) => ({
    actividad: r.actividad,
    descripcion: r.descripcion,
    fecha: r.fecha,
    lote: r.lote?.nombre || "",
    cultivo: r.cultivo?.nombre,
    costo: r.costo || 0,
    usuario: r.user?.nombre || "",
  }))

  return {
    registros: items,
    totalRegistros: items.length,
    costoTotal: items.reduce((s, i) => s + i.costo, 0),
  }
}
