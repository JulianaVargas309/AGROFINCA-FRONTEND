import { apiGet, apiPost, apiPut, apiDelete } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { Lote, CreateLoteInput, UpdateLoteInput } from "../types/lote.types"

interface Finca {
  id: number
  nombre: string
}

interface Cultivo {
  id: number
  tipo: string
  nombre: string
  variedad?: string
  fechaSiembra: string
  fechaCosechaEstimada?: string
  estado: string
  cantidadSembrada?: number
  rendimientoEstimado?: number
  lote?: { id: number; nombre: string }
}

interface Jornal {
  id: number
  fecha: string
  tipoPago: string
  total: number
  trabajador: { id: number; nombre: string }
  lote: { id: number; nombre: string }
}

interface Bitacora {
  id: number
  fecha: string
  actividad: string
  descripcion: string
  cantidad?: number
  costo: number
  lote: { id: number; nombre: string }
  cultivo?: { id: number; nombre: string }
  producto?: { id: number; nombre: string }
  user?: { id: number; nombre: string }
}

interface LoteDetail {
  lote: Lote
  cultivos: Cultivo[]
  bitacoras: Bitacora[]
  jornales: Jornal[]
  costoTotal: number
  costoJornales: number
  costoBitacora: number
}

export const loteService = {
  async findAll(fincaId: number): Promise<Lote[]> {
    return apiGet<Lote[]>(`${API_ENDPOINTS.LOTES}?fincaId=${fincaId}`)
  },

  async findById(id: number): Promise<Lote> {
    return apiGet<Lote>(`${API_ENDPOINTS.LOTES}/${id}`)
  },

  async create(data: CreateLoteInput): Promise<Lote> {
    return apiPost<Lote>(API_ENDPOINTS.LOTES, data)
  },

  async update(id: number, data: UpdateLoteInput): Promise<Lote> {
    return apiPut<Lote>(`${API_ENDPOINTS.LOTES}/${id}`, data)
  },

  async remove(id: number): Promise<Lote> {
    return apiDelete<Lote>(`${API_ENDPOINTS.LOTES}/${id}`)
  },

  async fetchFincas(): Promise<Finca[]> {
    return apiGet<Finca[]>(API_ENDPOINTS.FINCAS)
  },

  async fetchDetail(id: number): Promise<LoteDetail> {
    const [lote, cultivos, bitacoras, jornales] = await Promise.all([
      loteService.findById(id).catch(() => null),
      apiGet<Cultivo[]>(`${API_ENDPOINTS.CULTIVOS}?loteId=${id}`).catch(() => [] as Cultivo[]),
      apiGet<Bitacora[]>(`${API_ENDPOINTS.BITACORA}?loteId=${id}&limit=10`).catch(() => [] as Bitacora[]),
      apiGet<Jornal[]>(`${API_ENDPOINTS.JORNALES}?loteId=${id}`).catch(() => [] as Jornal[]),
    ])

    if (!lote) throw new Error("Lote no encontrado")

    const costoBitacora = bitacoras.reduce((sum, b) => sum + (b.costo || 0), 0)
    const costoJornales = jornales.reduce((sum, j) => sum + (j.total || 0), 0)

    return {
      lote,
      cultivos: cultivos,
      bitacoras,
      jornales,
      costoTotal: costoBitacora + costoJornales,
      costoJornales,
      costoBitacora,
    }
  },
}
