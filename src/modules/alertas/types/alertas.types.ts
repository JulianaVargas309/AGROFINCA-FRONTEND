export interface Alerta {
  id: number
  mensaje: string
  tipo: string
  leida: boolean
  productoId: number
  producto?: { id: number; nombre: string }
  createdAt: string
}
