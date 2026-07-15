import { apiGet, apiPost, apiPut } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { Caja, MovimientoCaja, CreateMovimientoInput } from "../types/caja.types"
import type { PaginatedResponse } from "@/types"

export const cajaService = {
  async findAllCajas(): Promise<Caja[]> {
    const result = await apiGet<Caja[] | PaginatedResponse<Caja>>(API_ENDPOINTS.CAJA)
    return Array.isArray(result) ? result : result.data
  },

  async findCajaById(id: number): Promise<Caja> {
    return apiGet<Caja>(`${API_ENDPOINTS.CAJA}/${id}`)
  },

  async createCaja(data: { nombre: string; descripcion?: string }): Promise<Caja> {
    return apiPost<Caja>(API_ENDPOINTS.CAJA, data)
  },

  async updateCaja(id: number, data: Partial<Caja>): Promise<Caja> {
    return apiPut<Caja>(`${API_ENDPOINTS.CAJA}/${id}`, data)
  },

  async findAllMovimientos(cajaId?: number, page?: number, limit?: number): Promise<MovimientoCaja[] | PaginatedResponse<MovimientoCaja>> {
    const params: Record<string, unknown> = {}
    if (cajaId) params.cajaId = cajaId
    if (page) params.page = page
    if (limit) params.limit = limit
    return apiGet<MovimientoCaja[] | PaginatedResponse<MovimientoCaja>>(API_ENDPOINTS.MOVIMIENTOS_CAJA, { params })
  },

  async createMovimiento(data: CreateMovimientoInput): Promise<MovimientoCaja> {
    return apiPost<MovimientoCaja>(API_ENDPOINTS.MOVIMIENTOS_CAJA, data)
  },

  async getSaldo(cajaId: number): Promise<{ saldo: number }> {
    return apiGet<{ saldo: number }>(`${API_ENDPOINTS.CAJA}/${cajaId}/saldo`)
  },
}
