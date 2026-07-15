import { Link, useNavigate } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Pagination } from "@/components/ui/Pagination"
import { Alert } from "@/components/ui/Alert"
import { Badge } from "@/components/ui/Badge"
import { DataTable } from "@/components/shared/DataTable"
import type { Column } from "@/components/shared/DataTable"
import { usePresupuestos } from "../hooks/usePresupuestos"
import type { Presupuesto } from "../types/presupuestos.types"
import { formatDate } from "@/utils/formatDate"
import { formatCurrency } from "@/utils/formatCurrency"
import { Plus, Eye } from "lucide-react"
import type { Option } from "@/types"

const estadoBadge: Record<string, "success" | "warning" | "error" | "info"> = {
  BORRADOR: "warning",
  APROBADO: "info",
  EJECUTANDO: "success",
  CERRADO: "error",
}

const estadoOptions: Option[] = [
  { value: "", label: "Todos" },
  { value: "BORRADOR", label: "Borrador" },
  { value: "APROBADO", label: "Aprobado" },
  { value: "EJECUTANDO", label: "Ejecutando" },
  { value: "CERRADO", label: "Cerrado" },
]

const columns: Column<Presupuesto>[] = [
  {
    key: "nombre",
    header: "Nombre",
    render: (item) => (
      <Link to={`/app/presupuestos/${item.id}`} className="font-medium text-emerald-700 hover:text-emerald-800">
        {item.nombre}
      </Link>
    ),
  },
  { key: "descripcion", header: "Descripción", render: (item) => item.descripcion || "-" },
  { key: "periodoInicio", header: "Inicio", render: (item) => formatDate(item.periodoInicio) },
  { key: "periodoFin", header: "Fin", render: (item) => formatDate(item.periodoFin) },
  {
    key: "montoTotal",
    header: "Presupuestado",
    render: (item) => formatCurrency(item.montoTotal),
  },
  {
    key: "montoEjecutado",
    header: "Ejecutado",
    render: (item) => {
      const pct = item.montoTotal > 0 ? Math.round((item.montoEjecutado / item.montoTotal) * 100) : 0
      return (
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 rounded-full bg-stone-100 overflow-hidden">
            <div
              className={`h-full rounded-full ${pct > 80 ? "bg-emerald-500" : pct > 50 ? "bg-amber-500" : "bg-red-500"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs text-stone-500">{pct}%</span>
        </div>
      )
    },
  },
  { key: "estado", header: "Estado", render: (item) => <Badge color={estadoBadge[item.estado]}>{item.estado}</Badge> },
  {
    key: "acciones",
    header: "",
    className: "w-[60px]",
    render: (item) => (
      <Link to={`/app/presupuestos/${item.id}`} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 inline-block">
        <Eye size={16} />
      </Link>
    ),
  },
]

function PresupuestosPage() {
  const { presupuestos, loading, error, pagination, estadoFiltro, setEstadoFiltro, setPage } = usePresupuestos()

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title="Presupuestos" description="Administración de presupuestos por período" actions={
        <Link to="/app/presupuestos/nuevo"><Button><Plus size={16} />Nuevo Presupuesto</Button></Link>
      } />
      {error && <Alert severity="error">{error}</Alert>}
      <div className="flex items-center gap-3">
        <div className="w-48">
          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm bg-white text-stone-700"
          >
            {estadoOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      <Card padding="none">
        <DataTable
          columns={columns}
          data={presupuestos}
          loading={loading}
          emptyMessage="No hay presupuestos registrados."
          keyExtractor={(item) => item.id}
        />
      </Card>
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}

export default PresupuestosPage
