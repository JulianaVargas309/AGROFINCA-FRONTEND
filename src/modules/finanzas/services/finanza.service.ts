import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { Gasto, CreateGastoInput, UpdateGastoInput, Venta, CreateVentaInput, FinanzasSummary } from "../types/finanza.types"

interface Finca { id: number; nombre: string }
interface Lote { id: number; nombre: string; fincaId: number }
interface Cultivo { id: number; nombre: string; loteId: number }
interface Cliente { id: number; nombre: string }
interface Producto { id: number; nombre: string; stockActual: number; precioUnitario?: number }

export const finanzaService = {
  async findAllGastos(): Promise<Gasto[]> {
    return apiGet<Gasto[]>(API_ENDPOINTS.GASTOS)
  },

  async findGastoById(id: number): Promise<Gasto> {
    return apiGet<Gasto>(`${API_ENDPOINTS.GASTOS}/${id}`)
  },

  async createGasto(data: CreateGastoInput): Promise<Gasto> {
    return apiPost<Gasto>(API_ENDPOINTS.GASTOS, data)
  },

  async updateGasto(id: number, data: UpdateGastoInput): Promise<Gasto> {
    return apiPut<Gasto>(`${API_ENDPOINTS.GASTOS}/${id}`, data)
  },

  async deleteGasto(id: number): Promise<void> {
    await apiDelete(`${API_ENDPOINTS.GASTOS}/${id}`)
  },

  async findAllVentas(): Promise<Venta[]> {
    return apiGet<Venta[]>(API_ENDPOINTS.VENTAS)
  },

  async findVentaById(id: number): Promise<Venta> {
    return apiGet<Venta>(`${API_ENDPOINTS.VENTAS}/${id}`)
  },

  async createVenta(data: CreateVentaInput): Promise<Venta> {
    return apiPost<Venta>(API_ENDPOINTS.VENTAS, data)
  },

  async updateVenta(id: number, estado: string): Promise<Venta> {
    return apiPatch<Venta>(`${API_ENDPOINTS.VENTAS}/${id}`, { estado })
  },

  async fetchFincas(): Promise<Finca[]> {
    return apiGet<Finca[]>(API_ENDPOINTS.FINCAS)
  },

  async fetchLotes(fincaId: number): Promise<Lote[]> {
    return apiGet<Lote[]>(`${API_ENDPOINTS.LOTES}?fincaId=${fincaId}`)
  },

  async fetchCultivos(loteId: number): Promise<Cultivo[]> {
    return apiGet<Cultivo[]>(`${API_ENDPOINTS.CULTIVOS}?loteId=${loteId}`)
  },

  async fetchClientes(): Promise<Cliente[]> {
    return apiGet<Cliente[]>(API_ENDPOINTS.CLIENTES)
  },

  async fetchProductos(): Promise<Producto[]> {
    return apiGet<Producto[]>(API_ENDPOINTS.PRODUCTOS)
  },

  async fetchSummary(): Promise<FinanzasSummary> {
    const [gastos, ventas] = await Promise.all([
      finanzaService.findAllGastos().catch(() => [] as Gasto[]),
      finanzaService.findAllVentas().catch(() => [] as Venta[]),
    ])

    const now = new Date()
    const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const gastosMes = gastos.filter((g) => g.fecha >= inicioMes).reduce((sum, g) => sum + g.monto, 0)
    const ventasValidas = ventas.filter((v) => v.estado !== "ANULADA")
    const ingresosMes = ventasValidas.filter((v) => v.fecha >= inicioMes).reduce((sum, v) => sum + v.total, 0)

    const gastosPorCategoria = gastos
      .filter((g) => g.fecha >= inicioMes)
      .reduce<Record<string, number>>((acc, g) => {
        const cat = g.categoria || "OTRO"
        acc[cat] = (acc[cat] || 0) + g.monto
        return acc
      }, {})

    return {
      ingresosMes,
      gastosMes,
      balance: ingresosMes - gastosMes,
      ventasPendientes: ventasValidas.filter((v) => v.estado === "PENDIENTE").length,
      ventasCompletadas: ventasValidas.filter((v) => v.estado === "COMPLETADA").length,
      gastosPorCategoria: Object.entries(gastosPorCategoria).map(([categoria, total]) => ({ categoria, total })),
    }
  },
}
