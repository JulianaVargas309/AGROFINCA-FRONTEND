export interface AuditLog {
  id: number
  accion: string
  entidad: string
  entidadId?: number
  detalle?: string
  ip?: string
  userAgent?: string
  createdAt: string
  user?: { id: number; nombre: string }
}
