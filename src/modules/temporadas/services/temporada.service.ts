import { apiGet, apiPost, apiPut, apiDelete } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { Temporada, CreateTemporadaInput, UpdateTemporadaInput } from "../types/temporada.types"
import type { PaginatedResponse } from "@/types"

export const temporadaService = {
  async findAll(page?: number, limit?: number): Promise<Temporada[] | PaginatedResponse<Temporada>> {
    const params: Record<string, unknown> = {}
    if (page) params.page = page
    if (limit) params.limit = limit
    return apiGet<Temporada[] | PaginatedResponse<Temporada>>(API_ENDPOINTS.TEMPORADAS, { params })
  },

  async findById(id: number): Promise<Temporada> {
    return apiGet<Temporada>(`${API_ENDPOINTS.TEMPORADAS}/${id}`)
  },

  async create(data: CreateTemporadaInput): Promise<Temporada> {
    return apiPost<Temporada>(API_ENDPOINTS.TEMPORADAS, data)
  },

  async update(id: number, data: UpdateTemporadaInput): Promise<Temporada> {
    return apiPut<Temporada>(`${API_ENDPOINTS.TEMPORADAS}/${id}`, data)
  },

  async remove(id: number): Promise<Temporada> {
    return apiDelete<Temporada>(`${API_ENDPOINTS.TEMPORADAS}/${id}`)
  },
}
