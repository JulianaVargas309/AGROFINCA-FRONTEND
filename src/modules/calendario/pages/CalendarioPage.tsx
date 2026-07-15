import { useState, useMemo, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Alert } from "@/components/ui/Alert"
import { Select } from "@/components/ui/Select"
import { Spinner } from "@/components/ui/Spinner"
import { useEventosCalendario } from "../hooks/useEventosCalendario"
import { TIPO_EVENTO_OPTIONS } from "../types/calendario.types"
import type { EventoCalendario } from "../types/calendario.types"
import { formatDate } from "@/utils/formatDate"
import { Plus, ChevronLeft, ChevronRight, CalendarDays, CalendarRange, Clock } from "lucide-react"
import type { Option } from "@/types"

type Vista = "mes" | "semana" | "dia"

const TIPO_FILTER_OPTIONS: Option[] = [
  { value: "", label: "Todos" },
  ...TIPO_EVENTO_OPTIONS.map((t) => ({ value: t.value, label: t.label })),
]

const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
const DAYS_OF_WEEK = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

function getTipoColor(tipo: string): string {
  const opt = TIPO_EVENTO_OPTIONS.find((t) => t.value === tipo)
  if (!opt) return "bg-gray-400"
  const colorMap: Record<string, string> = {
    green: "bg-emerald-500", blue: "bg-blue-500", cyan: "bg-cyan-500",
    yellow: "bg-yellow-500", orange: "bg-orange-500", emerald: "bg-emerald-500",
    purple: "bg-purple-500", red: "bg-red-500", indigo: "bg-indigo-500",
    stone: "bg-stone-500", gray: "bg-gray-500",
  }
  return colorMap[opt.color] || "bg-gray-400"
}

function getTipoBadgeColor(tipo: string): "success" | "warning" | "error" | "info" | "default" {
  const opt = TIPO_EVENTO_OPTIONS.find((t) => t.value === tipo)
  switch (opt?.color) {
    case "green": case "emerald": return "success"
    case "yellow": case "orange": return "warning"
    case "red": return "error"
    case "blue": case "cyan": case "purple": case "indigo": return "info"
    default: return "default"
  }
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString("es-CO", { weekday: "short", day: "numeric", month: "short" })
}

function getEventsForDate(date: Date, eventos: EventoCalendario[]): EventoCalendario[] {
  const dateStr = date.toISOString().split("T")[0]
  return eventos.filter((e) => {
    const start = e.fechaInicio.split("T")[0]
    const end = e.fechaFin ? e.fechaFin.split("T")[0] : start
    return dateStr >= start && dateStr <= end
  })
}

