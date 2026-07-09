import { apiGet, apiPost, apiPut, apiDelete } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { Gasto, CreateGastoInput, UpdateGastoInput } from "../types/gasto.types"
import type { PaginatedResponse } from "@/types"

export const gastoService = {
  async findAll(page?: number, limit?: number): Promise<Gasto[] | PaginatedResponse<Gasto>> {
    const params: Record<string, unknown> = {}
    if (page) params.page = page
    if (limit) params.limit = limit
    return apiGet<Gasto[] | PaginatedResponse<Gasto>>(API_ENDPOINTS.GASTOS, { params })
  },

  async findById(id: number): Promise<Gasto> {
    return apiGet<Gasto>(`${API_ENDPOINTS.GASTOS}/${id}`)
  },

  async create(data: CreateGastoInput): Promise<Gasto> {
    return apiPost<Gasto>(API_ENDPOINTS.GASTOS, data)
  },

  async update(id: number, data: UpdateGastoInput): Promise<Gasto> {
    return apiPut<Gasto>(`${API_ENDPOINTS.GASTOS}/${id}`, data)
  },

  async remove(id: number): Promise<Gasto> {
    return apiDelete<Gasto>(`${API_ENDPOINTS.GASTOS}/${id}`)
  },
}
