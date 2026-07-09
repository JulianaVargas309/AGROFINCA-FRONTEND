import { apiGet, apiPost, apiPut, apiDelete } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { Movimiento, CreateMovimientoInput, UpdateMovimientoInput } from "../types/movimiento.types"
import type { PaginatedResponse } from "@/types"

export const movimientoService = {
  async findAll(page?: number, limit?: number): Promise<Movimiento[] | PaginatedResponse<Movimiento>> {
    const params: Record<string, unknown> = {}
    if (page) params.page = page
    if (limit) params.limit = limit
    return apiGet<Movimiento[] | PaginatedResponse<Movimiento>>(API_ENDPOINTS.MOVIMIENTOS, { params })
  },

  async findById(id: number): Promise<Movimiento> {
    return apiGet<Movimiento>(`${API_ENDPOINTS.MOVIMIENTOS}/${id}`)
  },

  async create(data: CreateMovimientoInput): Promise<Movimiento> {
    return apiPost<Movimiento>(API_ENDPOINTS.MOVIMIENTOS, data)
  },

  async update(id: number, data: UpdateMovimientoInput): Promise<Movimiento> {
    return apiPut<Movimiento>(`${API_ENDPOINTS.MOVIMIENTOS}/${id}`, data)
  },

  async remove(id: number): Promise<Movimiento> {
    return apiDelete<Movimiento>(`${API_ENDPOINTS.MOVIMIENTOS}/${id}`)
  },
}
