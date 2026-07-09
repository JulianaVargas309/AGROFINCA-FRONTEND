import { apiGet, apiPost, apiPut, apiDelete } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { Cultivo, CreateCultivoInput, UpdateCultivoInput } from "../types/cultivo.types"
import type { PaginatedResponse } from "@/types"

export const cultivoService = {
  async findAll(page?: number, limit?: number): Promise<Cultivo[] | PaginatedResponse<Cultivo>> {
    const params: Record<string, unknown> = {}
    if (page) params.page = page
    if (limit) params.limit = limit
    return apiGet<Cultivo[] | PaginatedResponse<Cultivo>>(API_ENDPOINTS.CULTIVOS, { params })
  },

  async findById(id: number): Promise<Cultivo> {
    return apiGet<Cultivo>(`${API_ENDPOINTS.CULTIVOS}/${id}`)
  },

  async create(data: CreateCultivoInput): Promise<Cultivo> {
    return apiPost<Cultivo>(API_ENDPOINTS.CULTIVOS, data)
  },

  async update(id: number, data: UpdateCultivoInput): Promise<Cultivo> {
    return apiPut<Cultivo>(`${API_ENDPOINTS.CULTIVOS}/${id}`, data)
  },

  async remove(id: number): Promise<Cultivo> {
    return apiDelete<Cultivo>(`${API_ENDPOINTS.CULTIVOS}/${id}`)
  },
}
