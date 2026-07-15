import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Pagination } from "@/components/ui/Pagination"
import { Alert } from "@/components/ui/Alert"
import { Badge } from "@/components/ui/Badge"
import { Select } from "@/components/ui/Select"
import { DataTable } from "@/components/shared/DataTable"
import type { Column } from "@/components/shared/DataTable"
import { useAuditorias } from "../hooks/useAuditorias"
import type { AuditLog } from "../types/auditoria.types"
import { formatDate } from "@/utils/formatDate"
import { useState } from "react"

const columns: Column<AuditLog>[] = [
  {
    key: "accion",
    header: "Acción",
    render: (item) => {
      const color = item.accion === "CREATE" ? "success" : item.accion === "UPDATE" ? "warning" : item.accion === "DELETE" ? "danger" : "default"
      return <Badge color={color}>{item.accion}</Badge>
    },
  },
  { key: "entidad", header: "Entidad" },
  { key: "entidadId", header: "ID", render: (item) => item.entidadId ?? "-" },
  {
    key: "detalle",
    header: "Detalle",
    render: (item) => <span className="max-w-[300px] truncate block">{item.detalle || "-"}</span>,
  },
  { key: "user", header: "Usuario", render: (item) => item.user?.nombre || "-" },
  { key: "ip", header: "IP", render: (item) => item.ip || "-" },
  {
    key: "createdAt",
    header: "Fecha",
    render: (item) => formatDate(item.createdAt),
  },
]

const acciones = [
  { value: "CREATE", label: "Creación" },
  { value: "UPDATE", label: "Actualización" },
  { value: "DELETE", label: "Eliminación" },
]

const entidades = [
  { value: "Cultivo", label: "Cultivo" },
  { value: "Lote", label: "Lote" },
  { value: "Finca", label: "Finca" },
  { value: "Temporada", label: "Temporada" },
  { value: "Produccion", label: "Producción" },
  { value: "Categoria", label: "Categoría" },
  { value: "Usuario", label: "Usuario" },
  { value: "Rol", label: "Rol" },
]

function AuditoriaPage() {
  const { auditorias, loading, error, pagination, filters, setFilter, clearFilters, setPage } = useAuditorias()

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title="Auditoría"
        description="Registro de cambios y acciones en el sistema"
      />
      {error && <Alert severity="error">{error}</Alert>}
      <Card>
        <div className="flex flex-wrap items-end gap-3">
          <Select
            value={filters.accion ?? ""}
            onChange={(e) => setFilter("accion", e.target.value || undefined)}
            options={acciones}
            placeholder="Todas las acciones"
            className="min-w-[160px]"
          />
          <Select
            value={filters.entidad ?? ""}
            onChange={(e) => setFilter("entidad", e.target.value || undefined)}
            options={entidades}
            placeholder="Todas las entidades"
            className="min-w-[160px]"
          />
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filters.fechaDesde ?? ""}
              onChange={(e) => setFilter("fechaDesde", e.target.value || undefined)}
              className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-stone-400 text-sm">-</span>
            <input
              type="date"
              value={filters.fechaHasta ?? ""}
              onChange={(e) => setFilter("fechaHasta", e.target.value || undefined)}
              className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          {(filters.accion || filters.entidad || filters.fechaDesde) && (
            <button onClick={clearFilters} className="rounded-lg px-3 py-2 text-sm text-stone-500 hover:bg-stone-100 cursor-pointer">
              Limpiar
            </button>
          )}
        </div>
      </Card>
      <Card padding="none">
        <DataTable columns={columns} data={auditorias} loading={loading} emptyMessage="No hay registros de auditoría." keyExtractor={(item) => item.id} />
      </Card>
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}

export default AuditoriaPage
