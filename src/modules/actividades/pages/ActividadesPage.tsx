import { useState, useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Pagination } from "@/components/ui/Pagination"
import { Alert } from "@/components/ui/Alert"
import { Badge } from "@/components/ui/Badge"
import { SearchBar } from "@/components/shared/SearchBar"
import { DataTable } from "@/components/shared/DataTable"
import type { Column } from "@/components/shared/DataTable"
import { useActividades } from "../hooks/useActividades"
import { useModal } from "@/hooks/useModal"
import { actividadService } from "../services/actividades.service"
import { useNotification } from "@/hooks/useNotification"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import type { ActividadSeguimiento } from "../types/actividades.types"
import { formatDate, formatDateTime } from "@/utils/formatDate"
import {
  Plus, Edit, Trash2, CalendarDays, List,
  ChevronLeft, ChevronRight,
} from "lucide-react"
import { cn } from "@/utils/cn"

type TabId = "lista" | "calendario"

function getEstadoColor(estado: string): "default" | "success" | "warning" | "error" | "info" {
  switch (estado) {
    case "PENDIENTE": return "warning"
    case "EN_PROCESO": return "info"
    case "FINALIZADA": return "success"
    case "CANCELADA": return "error"
    default: return "default"
  }
}

const columns: Column<ActividadSeguimiento>[] = [
  {
    key: "titulo",
    header: "Título",
    render: (item) => (
      <Link to={`/app/actividades/${item.id}`} className="font-medium text-emerald-700 hover:text-emerald-800">
        {item.titulo}
      </Link>
    ),
  },
  {
    key: "estado",
    header: "Estado",
    render: (item) => <Badge color={getEstadoColor(item.estado)}>{item.estado}</Badge>,
  },
  { key: "responsable", header: "Responsable", render: (item) => item.responsable?.nombre || "-" },
  {
    key: "fechaInicio",
    header: "Fecha",
    render: (item) => (item.fechaInicio ? formatDate(item.fechaInicio) : "-"),
  },
  {
    key: "costo",
    header: "Costo",
    render: (item) => (item.costo ? `$${item.costo.toLocaleString()}` : "-"),
  },
  {
    key: "acciones",
    header: "",
    className: "w-[100px]",
    render: (item) => <Actions id={item.id} />,
  },
]

const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

function getTipoColor(tipo: string): string {
  const map: Record<string, string> = {
    SIEMBRA: "bg-emerald-500", RIEGO: "bg-blue-500", FERTILIZACION: "bg-cyan-500",
    FUMIGACION: "bg-yellow-500", PODA: "bg-orange-500", COSECHA: "bg-emerald-500",
    MANTENIMIENTO: "bg-stone-500",
  }
  return map[tipo] || "bg-gray-400"
}

function Actions({ id }: { id: number }) {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const confirmModal = useModal()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await actividadService.remove(id)
      notify({ type: "success", title: "Actividad eliminada", message: "Actividad eliminada correctamente." })
      confirmModal.close()
      window.location.reload()
    } catch {
      notify({ type: "error", title: "Error", message: "No se pudo eliminar la actividad." })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button onClick={() => navigate(`/app/actividades/${id}`)} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 cursor-pointer">
        <Edit size={16} />
      </button>
      <button onClick={confirmModal.open} className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 cursor-pointer">
        <Trash2 size={16} />
      </button>
      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.close}
        onConfirm={handleDelete}
        title="Eliminar Actividad"
        message="¿Estás seguro de eliminar esta actividad?"
        confirmLabel="Eliminar"
        loading={deleting}
      />
    </div>
  )
}

