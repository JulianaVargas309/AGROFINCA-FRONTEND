export interface Produccion {
  id: number
  fecha: string
  cantidad: number
  unidad: string
  calidad?: string
  destino?: string
  observaciones?: string
  temporadaId: number
  cultivoId: number
  loteId: number
  temporada?: { id: number; nombre: string }
  cultivo?: { id: number; nombre: string }
  lote?: { id: number; nombre: string }
}

export interface CreateProduccionInput {
  fecha: string
  cantidad: number
  unidad?: string
  calidad?: string
  destino?: string
  observaciones?: string
  temporadaId: number
  cultivoId: number
  loteId: number
}

export interface UpdateProduccionInput {
  fecha?: string
  cantidad?: number
  unidad?: string
  calidad?: string
  destino?: string
  observaciones?: string
  temporadaId?: number
  cultivoId?: number
  loteId?: number
}
