export interface Ajuste {
  id: number
  tipo: "entrada" | "salida"
  cantidad: number
  motivo: string
  fecha: string
  productoId: number
  producto?: { id: number; nombre: string }
  userId: number
  user?: { id: number; nombre: string }
}

export interface CreateAjusteInput {
  tipo: "entrada" | "salida"
  cantidad: number
  motivo: string
  productoId: number
}
