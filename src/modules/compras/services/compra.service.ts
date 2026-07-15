import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { Compra, CreateCompraInput, UpdateEstadoCompraInput } from "../types/compras.types"
import type { PaginatedResponse } from "@/types"

export const compraService = {
  async findAll(page?: number, limit?: number): Promise<Compra[] | PaginatedResponse<Compra>> {
    const params: Record<string, unknown> = {}
    if (page) params.page = page
    if (limit) params.limit = limit
    return apiGet<Compra[] | PaginatedResponse<Compra>>(API_ENDPOINTS.COMPRAS, { params })
  },

  async findById(id: number): Promise<Compra> {
    return apiGet<Compra>(`${API_ENDPOINTS.COMPRAS}/${id}`)
  },

  async create(data: CreateCompraInput): Promise<Compra> {
    return apiPost<Compra>(API_ENDPOINTS.COMPRAS, data)
  },

  async updateEstado(id: number, data: UpdateEstadoCompraInput): Promise<Compra> {
    return apiPatch<Compra>(`${API_ENDPOINTS.COMPRAS}/${id}/estado`, data)
  },

  async remove(id: number): Promise<Compra> {
    return apiDelete<Compra>(`${API_ENDPOINTS.COMPRAS}/${id}`)
  },
}
