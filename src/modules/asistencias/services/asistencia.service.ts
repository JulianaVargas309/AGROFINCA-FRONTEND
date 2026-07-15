import { apiGet, apiPost } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { Asistencia, CreateAsistenciaInput } from "../types/asistencias.types"
import type { PaginatedResponse } from "@/types"

export const asistenciaService = {
  async findAll(fecha?: string, trabajadorId?: number, page?: number, limit?: number): Promise<Asistencia[] | PaginatedResponse<Asistencia>> {
    const params: Record<string, unknown> = {}
    if (fecha) params.fecha = fecha
    if (trabajadorId) params.trabajadorId = trabajadorId
    if (page) params.page = page
    if (limit) params.limit = limit
    return apiGet<Asistencia[] | PaginatedResponse<Asistencia>>(API_ENDPOINTS.ASISTENCIAS, { params })
  },

  async findById(id: number): Promise<Asistencia> {
    return apiGet<Asistencia>(`${API_ENDPOINTS.ASISTENCIAS}/${id}`)
  },

  async createOrUpdate(data: CreateAsistenciaInput): Promise<Asistencia> {
    return apiPost<Asistencia>(API_ENDPOINTS.ASISTENCIAS, data)
  },

  async marcarEntrada(trabajadorId: number): Promise<Asistencia> {
    return apiPost<Asistencia>(`${API_ENDPOINTS.ASISTENCIAS}/entrada`, { trabajadorId })
  },

  async marcarSalida(trabajadorId: number): Promise<Asistencia> {
    return apiPost<Asistencia>(`${API_ENDPOINTS.ASISTENCIAS}/salida`, { trabajadorId })
  },
}
