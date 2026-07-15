import { notificacionService } from "./notificaciones.service"
import { apiGet } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"

interface Producto {
  id: number
  nombre: string
  stockActual: number
  stockMinimo: number
}

interface EventoCalendario {
  id: number
  titulo: string
  fechaInicio: string
  fechaFin?: string
}

interface Jornal {
  id: number
  montoPagado?: number
  trabajador?: { id: number; nombre: string }
}

function toArray<T>(response: T[] | { data?: T[] } | null | undefined): T[] {
  if (!response) return []
  if (Array.isArray(response)) return response
  if ("data" in response && Array.isArray(response.data)) return response.data
  return []
}

function getTodayISO(): string {
  return new Date().toISOString().split("T")[0]
}

function getTomorrowISO(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split("T")[0]
}

function getNextWeekISO(): string {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  return d.toISOString().split("T")[0]
}

export const autoNotificacionService = {
  async verificarStockBajo(): Promise<void> {
    try {
      const productos = await apiGet<Producto[]>(API_ENDPOINTS.PRODUCTOS).then(toArray).catch(() => [] as Producto[])
      const stockBajo = productos.filter((p) => p.stockActual <= p.stockMinimo)
      for (const producto of stockBajo) {
        await notificacionService.create({
          titulo: `Stock bajo: ${producto.nombre}`,
          mensaje: `Stock actual: ${producto.stockActual} | Mínimo: ${producto.stockMinimo}`,
          tipo: "STOCK_BAJO",
          link: "/app/inventario",
        })
      }
    } catch {
      // non-critical
    }
  },

  async verificarActividadesProximas(): Promise<void> {
    try {
      const hoy = getTodayISO()
      const proximaSemana = getNextWeekISO()
      const eventos = await apiGet<EventoCalendario[]>(
        `${API_ENDPOINTS.CALENDARIO}?fechaDesde=${hoy}&fechaHasta=${proximaSemana}`
      ).then(toArray).catch(() => [] as EventoCalendario[])

      for (const evento of eventos) {
        await notificacionService.create({
          titulo: `Evento próximo: ${evento.titulo}`,
          mensaje: `Fecha: ${new Date(evento.fechaInicio).toLocaleDateString("es-CO")}`,
          tipo: "EVENTO_PROXIMO",
          link: `/app/calendario/${evento.id}`,
        })
      }
    } catch {
      // non-critical
    }
  },

  async verificarJornalesPendientes(): Promise<void> {
    try {
      const jornales = await apiGet<Jornal[]>(API_ENDPOINTS.JORNALES).then(toArray).catch(() => [] as Jornal[])
      const pendientes = jornales.filter((j) => !j.montoPagado || j.montoPagado === 0)
      if (pendientes.length > 0) {
        await notificacionService.create({
          titulo: `Jornales pendientes de pago`,
          mensaje: `${pendientes.length} jornal${pendientes.length > 1 ? "es" : ""} sin liquidar`,
          tipo: "JORNAL_PENDIENTE",
          link: "/app/jornales",
        })
      }
    } catch {
      // non-critical
    }
  },

  async verificarRecordatorios(): Promise<void> {
    try {
      const hoy = getTodayISO()
      const manana = getTomorrowISO()
      const eventos = await apiGet<EventoCalendario[]>(
        `${API_ENDPOINTS.CALENDARIO}?fechaDesde=${hoy}&fechaHasta=${manana}`
      ).then(toArray).catch(() => [] as EventoCalendario[])

      for (const evento of eventos) {
        await notificacionService.create({
          titulo: `Recordatorio: ${evento.titulo}`,
          mensaje: `Evento programado para hoy`,
          tipo: "RECORDATORIO",
          link: `/app/calendario/${evento.id}`,
        })
      }
    } catch {
      // non-critical
    }
  },

  async ejecutarTodas(): Promise<void> {
    await Promise.allSettled([
      this.verificarStockBajo(),
      this.verificarActividadesProximas(),
      this.verificarJornalesPendientes(),
      this.verificarRecordatorios(),
    ])
  },
}