function CalendarioPage() {
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [vista, setVista] = useState<Vista>("mes")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [tipoFiltro, setTipoFiltro] = useState("")

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const { eventos, loading, error } = useEventosCalendario()

  const filteredEventos = useMemo(() => {
    if (!tipoFiltro) return eventos
    return eventos.filter((e) => e.tipo === tipoFiltro)
  }, [eventos, tipoFiltro])

  const todayStr = new Date().toISOString().split("T")[0]

  const navigatePrev = useCallback(() => {
    setCurrentDate((prev) => {
      const d = new Date(prev)
      if (vista === "mes") d.setMonth(d.getMonth() - 1)
      else if (vista === "semana") d.setDate(d.getDate() - 7)
      else d.setDate(d.getDate() - 1)
      return d
    })
    setSelectedDate(null)
  }, [vista])

  const navigateNext = useCallback(() => {
    setCurrentDate((prev) => {
      const d = new Date(prev)
      if (vista === "mes") d.setMonth(d.getMonth() + 1)
      else if (vista === "semana") d.setDate(d.getDate() + 7)
      else d.setDate(d.getDate() + 1)
      return d
    })
    setSelectedDate(null)
  }, [vista])

  const vistaOptions: { value: Vista; label: string; icon: typeof CalendarDays }[] = [
    { value: "mes", label: "Mes", icon: CalendarRange },
    { value: "semana", label: "Semana", icon: CalendarDays },
    { value: "dia", label: "Día", icon: Clock },
  ]

  const getTitle = () => {
    if (vista === "mes") return `${MONTHS[month]} ${year}`
    if (vista === "semana") {
      const weekStart = new Date(currentDate)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)
      return `${formatDateShort(weekStart)} - ${formatDateShort(weekEnd)}`
    }
    return formatDateShort(currentDate)
  }

  const eventosDelDia = useMemo(() => {
    if (!selectedDate) return []
    const dateStr = selectedDate.toISOString().split("T")[0]
    const dayEvents = filteredEventos.filter((e) => {
      const start = e.fechaInicio.split("T")[0]
      const end = e.fechaFin ? e.fechaFin.split("T")[0] : start
      return dateStr >= start && dateStr <= end
    })
    return dayEvents
  }, [filteredEventos, selectedDate])

  const weekDays = useMemo(() => {
    const start = new Date(currentDate)
    start.setDate(start.getDate() - start.getDay())
    const days: { date: Date; events: EventoCalendario[] }[] = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(start)
      d.setDate(d.getDate() + i)
      days.push({ date: d, events: getEventsForDate(d, filteredEventos) })
    }
    return days
  }, [currentDate, filteredEventos])

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title="Calendario Agrícola"
        description="Gestiona los eventos del calendario agrícola"
        actions={
          <Link to="/app/calendario/nuevo">
            <Button>
              <Plus size={16} />
              Nuevo Evento
            </Button>
          </Link>
        }
      />
      {error && <Alert severity="error">{error}</Alert>}
      <div className="flex flex-wrap items-center gap-3">
        <Select
          options={TIPO_FILTER_OPTIONS}
          placeholder="Filtrar por tipo"
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value)}
          className="min-w-[180px]"
        />
        <div className="flex rounded-lg border border-stone-200 overflow-hidden">
          {vistaOptions.map((opt) => {
            const Icon = opt.icon
            return (
              <button
                key={opt.value}
                onClick={() => { setVista(opt.value); setSelectedDate(null) }}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  vista === opt.value
                    ? "bg-emerald-700 text-white"
                    : "bg-white text-stone-600 hover:bg-stone-50"
                }`}
              >
                <Icon size={14} />
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card padding="none">
            <div className="flex items-center justify-between p-4 border-b border-stone-200">
              <button onClick={navigatePrev} className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 cursor-pointer">
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-lg font-semibold text-stone-900">
                {getTitle()}
              </h2>
              <button onClick={navigateNext} className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 cursor-pointer">
                <ChevronRight size={20} />
              </button>
            </div>

            {vista === "mes" && (
              <MonthView
                year={year}
                month={month}
                eventos={filteredEventos}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                todayStr={todayStr}
              />
            )}

            {vista === "semana" && (
              <WeekView
                weekDays={weekDays}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                todayStr={todayStr}
              />
            )}

            {vista === "dia" && (
              <DayView
                date={currentDate}
                eventos={getEventsForDate(currentDate, filteredEventos)}
                navigate={navigate}
              />
            )}
          </Card>
        </div>
        <div className="space-y-4">
          <Card title={eventosDelDia.length > 0 ? "Eventos del día" : "Próximos eventos"}>
            {loading ? (
              <Spinner />
            ) : eventosDelDia.length > 0 ? (
              <div className="space-y-3">
                {eventosDelDia.map((ev) => (
                  <button
                    key={ev.id}
                    onClick={() => navigate(`/app/calendario/${ev.id}`)}
                    className="w-full text-left p-3 rounded-lg border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${getTipoColor(ev.tipo)}`} />
                      <span className="text-xs font-medium text-stone-500">{ev.tipo}</span>
                      <Badge color={ev.prioridad === "CRITICA" ? "error" : ev.prioridad === "ALTA" ? "warning" : ev.prioridad === "MEDIA" ? "info" : "default"}>
                        {ev.prioridad}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-stone-900">{ev.titulo}</p>
                    <p className="text-xs text-stone-500 mt-0.5">{formatDate(ev.fechaInicio)}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredEventos.slice(0, 5).map((ev) => (
                  <button
                    key={ev.id}
                    onClick={() => navigate(`/app/calendario/${ev.id}`)}
                    className="w-full text-left p-3 rounded-lg border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${getTipoColor(ev.tipo)}`} />
                      <span className="text-xs font-medium text-stone-500">{ev.tipo}</span>
                    </div>
                    <p className="text-sm font-medium text-stone-900">{ev.titulo}</p>
                    <p className="text-xs text-stone-500 mt-0.5">{formatDate(ev.fechaInicio)}</p>
                  </button>
                ))}
                {filteredEventos.length === 0 && (
                  <p className="text-sm text-stone-400 text-center py-4">No hay eventos para mostrar</p>
                )}
              </div>
            )}
          </Card>
          <Card title="Resumen">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">Total eventos</span>
                <span className="font-medium">{eventos.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Eventos hoy</span>
                <span className="font-medium">{getEventsForDate(new Date(), eventos).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Esta semana</span>
                <span className="font-medium">{weekDays.reduce((acc, d) => acc + d.events.length, 0)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function MonthView({
  year, month, eventos, selectedDate, onSelectDate, todayStr,
}: {
  year: number; month: number; eventos: EventoCalendario[]
  selectedDate: Date | null; onSelectDate: (d: Date | null) => void; todayStr: string
}) {
  const daysInMonth = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days: { date: Date; day: number; isCurrentMonth: boolean; events: EventoCalendario[] }[] = []
    const startPad = firstDay.getDay()
    for (let i = startPad - 1; i >= 0; i--) {
      const d = new Date(year, month, -i)
      days.push({ date: d, day: d.getDate(), isCurrentMonth: false, events: [] })
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i)
      const dateStr = d.toISOString().split("T")[0]
      const dayEvents = eventos.filter((e) => {
        const start = e.fechaInicio.split("T")[0]
        const end = e.fechaFin ? e.fechaFin.split("T")[0] : start
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
  }, [year, month, eventos])

  return (
    <>
      <div className="grid grid-cols-7 border-b border-stone-200">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
          <div key={d} className="p-2 text-center text-xs font-medium text-stone-500 uppercase">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {daysInMonth.map((day, idx) => {
          const dateStr = day.date.toISOString().split("T")[0]
          const isToday = dateStr === todayStr
          const isSelected = selectedDate && dateStr === selectedDate.toISOString().split("T")[0]
          return (
            <button
              key={idx}
              onClick={() => onSelectDate(day.isCurrentMonth && day.events.length > 0 ? day.date : null)}
              disabled={!day.isCurrentMonth}
              className={`min-h-[80px] p-1.5 border-b border-r border-stone-100 text-left transition-colors ${
                !day.isCurrentMonth ? "bg-stone-50 text-stone-300" : "hover:bg-emerald-50 cursor-pointer"
              } ${isToday ? "bg-emerald-50" : ""} ${isSelected ? "ring-2 ring-emerald-500 ring-inset" : ""}`}
            >
              <span className={`inline-flex items-center justify-center w-6 h-6 text-xs rounded-full ${
                isToday ? "bg-emerald-700 text-white font-bold" : "font-medium text-stone-700"
              }`}>
                {day.day}
              </span>
              <div className="mt-1 space-y-0.5">
                {day.events.slice(0, 3).map((ev) => (
                  <div key={ev.id} className={`w-full h-1.5 rounded-full ${getTipoColor(ev.tipo)}`} title={ev.titulo} />
                ))}
                {day.events.length > 3 && (
                  <span className="text-[10px] text-stone-400">+{day.events.length - 3} más</span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </>
  )
}

function WeekView({
  weekDays, selectedDate, onSelectDate, todayStr,
}: {
  weekDays: { date: Date; events: EventoCalendario[] }[]
  selectedDate: Date | null; onSelectDate: (d: Date | null) => void; todayStr: string
}) {
  return (
    <>
      <div className="grid grid-cols-7 border-b border-stone-200">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
          <div key={d} className="p-2 text-center text-xs font-medium text-stone-500 uppercase">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {weekDays.map((day, idx) => {
          const dateStr = day.date.toISOString().split("T")[0]
          const isToday = dateStr === todayStr
          const isSelected = selectedDate && dateStr === selectedDate.toISOString().split("T")[0]
          return (
            <button
              key={idx}
              onClick={() => onSelectDate(day.events.length > 0 ? day.date : null)}
              className={`min-h-[120px] p-1.5 border-b border-r border-stone-100 text-left transition-colors hover:bg-emerald-50 cursor-pointer ${
                isToday ? "bg-emerald-50" : ""
              } ${isSelected ? "ring-2 ring-emerald-500 ring-inset" : ""}`}
            >
              <span className={`inline-flex items-center justify-center w-6 h-6 text-xs rounded-full ${
                isToday ? "bg-emerald-700 text-white font-bold" : "font-medium text-stone-700"
              }`}>
                {day.date.getDate()}
              </span>
              <div className="mt-1 space-y-1">
                {day.events.slice(0, 4).map((ev) => (
                  <div
                    key={ev.id}
                    className={`text-[10px] px-1 py-0.5 rounded truncate text-white ${getTipoColor(ev.tipo)}`}
                    title={ev.titulo}
                  >
                    {ev.titulo}
                  </div>
                ))}
                {day.events.length > 4 && (
                  <span className="text-[10px] text-stone-400">+{day.events.length - 4} más</span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </>
  )
}

function DayView({ date, eventos, navigate }: { date: Date; eventos: EventoCalendario[]; navigate: (path: string) => void }) {
  return (
    <div className="p-4 space-y-3">
      {eventos.length === 0 ? (
        <p className="text-sm text-stone-400 text-center py-8">No hay eventos para este día</p>
      ) : (
        eventos.map((ev) => (
          <button
            key={ev.id}
            onClick={() => navigate(`/app/calendario/${ev.id}`)}
            className="w-full text-left p-4 rounded-lg border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-3 h-3 rounded-full ${getTipoColor(ev.tipo)}`} />
              <Badge color={getTipoBadgeColor(ev.tipo)}>{ev.tipo}</Badge>
              <Badge color={ev.prioridad === "CRITICA" ? "error" : ev.prioridad === "ALTA" ? "warning" : ev.prioridad === "MEDIA" ? "info" : "default"}>
                {ev.prioridad}
              </Badge>
            </div>
            <p className="text-base font-semibold text-stone-900">{ev.titulo}</p>
            {ev.descripcion && <p className="text-sm text-stone-600 mt-1 line-clamp-2">{ev.descripcion}</p>}
            <div className="flex items-center gap-4 mt-2 text-xs text-stone-500">
              <span>{formatDate(ev.fechaInicio)}{ev.fechaFin ? ` - ${formatDate(ev.fechaFin)}` : ""}</span>
              {ev.ubicacion && <span>📍 {ev.ubicacion}</span>}
            </div>
            {(ev.finca || ev.lote || ev.cultivo) && (
              <div className="flex items-center gap-3 mt-2 text-xs text-stone-500">
                {ev.finca && <span>Finca: {ev.finca.nombre}</span>}
                {ev.lote && <span>Lote: {ev.lote.nombre}</span>}
                {ev.cultivo && <span>Cultivo: {ev.cultivo.nombre}</span>}
              </div>
            )}
          </button>
        ))
      )}
    </div>
  )
}

export default CalendarioPage
