import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Pagination } from "@/components/ui/Pagination"
import { Alert } from "@/components/ui/Alert"
import { Badge } from "@/components/ui/Badge"
import { DataTable } from "@/components/shared/DataTable"
import type { Column } from "@/components/shared/DataTable"
import { useAsistencias } from "../hooks/useAsistencias"
import { asistenciaService } from "../services/asistencia.service"
import { useNotification } from "@/hooks/useNotification"
import type { Asistencia } from "../types/asistencias.types"
import { formatDate } from "@/utils/formatDate"
import { useState, useEffect } from "react"
import { trabajadorService } from "@/modules/trabajadores/services/trabajador.service"
import { Select } from "@/components/ui/Select"
import { Input } from "@/components/ui/Input"
import type { Option } from "@/types"
import { LogIn, LogOut } from "lucide-react"

const columns: Column<Asistencia>[] = [
  { key: "fecha", header: "Fecha", render: (item) => formatDate(item.fecha) },
  { key: "trabajador", header: "Trabajador", render: (item) => item.trabajador?.nombre || "-" },
  {
    key: "presente",
    header: "Estado",
    render: (item) => (
      <Badge color={item.presente ? "success" : "error"}>
        {item.presente ? "Presente" : "Ausente"}
      </Badge>
    ),
  },
  { key: "horaEntrada", header: "Entrada", render: (item) => item.horaEntrada || "-" },
  { key: "horaSalida", header: "Salida", render: (item) => item.horaSalida || "-" },
  { key: "justificacion", header: "Justificación", render: (item) => item.justificacion || "-" },
  {
    key: "acciones",
    header: "",
    className: "w-[160px]",
    render: (item) => <AsistenciaActions asistencia={item} />,
  },
]

function AsistenciaActions({ asistencia }: { asistencia: Asistencia }) {
  const { notify } = useNotification()
  const [loading, setLoading] = useState(false)

  const handleEntrada = async () => {
    setLoading(true)
    try {
      await asistenciaService.marcarEntrada(asistencia.trabajadorId)
      notify({ type: "success", title: "Entrada marcada", message: "Hora de entrada registrada." })
    } catch {
      notify({ type: "error", title: "Error", message: "No se pudo marcar entrada." })
    } finally {
      setLoading(false)
    }
  }

  const handleSalida = async () => {
    setLoading(true)
    try {
      await asistenciaService.marcarSalida(asistencia.trabajadorId)
      notify({ type: "success", title: "Salida marcada", message: "Hora de salida registrada." })
    } catch {
      notify({ type: "error", title: "Error", message: "No se pudo marcar salida." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Button variant="outline" size="sm" onClick={handleEntrada} disabled={loading || !!asistencia.horaEntrada}>
        <LogIn size={14} />Entrada
      </Button>
      <Button variant="outline" size="sm" onClick={handleSalida} disabled={loading || !asistencia.horaEntrada || !!asistencia.horaSalida}>
        <LogOut size={14} />Salida
      </Button>
    </div>
  )
}

function AsistenciasPage() {
  const { asistencias, loading, error, pagination, fechaFilter, setFechaFilter, trabajadorFilter, setTrabajadorFilter, setPage } = useAsistencias()
  const [trabajadores, setTrabajadores] = useState<Option[]>([])
  const today = new Date().toISOString().split("T")[0]

  useEffect(() => {
    trabajadorService.findAll().then((res) => {
      const list = Array.isArray(res) ? res : (res as { data: { id: number; nombre: string }[] }).data
      setTrabajadores((list ?? []).map((t: { id: number; nombre: string }) => ({ value: String(t.id), label: t.nombre })))
    }).catch(() => {})
  }, [])

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title="Asistencias" description="Control de asistencia de trabajadores" />
      {error && <Alert severity="error">{error}</Alert>}
      <div className="flex gap-4 flex-wrap">
        <div className="w-48">
          <Input label="Fecha" type="date" value={fechaFilter || ""} onChange={(e) => setFechaFilter(e.target.value || undefined)} />
        </div>
        <div className="w-64">
          <Select
            label="Trabajador"
            options={[{ value: "", label: "Todos" }, ...trabajadores]}
            value={trabajadorFilter ? String(trabajadorFilter) : ""}
            placeholder="Seleccione..."
            onChange={(e) => setTrabajadorFilter(e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>
      </div>
      <Card padding="none">
        <DataTable columns={columns} data={asistencias} loading={loading} emptyMessage="No hay asistencias registradas." keyExtractor={(item) => item.id} />
      </Card>
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}

export default AsistenciasPage
