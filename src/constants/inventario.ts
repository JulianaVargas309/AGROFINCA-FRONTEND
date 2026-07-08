export const TIPO_MOVIMIENTO = {
  ENTRADA: "ENTRADA",
  SALIDA: "SALIDA",
  AJUSTE: "AJUSTE",
} as const

export type TipoMovimiento = (typeof TIPO_MOVIMIENTO)[keyof typeof TIPO_MOVIMIENTO]

export const TIPO_MOVIMIENTO_LABELS: Record<TipoMovimiento, string> = {
  ENTRADA: "Entrada",
  SALIDA: "Salida",
  AJUSTE: "Ajuste",
}

export const UNIDAD_MEDIDA = {
  KG: "KG",
  LB: "LB",
  ARROBA: "ARROBA",
  BULTO: "BULTO",
  LITRO: "LITRO",
  GALON: "GALON",
  UNIDAD: "UNIDAD",
  SACO: "SACO",
  CANECA: "CANECA",
} as const

export type UnidadMedida = (typeof UNIDAD_MEDIDA)[keyof typeof UNIDAD_MEDIDA]

export const UNIDAD_MEDIDA_LABELS: Record<UnidadMedida, string> = {
  KG: "Kilogramos",
  LB: "Libras",
  ARROBA: "Arrobas",
  BULTO: "Bultos",
  LITRO: "Litros",
  GALON: "Galones",
  UNIDAD: "Unidades",
  SACO: "Sacos",
  CANECA: "Canecas",
}

export const CATEGORIA_PRODUCTO = {
  FERTILIZANTE: "FERTILIZANTE",
  PESTICIDA: "PESTICIDA",
  HERBICIDA: "HERBICIDA",
  HERRAMIENTA: "HERRAMIENTA",
  SEMILLA: "SEMILLA",
  COSECHA: "COSECHA",
  OTRO: "OTRO",
} as const

export type CategoriaProducto = (typeof CATEGORIA_PRODUCTO)[keyof typeof CATEGORIA_PRODUCTO]

export const CATEGORIA_PRODUCTO_LABELS: Record<CategoriaProducto, string> = {
  FERTILIZANTE: "Fertilizante",
  PESTICIDA: "Pesticida",
  HERBICIDA: "Herbicida",
  HERRAMIENTA: "Herramienta",
  SEMILLA: "Semilla",
  COSECHA: "Cosecha",
  OTRO: "Otro",
}

export const TIPO_MOVIMIENTO_OPTIONS = Object.entries(TIPO_MOVIMIENTO_LABELS).map(([value, label]) => ({
  value: value as TipoMovimiento,
  label,
}))

export const UNIDAD_MEDIDA_OPTIONS = Object.entries(UNIDAD_MEDIDA_LABELS).map(([value, label]) => ({
  value: value as UnidadMedida,
  label,
}))

export const CATEGORIA_PRODUCTO_OPTIONS = Object.entries(CATEGORIA_PRODUCTO_LABELS).map(([value, label]) => ({
  value: value as CategoriaProducto,
  label,
}))
