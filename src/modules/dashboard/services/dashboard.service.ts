import { apiGet } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type {
  DashboardData,
  DashboardStats,
  ActividadReciente,
  ProductoStockBajo,
  VentasResumen,
  UltimoMovimiento,
} from "../types/dashboard.types"

interface Finca {
  id: number
  nombre: string
  hectareas?: number
}

interface Lote {
  id: number
  nombre: string
  area?: number
}

interface Producto {
  id: number
  nombre: string
  stockActual: number
  stockMinimo: number
  unidadMedida: string
}

interface Gasto {
  id: number
  monto: number
  fecha: string
  categoria?: string
}

interface Venta {
  id: number
  total: number
  fecha: string
  estado: string
}

interface Bitacora {
  id: number
  actividad: string
  descripcion: string
  fecha: string
  lote?: { id: number; nombre: string }
  user?: { id: number; nombre: string }
}

interface Cultivo {
  id: number
  nombre: string
  tipo: string
  areaSembrada?: number
  estado: string
}

interface Movimiento {
  id: number
  tipo: string
  cantidad: number
  unidadMedida: string
  fecha: string
  producto?: { id: number; nombre: string }
}

export const dashboardService = {
  async fetchDashboardData(): Promise<DashboardData> {
    const [fincas, productos, gastos, ventas, bitacora, cultivos, movimientos] = await Promise.all([
      apiGet<Finca[]>(API_ENDPOINTS.FINCAS),
      apiGet<Producto[]>(API_ENDPOINTS.PRODUCTOS),
      apiGet<Gasto[]>(API_ENDPOINTS.GASTOS),
      apiGet<Venta[]>(API_ENDPOINTS.VENTAS),
      apiGet<Bitacora[]>(`${API_ENDPOINTS.BITACORA}?limit=10`),
      apiGet<Cultivo[]>(API_ENDPOINTS.CULTIVOS).catch(() => [] as Cultivo[]),
      apiGet<Movimiento[]>(`${API_ENDPOINTS.MOVIMIENTOS}?limit=10`).catch(() => [] as Movimiento[]),
    ])

    const lotesPromises = fincas.map((finca) =>
      apiGet<Lote[]>(`${API_ENDPOINTS.LOTES}?fincaId=${finca.id}`).catch(() => [] as Lote[]),
    )
    const lotesPorFinca = await Promise.all(lotesPromises)
    const totalLotes = lotesPorFinca.reduce((sum, lotes) => sum + lotes.length, 0)

    const totalAreaSembrada = lotesPorFinca
      .flat()
      .reduce((sum, lote) => sum + (lote.area || 0), 0)

    const now = new Date()
    const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const inicioAnio = new Date(now.getFullYear(), 0, 1).toISOString()

    const gastosMes = gastos
      .filter((g) => g.fecha >= inicioMes)
      .reduce((sum, g) => sum + g.monto, 0)

    const gastosAnio = gastos
      .filter((g) => g.fecha >= inicioAnio)
      .reduce((sum, g) => sum + g.monto, 0)

    const gastosPorCategoria = gastos
      .filter((g) => g.fecha >= inicioMes)
      .reduce<Record<string, number>>((acc, g) => {
        const cat = g.categoria || "OTRO"
        acc[cat] = (acc[cat] || 0) + g.monto
        return acc
      }, {})

    const ventasActivas = ventas.filter((v) => v.estado !== "ANULADA")
    const ingresosMes = ventasActivas
      .filter((v) => v.fecha >= inicioMes)
      .reduce((sum, v) => sum + v.total, 0)

    const ingresosAnio = ventasActivas
      .filter((v) => v.fecha >= inicioAnio)
      .reduce((sum, v) => sum + v.total, 0)

    const cultivosActivos = cultivos.filter((c) => c.estado === "ACTIVO" || c.estado === "CRECIMIENTO").length
    const produccionCafe = cultivos
      .filter((c) => c.tipo === "CAFE" && c.estado === "COSECHA")
      .reduce((sum, c) => sum + (c.areaSembrada || 0), 0)
    const produccionCania = cultivos
      .filter((c) => c.tipo === "CAÑA" && c.estado === "COSECHA")
      .reduce((sum, c) => sum + (c.areaSembrada || 0), 0)

    const inversionTotal = gastosAnio
    const roi = inversionTotal > 0 ? Math.round(((ingresosAnio - inversionTotal) / inversionTotal) * 100) : 0

    const stats: DashboardStats = {
      totalFincas: fincas.length,
      totalLotes,
      totalProductos: productos.length,
      gastosMes,
      ingresosMes,
      balance: ingresosMes - gastosMes,
      totalAreaSembrada,
      produccionCafe,
      produccionCania,
      roi,
      cultivosActivos,
    }

    const stockBajo: ProductoStockBajo[] = productos
      .filter((p) => p.stockActual <= p.stockMinimo)
      .map((p) => ({
        id: p.id,
        nombre: p.nombre,
        stockActual: p.stockActual,
        stockMinimo: p.stockMinimo,
        unidadMedida: p.unidadMedida,
      }))

    const actividadesRecientes: ActividadReciente[] = bitacora
      .slice(0, 5)
      .map((entry) => ({
        id: entry.id,
        actividad: entry.actividad,
        descripcion: entry.descripcion || entry.actividad,
        fecha: entry.fecha,
        lote: entry.lote?.nombre,
        usuario: entry.user?.nombre,
      }))

    const ultimosMovimientos: UltimoMovimiento[] = movimientos
      .slice(0, 5)
      .map((m) => ({
        id: m.id,
        tipo: m.tipo,
        cantidad: m.cantidad,
        unidadMedida: m.unidadMedida,
        fecha: m.fecha,
        producto: m.producto,
      }))

    const ventasResumen: VentasResumen = {
      total: ventasActivas.length,
      completadas: ventasActivas.filter((v) => v.estado === "COMPLETADA").length,
    }

    return {
      stats,
      actividadesRecientes,
      stockBajo,
      ventasResumen,
      gastosPorCategoria: Object.entries(gastosPorCategoria).map(([categoria, total]) => ({
        categoria,
        total,
      })),
      ultimosMovimientos,
    }
  },
}
