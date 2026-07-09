import { apiGet, apiPost, apiPut, apiDelete } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { Trabajador, CreateTrabajadorInput, UpdateTrabajadorInput } from "../types/trabajador.types"
import type { PaginatedResponse } from "@/types"

export const trabajadorService = {
  async findAll(page?: number, limit?: number): Promise<Trabajador[] | PaginatedResponse<Trabajador>> {
    const params: Record<string, unknown> = {}
    if (page) params.page = page
    if (limit) params.limit = limit
    return apiGet<Trabajador[] | PaginatedResponse<Trabajador>>(API_ENDPOINTS.TRABAJADORES, { params })
  },

  async findById(id: number): Promise<Trabajador> {
    return apiGet<Trabajador>(`${API_ENDPOINTS.TRABAJADORES}/${id}`)
  },

  async create(data: CreateTrabajadorInput): Promise<Trabajador> {
    return apiPost<Trabajador>(API_ENDPOINTS.TRABAJADORES, data)
  },

  async update(id: number, data: UpdateTrabajadorInput): Promise<Trabajador> {
    return apiPut<Trabajador>(`${API_ENDPOINTS.TRABAJADORES}/${id}`, data)
  },

  async remove(id: number): Promise<Trabajador> {
    return apiDelete<Trabajador>(`${API_ENDPOINTS.TRABAJADORES}/${id}`)
  },
}
