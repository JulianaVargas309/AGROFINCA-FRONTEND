export interface Asistencia {
  id: number
  fecha: string
  horaEntrada?: string
  horaSalida?: string
  presente: boolean
  justificacion?: string
  trabajadorId: number
  trabajador?: { id: number; nombre: string }
}

export interface CreateAsistenciaInput {
  fecha: string
  horaEntrada?: string
  horaSalida?: string
  presente?: boolean
  justificacion?: string
  trabajadorId: number
}
