import { apiGet, apiPost, apiPut } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { Presupuesto, CreatePresupuestoInput } from "../types/presupuestos.types"
import type { PaginatedResponse } from "@/types"

export const presupuestoService = {
  async findAll(page?: number, limit?: number, estado?: string): Promise<Presupuesto[] | PaginatedResponse<Presupuesto>> {
    const params: Record<string, unknown> = {}
    if (page) params.page = page
    if (limit) params.limit = limit
    if (estado) params.estado = estado
    return apiGet<Presupuesto[] | PaginatedResponse<Presupuesto>>(API_ENDPOINTS.PRESUPUESTOS, { params })
  },

  async findById(id: number): Promise<Presupuesto> {
    return apiGet<Presupuesto>(`${API_ENDPOINTS.PRESUPUESTOS}/${id}`)
  },

  async create(data: CreatePresupuestoInput): Promise<Presupuesto> {
    return apiPost<Presupuesto>(API_ENDPOINTS.PRESUPUESTOS, data)
  },

  async update(id: number, data: Partial<Presupuesto>): Promise<Presupuesto> {
    return apiPut<Presupuesto>(`${API_ENDPOINTS.PRESUPUESTOS}/${id}`, data)
  },

  async updateEstado(id: number, estado: Presupuesto["estado"]): Promise<Presupuesto> {
    return apiPut<Presupuesto>(`${API_ENDPOINTS.PRESUPUESTOS}/${id}/estado`, { estado })
  },
}
