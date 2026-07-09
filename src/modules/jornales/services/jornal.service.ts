import { apiGet, apiPost, apiPut, apiDelete } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { Jornal, CreateJornalInput, UpdateJornalInput } from "../types/jornal.types"
import type { PaginatedResponse } from "@/types"

export const jornalService = {
  async findAll(page?: number, limit?: number): Promise<Jornal[] | PaginatedResponse<Jornal>> {
    const params: Record<string, unknown> = {}
    if (page) params.page = page
    if (limit) params.limit = limit
    return apiGet<Jornal[] | PaginatedResponse<Jornal>>(API_ENDPOINTS.JORNALES, { params })
  },

  async findById(id: number): Promise<Jornal> {
    return apiGet<Jornal>(`${API_ENDPOINTS.JORNALES}/${id}`)
  },

  async create(data: CreateJornalInput): Promise<Jornal> {
    return apiPost<Jornal>(API_ENDPOINTS.JORNALES, data)
  },

  async update(id: number, data: UpdateJornalInput): Promise<Jornal> {
    return apiPut<Jornal>(`${API_ENDPOINTS.JORNALES}/${id}`, data)
  },

  async remove(id: number): Promise<Jornal> {
    return apiDelete<Jornal>(`${API_ENDPOINTS.JORNALES}/${id}`)
  },
}
