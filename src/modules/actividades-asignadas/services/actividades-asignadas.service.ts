import { apiGet, apiPost, apiPut, apiDelete } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { ActividadAsignada, CreateActividadAsignadaInput, UpdateActividadAsignadaInput } from "../types/actividades-asignadas.types"
import type { PaginatedResponse } from "@/types"

export const actividadAsignadaService = {
  async findAll(trabajadorId?: number, estado?: string, page?: number, limit?: number): Promise<ActividadAsignada[] | PaginatedResponse<ActividadAsignada>> {
    const params: Record<string, unknown> = {}
    if (trabajadorId) params.trabajadorId = trabajadorId
    if (estado) params.estado = estado
    if (page) params.page = page
    if (limit) params.limit = limit
    return apiGet<ActividadAsignada[] | PaginatedResponse<ActividadAsignada>>(API_ENDPOINTS.ACTIVIDADES_ASIGNADAS, { params })
  },

  async findById(id: number): Promise<ActividadAsignada> {
    return apiGet<ActividadAsignada>(`${API_ENDPOINTS.ACTIVIDADES_ASIGNADAS}/${id}`)
  },

  async create(data: CreateActividadAsignadaInput): Promise<ActividadAsignada> {
    return apiPost<ActividadAsignada>(API_ENDPOINTS.ACTIVIDADES_ASIGNADAS, data)
  },

  async update(id: number, data: UpdateActividadAsignadaInput): Promise<ActividadAsignada> {
    return apiPut<ActividadAsignada>(`${API_ENDPOINTS.ACTIVIDADES_ASIGNADAS}/${id}`, data)
  },

  async remove(id: number): Promise<ActividadAsignada> {
    return apiDelete<ActividadAsignada>(`${API_ENDPOINTS.ACTIVIDADES_ASIGNADAS}/${id}`)
  },
}
