import { apiGet, apiPost } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { HistorialLaboral, CreateHistorialInput } from "../types/historial-laboral.types"
import type { PaginatedResponse } from "@/types"

export const historialLaboralService = {
  async findAll(trabajadorId?: number, page?: number, limit?: number): Promise<HistorialLaboral[] | PaginatedResponse<HistorialLaboral>> {
    const params: Record<string, unknown> = {}
    if (trabajadorId) params.trabajadorId = trabajadorId
    if (page) params.page = page
    if (limit) params.limit = limit
    return apiGet<HistorialLaboral[] | PaginatedResponse<HistorialLaboral>>(API_ENDPOINTS.HISTORIAL_LABORAL, { params })
  },

  async findById(id: number): Promise<HistorialLaboral> {
    return apiGet<HistorialLaboral>(`${API_ENDPOINTS.HISTORIAL_LABORAL}/${id}`)
  },

  async create(data: CreateHistorialInput): Promise<HistorialLaboral> {
    return apiPost<HistorialLaboral>(API_ENDPOINTS.HISTORIAL_LABORAL, data)
  },
}
