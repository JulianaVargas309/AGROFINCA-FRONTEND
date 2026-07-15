import { apiGet, apiPost } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { FlujoEfectivo, ResumenFlujo } from "../types/flujo.types"
import type { PaginatedResponse } from "@/types"

export const flujoService = {
  async findAll(fechaDesde?: string, fechaHasta?: string, tipo?: string): Promise<FlujoEfectivo[] | PaginatedResponse<FlujoEfectivo>> {
    const params: Record<string, unknown> = {}
    if (fechaDesde) params.fechaDesde = fechaDesde
    if (fechaHasta) params.fechaHasta = fechaHasta
    if (tipo) params.tipo = tipo
    return apiGet<FlujoEfectivo[] | PaginatedResponse<FlujoEfectivo>>(API_ENDPOINTS.FLUJO, { params })
  },

  async findById(id: number): Promise<FlujoEfectivo> {
    return apiGet<FlujoEfectivo>(`${API_ENDPOINTS.FLUJO}/${id}`)
  },

  async create(data: Partial<FlujoEfectivo>): Promise<FlujoEfectivo> {
    return apiPost<FlujoEfectivo>(API_ENDPOINTS.FLUJO, data)
  },

  async getResumen(fechaDesde: string, fechaHasta: string): Promise<ResumenFlujo> {
    return apiGet<ResumenFlujo>(`${API_ENDPOINTS.FLUJO}/resumen`, {
      params: { fechaDesde, fechaHasta },
    })
  },
}
