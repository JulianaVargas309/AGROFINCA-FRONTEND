import { apiGet, apiPost, apiPut, apiDelete } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { Finca, CreateFincaInput, UpdateFincaInput } from "../types/finca.types"
import type { PaginatedResponse } from "@/types"

export const fincaService = {
  async findAll(page?: number, limit?: number): Promise<Finca[] | PaginatedResponse<Finca>> {
    const params: Record<string, unknown> = {}
    if (page) params.page = page
    if (limit) params.limit = limit
    return apiGet<Finca[] | PaginatedResponse<Finca>>(API_ENDPOINTS.FINCAS, { params })
  },

  async findById(id: number): Promise<Finca> {
    const url = `${API_ENDPOINTS.FINCAS}/${id}`
    return apiGet<Finca>(url)
  },

  async create(data: CreateFincaInput): Promise<Finca> {
    return apiPost<Finca>(API_ENDPOINTS.FINCAS, data)
  },

  async update(id: number, data: UpdateFincaInput): Promise<Finca> {
    const url = `${API_ENDPOINTS.FINCAS}/${id}`
    return apiPut<Finca>(url, data)
  },

  async remove(id: number): Promise<Finca> {
    const url = `${API_ENDPOINTS.FINCAS}/${id}`
    return apiDelete<Finca>(url)
  },
}
