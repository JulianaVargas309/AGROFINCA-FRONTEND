import { apiGet, apiPost } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { Ajuste, CreateAjusteInput } from "../types/ajustes.types"
import type { PaginatedResponse } from "@/types"

export const ajusteService = {
  async findAll(productoId?: number, page?: number, limit?: number): Promise<Ajuste[] | PaginatedResponse<Ajuste>> {
    const params: Record<string, unknown> = {}
    if (productoId) params.productoId = productoId
    if (page) params.page = page
    if (limit) params.limit = limit
    return apiGet<Ajuste[] | PaginatedResponse<Ajuste>>(API_ENDPOINTS.AJUSTES, { params })
  },

  async create(data: CreateAjusteInput): Promise<Ajuste> {
    return apiPost<Ajuste>(API_ENDPOINTS.AJUSTES, data)
  },
}
