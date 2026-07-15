export interface RendimientoLote {
  id: number
  temporada?: string
  areaCultivada?: number
  produccionTotal: number
  rendimiento?: number
  unidad: string
  observaciones?: string
  loteId: number
  lote?: { id: number; nombre: string }
}

export interface RendimientoCultivo {
  id: number
  temporada?: string
  areaCultivada?: number
  produccionTotal: number
  rendimiento?: number
  unidad: string
  observaciones?: string
  cultivoId: number
  cultivo?: { id: number; nombre: string }
}

export interface CreateRendimientoLoteInput {
  temporada?: string
  areaCultivada?: number
  produccionTotal: number
  unidad?: string
  observaciones?: string
  loteId: number
}

export interface CreateRendimientoCultivoInput {
  temporada?: string
  areaCultivada?: number
  produccionTotal: number
  unidad?: string
  observaciones?: string
  cultivoId: number
}
