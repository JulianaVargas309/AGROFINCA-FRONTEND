import { apiGet, apiPost, apiPut, apiDelete } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { Produccion, CreateProduccionInput, UpdateProduccionInput } from "../types/produccion.types"
import type { PaginatedResponse } from "@/types"

export const produccionService = {
  async findAll(page?: number, limit?: number, filters?: Record<string, unknown>): Promise<Produccion[] | PaginatedResponse<Produccion>> {
    const params: Record<string, unknown> = {}
    if (page) params.page = page
    if (limit) params.limit = limit
    if (filters) Object.assign(params, filters)
    return apiGet<Produccion[] | PaginatedResponse<Produccion>>(API_ENDPOINTS.PRODUCCION, { params })
  },

  async findById(id: number): Promise<Produccion> {
    return apiGet<Produccion>(`${API_ENDPOINTS.PRODUCCION}/${id}`)
  },

  async create(data: CreateProduccionInput): Promise<Produccion> {
    return apiPost<Produccion>(API_ENDPOINTS.PRODUCCION, data)
  },

  async update(id: number, data: UpdateProduccionInput): Promise<Produccion> {
    return apiPut<Produccion>(`${API_ENDPOINTS.PRODUCCION}/${id}`, data)
  },

  async remove(id: number): Promise<Produccion> {
    return apiDelete<Produccion>(`${API_ENDPOINTS.PRODUCCION}/${id}`)
  },
}
