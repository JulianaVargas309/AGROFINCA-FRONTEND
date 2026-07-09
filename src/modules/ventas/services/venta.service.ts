import { apiGet, apiPost, apiPut, apiDelete } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { Venta, CreateVentaInput, UpdateVentaInput } from "../types/venta.types"
import type { PaginatedResponse } from "@/types"

export const ventaService = {
  async findAll(page?: number, limit?: number): Promise<Venta[] | PaginatedResponse<Venta>> {
    const params: Record<string, unknown> = {}
    if (page) params.page = page
    if (limit) params.limit = limit
    return apiGet<Venta[] | PaginatedResponse<Venta>>(API_ENDPOINTS.VENTAS, { params })
  },

  async findById(id: number): Promise<Venta> {
    return apiGet<Venta>(`${API_ENDPOINTS.VENTAS}/${id}`)
  },

  async create(data: CreateVentaInput): Promise<Venta> {
    return apiPost<Venta>(API_ENDPOINTS.VENTAS, data)
  },

  async update(id: number, data: UpdateVentaInput): Promise<Venta> {
    return apiPut<Venta>(`${API_ENDPOINTS.VENTAS}/${id}`, data)
  },

  async remove(id: number): Promise<Venta> {
    return apiDelete<Venta>(`${API_ENDPOINTS.VENTAS}/${id}`)
  },
}
