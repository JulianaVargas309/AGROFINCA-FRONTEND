import { Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Pagination } from "@/components/ui/Pagination"
import { Alert } from "@/components/ui/Alert"
import { Badge } from "@/components/ui/Badge"
import { DataTable } from "@/components/shared/DataTable"
import type { Column } from "@/components/shared/DataTable"
import { useHistorialLaboralList } from "../hooks/useHistorialLaboralList"
import type { HistorialLaboral } from "../types/historial-laboral.types"
import { formatDate } from "@/utils/formatDate"
import { Plus } from "lucide-react"
import { useState, useEffect } from "react"
import { trabajadorService } from "@/modules/trabajadores/services/trabajador.service"
import { Select } from "@/components/ui/Select"
import type { Option } from "@/types"

const columns: Column<HistorialLaboral>[] = [
  { key: "id", header: "ID" },
  { key: "tipo", header: "Tipo", render: (item) => <Badge color="default">{item.tipo}</Badge> },
  { key: "descripcion", header: "Descripción" },
  { key: "fecha", header: "Fecha", render: (item) => formatDate(item.fecha) },
  { key: "trabajador", header: "Trabajador", render: (item) => item.trabajador?.nombre || "-" },
  {
    key: "acciones",
    header: "",
    className: "w-[80px]",
    render: (item) => (
      <Link to={`/app/historial-laboral/${item.id}`} className="text-emerald-700 hover:text-emerald-800 text-sm font-medium">
        Ver
      </Link>
    ),
  },
]

function HistorialLaboralPage() {
  const { historial, loading, error, pagination, trabajadorFilter, setTrabajadorFilter, setPage } = useHistorialLaboralList()
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
      <PageHeader title="Historial Laboral" description="Registro del historial de trabajadores" actions={
        <Link to="/app/historial-laboral/nuevo"><Button><Plus size={16} />Nuevo Registro</Button></Link>
      } />
      {error && <Alert severity="error">{error}</Alert>}
      <div className="max-w-xs">
        <Select
          label="Filtrar por Trabajador"
          options={[{ value: "", label: "Todos" }, ...trabajadores]}
          value={trabajadorFilter ? String(trabajadorFilter) : ""}
          placeholder="Seleccione..."
          onChange={(e) => setTrabajadorFilter(e.target.value ? Number(e.target.value) : undefined)}
        />
      </div>
      <Card padding="none">
        <DataTable columns={columns} data={historial} loading={loading} emptyMessage="No hay registros." keyExtractor={(item) => item.id} />
      </Card>
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}

export default HistorialLaboralPage
