export interface Configuracion {
  id: number
  llave: string
  valor: string
  tipo: string
  descripcion?: string
}

export interface UpsertConfiguracionInput {
  valor: string
  descripcion?: string
}
