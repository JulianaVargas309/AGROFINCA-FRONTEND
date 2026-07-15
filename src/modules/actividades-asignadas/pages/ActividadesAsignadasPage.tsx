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
import { useActividadesAsignadas } from "../hooks/useActividadesAsignadas"
import { useModal } from "@/hooks/useModal"
import { actividadAsignadaService } from "../services/actividades-asignadas.service"
import { useNotification } from "@/hooks/useNotification"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import type { ActividadAsignada } from "../types/actividades-asignadas.types"
import { formatDate } from "@/utils/formatDate"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { trabajadorService } from "@/modules/trabajadores/services/trabajador.service"
import { Select } from "@/components/ui/Select"
import type { Option } from "@/types"

const estadoColors: Record<string, string> = {
  PENDIENTE: "warning",
  EN_PROGRESO: "info",
  COMPLETADA: "success",
  CANCELADA: "error",
}

const prioridadColors: Record<string, string> = {
  BAJA: "default",
  MEDIA: "info",
  ALTA: "warning",
  URGENTE: "error",
}

const columns: Column<ActividadAsignada>[] = [
  {
    key: "titulo",
    header: "Título",
    render: (item) => (
      <Link to={`/app/actividades-asignadas/${item.id}`} className="font-medium text-emerald-700 hover:text-emerald-800">
        {item.titulo}
      </Link>
    ),
  },
  { key: "trabajador", header: "Trabajador", render: (item) => item.trabajador?.nombre || "-" },
  {
    key: "estado",
    header: "Estado",
    render: (item) => <Badge color={estadoColors[item.estado] || "default"}>{item.estado}</Badge>,
  },
  {
    key: "prioridad",
    header: "Prioridad",
    render: (item) => <Badge color={prioridadColors[item.prioridad] || "default"}>{item.prioridad}</Badge>,
  },
  { key: "fechaAsignacion", header: "Asignación", render: (item) => formatDate(item.fechaAsignacion) },
  { key: "fechaFin", header: "Vence", render: (item) => (item.fechaFin ? formatDate(item.fechaFin) : "-") },
  {
    key: "acciones",
    header: "",
    className: "w-[100px]",
    render: (item) => <Actions id={item.id} />,
  },
]

function Actions({ id }: { id: number }) {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const confirmModal = useModal()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await actividadAsignadaService.remove(id)
      notify({ type: "success", title: "Actividad eliminada", message: "Actividad eliminada correctamente." })
      confirmModal.close()
      window.location.reload()
    } catch {
      notify({ type: "error", title: "Error", message: "No se pudo eliminar." })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button onClick={() => navigate(`/app/actividades-asignadas/${id}`)} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 cursor-pointer"><Edit size={16} /></button>
      <button onClick={confirmModal.open} className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"><Trash2 size={16} /></button>
      <ConfirmDialog isOpen={confirmModal.isOpen} onClose={confirmModal.close} onConfirm={handleDelete} title="Eliminar Actividad" message="¿Estás seguro?" confirmLabel="Eliminar" loading={deleting} />
    </div>
  )
}

const estadoFilterOptions: Option[] = [
  { value: "", label: "Todos" },
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "EN_PROGRESO", label: "En Progreso" },
  { value: "COMPLETADA", label: "Completada" },
  { value: "CANCELADA", label: "Cancelada" },
]

function ActividadesAsignadasPage() {
  const { actividades, loading, error, pagination, trabajadorFilter, setTrabajadorFilter, estadoFilter, setEstadoFilter, search, setSearch, setPage } = useActividadesAsignadas()
  const [trabajadores, setTrabajadores] = useState<Option[]>([])

  useEffect(() => {
    trabajadorService.findAll().then((res) => {
      const list = Array.isArray(res) ? res : (res as { data: { id: number; nombre: string }[] }).data
      setTrabajadores((list ?? []).map((t: { id: number; nombre: string }) => ({ value: String(t.id), label: t.nombre })))
    }).catch(() => {})
  }, [])

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title="Actividades Asignadas" description="Gestión de tareas asignadas a trabajadores" actions={
        <Link to="/app/actividades-asignadas/nueva"><Button><Plus size={16} />Nueva Actividad</Button></Link>
      } />
      {error && <Alert severity="error">{error}</Alert>}
      <div className="flex gap-4 flex-wrap items-end">
        <div className="flex-1 max-w-sm"><SearchBar value={search} onChange={setSearch} placeholder="Buscar actividades..." /></div>
        <div className="w-48">
          <Select label="Estado" options={estadoFilterOptions} value={estadoFilter || ""} placeholder="Filtrar..." onChange={(e) => setEstadoFilter(e.target.value || undefined)} />
        </div>
        <div className="w-56">
          <Select label="Trabajador" options={[{ value: "", label: "Todos" }, ...trabajadores]} value={trabajadorFilter ? String(trabajadorFilter) : ""} placeholder="Seleccione..." onChange={(e) => setTrabajadorFilter(e.target.value ? Number(e.target.value) : undefined)} />
        </div>
      </div>
      <Card padding="none">
        <DataTable columns={columns} data={actividades} loading={loading} emptyMessage="No hay actividades asignadas." keyExtractor={(item) => item.id} />
      </Card>
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}

export default ActividadesAsignadasPage