function ActividadesPage() {
  const { actividades, loading, error, pagination, search, setSearch, setPage } = useActividades()
  const [activeTab, setActiveTab] = useState<TabId>("lista")
  const [calendarDate, setCalendarDate] = useState(() => new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

  const year = calendarDate.getFullYear()
  const month = calendarDate.getMonth()
  const todayStr = new Date().toISOString().split("T")[0]

  const daysInMonth = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days: { date: Date; day: number; isCurrentMonth: boolean; events: ActividadSeguimiento[] }[] = []

    const startPad = firstDay.getDay()
    for (let i = startPad - 1; i >= 0; i--) {
      const d = new Date(year, month, -i)
      days.push({ date: d, day: d.getDate(), isCurrentMonth: false, events: [] })
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i)
      const dateStr = d.toISOString().split("T")[0]
      const dayEvents = actividades.filter((a) => {
        if (!a.fechaInicio) return false
        const start = a.fechaInicio.split("T")[0]
        const end = a.fechaFin ? a.fechaFin.split("T")[0] : start
        return dateStr >= start && dateStr <= end
      })
      days.push({ date: d, day: i, isCurrentMonth: true, events: dayEvents })
    }
    const endPad = 42 - days.length
    for (let i = 1; i <= endPad; i++) {
      const d = new Date(year, month + 1, i)
      days.push({ date: d, day: d.getDate(), isCurrentMonth: false, events: [] })
    }
    return days
  }, [year, month, actividades])

  const selectedDayEvents = useMemo(() => {
    if (!selectedDay) return []
    const dateStr = selectedDay.toISOString().split("T")[0]
    return actividades.filter((a) => {
      if (!a.fechaInicio) return false
      const start = a.fechaInicio.split("T")[0]
      const end = a.fechaFin ? a.fechaFin.split("T")[0] : start
      return dateStr >= start && dateStr <= end
    })
  }, [selectedDay, actividades])

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title="Actividades"
        description="Registra y da seguimiento a las labores de la finca"
        actions={
          <Link to="/app/actividades/nueva">
            <Button>
              <Plus size={16} />
              Nueva Actividad
            </Button>
          </Link>
        }
      />
      {error && <Alert severity="error">{error}</Alert>}

      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-1">
        <button
          onClick={() => setActiveTab("lista")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
            activeTab === "lista"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-stone-500 hover:text-stone-700"
          }`}
        >
          <List size={16} />
          Lista
        </button>
        <button
          onClick={() => setActiveTab("calendario")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
            activeTab === "calendario"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-stone-500 hover:text-stone-700"
          }`}
        >
          <CalendarDays size={16} />
          Calendario
        </button>
      </div>

      {/* Lista Tab */}
      {activeTab === "lista" && (
        <>
          <div className="flex-1 max-w-sm">
            <SearchBar value={search} onChange={setSearch} placeholder="Buscar actividades..." />
          </div>
          <Card padding="none">
            <DataTable
              columns={columns}
              data={actividades}
              loading={loading}
              emptyMessage="No hay actividades registradas."
              keyExtractor={(item) => item.id}
            />
          </Card>
          {pagination.totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
            </div>
          )}
        </>
      )}

      {/* Calendario Tab */}
      {activeTab === "calendario" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card padding="none">
              <div className="flex items-center justify-between p-4 border-b border-stone-200">
                <button
                  onClick={() => setCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                  className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 cursor-pointer"
                >
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-lg font-semibold text-stone-900">
                  {MONTHS[month]} {year}
                </h2>
                <button
                  onClick={() => setCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                  className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 cursor-pointer"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="grid grid-cols-7 border-b border-stone-200">
                {DAYS.map((d) => (
                  <div key={d} className="p-2 text-center text-xs font-medium text-stone-500 uppercase">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {daysInMonth.map((day, idx) => {
                  const dateStr = day.date.toISOString().split("T")[0]
                  const isToday = dateStr === todayStr
                  const isSelected = selectedDay && dateStr === selectedDay.toISOString().split("T")[0]
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDay(day.isCurrentMonth ? day.date : null)}
                      disabled={!day.isCurrentMonth}
                      className={cn(
                        "min-h-[80px] p-1.5 border-b border-r border-stone-100 text-left transition-colors",
                        !day.isCurrentMonth ? "bg-stone-50 text-stone-300" : "hover:bg-emerald-50 cursor-pointer",
                        isToday ? "bg-emerald-50" : "",
                        isSelected ? "ring-2 ring-emerald-500 ring-inset" : "",
                      )}
                    >
                      <span className={cn(
                        "inline-flex items-center justify-center w-6 h-6 text-xs rounded-full",
                        isToday ? "bg-emerald-700 text-white font-bold" : "font-medium text-stone-700",
                      )}>
                        {day.day}
                      </span>
                      <div className="mt-1 space-y-0.5">
                        {day.events.slice(0, 3).map((ev) => (
                          <div
                            key={ev.id}
                            className={cn("w-full h-1.5 rounded-full", getTipoColor(ev.tipo || ""))}
                            title={ev.titulo}
                          />
                        ))}
                        {day.events.length > 3 && (
                          <span className="text-[10px] text-stone-400">+{day.events.length - 3}</span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Selected Day Events */}
          <div className="space-y-4">
            <Card title={selectedDay ? formatDate(selectedDay) : "Selecciona un día"}>
              {selectedDayEvents.length === 0 ? (
                <p className="text-sm text-stone-400 text-center py-4">
                  {selectedDay ? "No hay actividades este día" : "Haz clic en un día del calendario"}
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedDayEvents.map((ev) => (
                    <Link
                      key={ev.id}
                      to={`/app/actividades/${ev.id}`}
                      className="block p-3 rounded-lg border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn("w-2 h-2 rounded-full", getTipoColor(ev.tipo || ""))} />
                        <span className="text-xs text-stone-500">{ev.tipo || "Actividad"}</span>
                        <Badge color={getEstadoColor(ev.estado)}>{ev.estado}</Badge>
                      </div>
                      <p className="text-sm font-medium text-stone-900">{ev.titulo}</p>
                      {ev.responsable?.nombre && (
                        <p className="text-xs text-stone-500 mt-0.5">{ev.responsable.nombre}</p>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

export default ActividadesPage
