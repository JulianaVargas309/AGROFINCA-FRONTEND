import { apiGet, apiPatch, apiPost } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { Alerta } from "../types/alertas.types"

export const alertaService = {
  async findAll(leida?: boolean): Promise<Alerta[]> {
    const params: Record<string, unknown> = {}
    if (leida !== undefined) params.leida = leida
    return apiGet<Alerta[]>(API_ENDPOINTS.ALERTAS, { params })
  },

  async marcarLeida(id: number): Promise<Alerta> {
    return apiPatch<Alerta>(`${API_ENDPOINTS.ALERTAS}/${id}/leer`, {})
  },

  async generarAlertas(): Promise<Alerta[]> {
    return apiPost<Alerta[]>(`${API_ENDPOINTS.ALERTAS}/generar`, {})
  },
}
