import { Link, useNavigate } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Pagination } from "@/components/ui/Pagination"
import { Alert } from "@/components/ui/Alert"
import { Badge } from "@/components/ui/Badge"
import { DataTable } from "@/components/shared/DataTable"
import type { Column } from "@/components/shared/DataTable"
import { useAjustes } from "../hooks/useAjustes"
import type { Ajuste } from "../types/ajustes.types"
import { formatDate } from "@/utils/formatDate"
import { Plus } from "lucide-react"
import { useState, useEffect } from "react"
import { apiGet } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import { Select } from "@/components/ui/Select"
import type { Option } from "@/types"

const columns: Column<Ajuste>[] = [
  { key: "id", header: "ID" },
  { key: "producto", header: "Producto", render: (item) => item.producto?.nombre || "-" },
  {
    key: "tipo",
    header: "Tipo",
    render: (item) => (
      <Badge color={item.tipo === "entrada" ? "success" : "error"}>
        {item.tipo === "entrada" ? "Entrada" : "Salida"}
      </Badge>
    ),
  },
  { key: "cantidad", header: "Cantidad" },
  { key: "motivo", header: "Motivo" },
  { key: "fecha", header: "Fecha", render: (item) => formatDate(item.fecha) },
]

function AjustesPage() {
  const { ajustes, loading, error, pagination, productoFilter, setProductoFilter, setPage } = useAjustes()
  const [productos, setProductos] = useState<Option[]>([])

  useEffect(() => {
    apiGet<{ id: number; nombre: string }[]>(API_ENDPOINTS.PRODUCTOS).then((res) => {
      const list = Array.isArray(res) ? res : (res as unknown as { data: { id: number; nombre: string }[] }).data
      setProductos((list ?? []).map((p: { id: number; nombre: string }) => ({ value: String(p.id), label: p.nombre })))
    }).catch(() => {})
  }, [])

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title="Ajustes de Inventario" description="Control de entradas y salidas por ajuste" actions={
        <Link to="/app/ajustes/nuevo"><Button><Plus size={16} />Nuevo Ajuste</Button></Link>
      } />
      {error && <Alert severity="error">{error}</Alert>}
      <div className="max-w-xs">
        <Select
          label="Filtrar por Producto"
          options={[{ value: "", label: "Todos" }, ...productos]}
          value={productoFilter ? String(productoFilter) : ""}
          placeholder="Seleccione..."
          onChange={(e) => setProductoFilter(e.target.value ? Number(e.target.value) : undefined)}
        />
      </div>
      <Card padding="none">
        <DataTable columns={columns} data={ajustes} loading={loading} emptyMessage="No hay ajustes registrados." keyExtractor={(item) => item.id} />
      </Card>
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}

export default AjustesPage
