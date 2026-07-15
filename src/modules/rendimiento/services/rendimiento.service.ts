import { apiGet, apiPost } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { RendimientoLote, RendimientoCultivo, CreateRendimientoLoteInput, CreateRendimientoCultivoInput } from "../types/rendimiento.types"
import type { PaginatedResponse } from "@/types"

export const rendimientoService = {
  async findAllLotes(page?: number, limit?: number): Promise<RendimientoLote[] | PaginatedResponse<RendimientoLote>> {
    const params: Record<string, unknown> = {}
    if (page) params.page = page
    if (limit) params.limit = limit
    return apiGet<RendimientoLote[] | PaginatedResponse<RendimientoLote>>(API_ENDPOINTS.RENDIMIENTO_LOTES, { params })
  },

  async findByIdLote(id: number): Promise<RendimientoLote> {
    return apiGet<RendimientoLote>(`${API_ENDPOINTS.RENDIMIENTO_LOTES}/${id}`)
  },

  async createLote(data: CreateRendimientoLoteInput): Promise<RendimientoLote> {
    return apiPost<RendimientoLote>(API_ENDPOINTS.RENDIMIENTO_LOTES, data)
  },

  async findAllCultivos(page?: number, limit?: number): Promise<RendimientoCultivo[] | PaginatedResponse<RendimientoCultivo>> {
    const params: Record<string, unknown> = {}
    if (page) params.page = page
    if (limit) params.limit = limit
    return apiGet<RendimientoCultivo[] | PaginatedResponse<RendimientoCultivo>>(API_ENDPOINTS.RENDIMIENTO_CULTIVOS, { params })
  },

  async findByIdCultivo(id: number): Promise<RendimientoCultivo> {
    return apiGet<RendimientoCultivo>(`${API_ENDPOINTS.RENDIMIENTO_CULTIVOS}/${id}`)
  },

  async createCultivo(data: CreateRendimientoCultivoInput): Promise<RendimientoCultivo> {
    return apiPost<RendimientoCultivo>(API_ENDPOINTS.RENDIMIENTO_CULTIVOS, data)
  },
}
