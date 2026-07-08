export const TIPO_CULTIVO = {
  CAFE: "CAFE",
  CANA_AZUCAR: "CANA_AZUCAR",
  PLATANO: "PLATANO",
  MAIZ: "MAIZ",
  FRIJOL: "FRIJOL",
  YUCA: "YUCA",
  AGUACATE: "AGUACATE",
  CITRICOS: "CITRICOS",
  HORTALIZAS: "HORTALIZAS",
  OTRO: "OTRO",
} as const

export type TipoCultivo = (typeof TIPO_CULTIVO)[keyof typeof TIPO_CULTIVO]

export const TIPO_CULTIVO_LABELS: Record<TipoCultivo, string> = {
  CAFE: "Café",
  CANA_AZUCAR: "Caña de Azúcar",
  PLATANO: "Plátano",
  MAIZ: "Maíz",
  FRIJOL: "Frijol",
  YUCA: "Yuca",
  AGUACATE: "Aguacate",
  CITRICOS: "Cítricos",
  HORTALIZAS: "Hortalizas",
  OTRO: "Otro",
}

export const ESTADO_CULTIVO = {
  ACTIVO: "ACTIVO",
  COSECHADO: "COSECHADO",
  ENFERMO: "ENFERMO",
  ERRADICADO: "ERRADICADO",
} as const

export type EstadoCultivo = (typeof ESTADO_CULTIVO)[keyof typeof ESTADO_CULTIVO]

export const ESTADO_CULTIVO_LABELS: Record<EstadoCultivo, string> = {
  ACTIVO: "Activo",
  COSECHADO: "Cosechado",
  ENFERMO: "Enfermo",
  ERRADICADO: "Erradicado",
}

export const TIPO_CULTIVO_OPTIONS = Object.entries(TIPO_CULTIVO_LABELS).map(([value, label]) => ({
  value: value as TipoCultivo,
  label,
}))

export const ESTADO_CULTIVO_OPTIONS = Object.entries(ESTADO_CULTIVO_LABELS).map(([value, label]) => ({
  value: value as EstadoCultivo,
  label,
}))
