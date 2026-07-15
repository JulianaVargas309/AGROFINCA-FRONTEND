import { apiGet } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { AuditLog } from "../types/auditoria.types"
import type { PaginatedResponse } from "@/types"

export const auditoriaService = {
  async findAll(page?: number, limit?: number, filters?: Record<string, unknown>): Promise<AuditLog[] | PaginatedResponse<AuditLog>> {
    const params: Record<string, unknown> = {}
    if (page) params.page = page
    if (limit) params.limit = limit
    if (filters) Object.assign(params, filters)
    return apiGet<AuditLog[] | PaginatedResponse<AuditLog>>(API_ENDPOINTS.AUDITORIA, { params })
  },

  async findById(id: number): Promise<AuditLog> {
    return apiGet<AuditLog>(`${API_ENDPOINTS.AUDITORIA}/${id}`)
  },
}
