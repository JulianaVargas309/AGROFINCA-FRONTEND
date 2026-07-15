export interface EventoCalendario {
  id: number
  titulo: string
  descripcion?: string
  tipo: "SIEMBRA" | "FERTILIZACION" | "RIEGO" | "FUMIGACION" | "PODA" | "COSECHA" | "COMPRA" | "PAGO" | "JORNAL" | "MANTENIMIENTO" | "OTRO"
  fechaInicio: string
  fechaFin?: string
  todoElDia: boolean
  estado: string
  prioridad: "BAJA" | "MEDIA" | "ALTA" | "CRITICA"
  color?: string
  ubicacion?: string
  fincaId?: number
  loteId?: number
  cultivoId?: number
  finca?: { id: number; nombre: string }
  lote?: { id: number; nombre: string }
  cultivo?: { id: number; nombre: string }
  recordatorios?: Recordatorio[]
}

export interface Recordatorio {
  id: number
  titulo: string
  mensaje?: string
  fecha: string
  enviado: boolean
  eventoCalendarioId?: number
}

export interface CreateEventoInput {
  titulo: string
  descripcion?: string
  tipo: string
  fechaInicio: string
  fechaFin?: string
  todoElDia: boolean
  estado: string
  prioridad: string
  color?: string
  ubicacion?: string
  fincaId?: number
  loteId?: number
  cultivoId?: number
}

export interface UpdateEventoInput {
  titulo?: string
  descripcion?: string
  tipo?: string
  fechaInicio?: string
  fechaFin?: string
  todoElDia?: boolean
  estado?: string
  prioridad?: string
  color?: string
  ubicacion?: string
  fincaId?: number
  loteId?: number
  cultivoId?: number
}

export interface CreateRecordatorioInput {
  titulo: string
  mensaje?: string
  fecha: string
  eventoCalendarioId?: number
}

export const TIPO_EVENTO_OPTIONS = [
  { value: "SIEMBRA", label: "Siembra", color: "green" },
  { value: "FERTILIZACION", label: "Fertilización", color: "blue" },
  { value: "RIEGO", label: "Riego", color: "cyan" },
  { value: "FUMIGACION", label: "Fumigación", color: "yellow" },
  { value: "PODA", label: "Poda", color: "orange" },
  { value: "COSECHA", label: "Cosecha", color: "emerald" },
  { value: "COMPRA", label: "Compra", color: "purple" },
  { value: "PAGO", label: "Pago", color: "red" },
  { value: "JORNAL", label: "Jornal", color: "indigo" },
  { value: "MANTENIMIENTO", label: "Mantenimiento", color: "stone" },
  { value: "OTRO", label: "Otro", color: "gray" },
] as const

export const PRIORIDAD_OPTIONS = [
  { value: "BAJA", label: "Baja" },
  { value: "MEDIA", label: "Media" },
  { value: "ALTA", label: "Alta" },
  { value: "CRITICA", label: "Crítica" },
] as const
