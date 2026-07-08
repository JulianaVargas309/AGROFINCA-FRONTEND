import { DataTable } from "@/components/shared/DataTable"
import { formatDate } from "@/utils/formatDate"
import type { Column } from "@/components/shared/DataTable"

interface ReporteItem {
  id: number
  nombre: string
  tipo: string
  fechaGeneracion: string
}

interface ReporteTableProps {
  data: ReporteItem[]
  loading?: boolean
  onRowClick?: (item: ReporteItem) => void
}

const columns: Column<ReporteItem>[] = [
  { key: "nombre", header: "Nombre" },
  { key: "tipo", header: "Tipo" },
  {
    key: "fechaGeneracion",
    header: "Generado",
    render: (item) => formatDate(item.fechaGeneracion),
  },
]

export function ReporteTable({ data, loading, onRowClick }: ReporteTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      emptyMessage="No hay reportes generados."
      keyExtractor={(item) => item.id}
      onRowClick={onRowClick}
    />
  )
}
