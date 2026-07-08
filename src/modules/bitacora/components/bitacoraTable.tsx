import { DataTable } from "@/components/shared/DataTable"
import { formatRelativeDate } from "@/utils/formatDate"
import type { Column } from "@/components/shared/DataTable"

interface BitacoraItem {
  id: number
  actividad: string
  fecha: string
  responsable: string
}

interface BitacoraTableProps {
  data: BitacoraItem[]
  loading?: boolean
  onRowClick?: (item: BitacoraItem) => void
}

const columns: Column<BitacoraItem>[] = [
  { key: "actividad", header: "Actividad" },
  {
    key: "fecha",
    header: "Fecha",
    render: (item) => formatRelativeDate(item.fecha),
  },
  { key: "responsable", header: "Responsable" },
]

export function BitacoraTable({ data, loading, onRowClick }: BitacoraTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      emptyMessage="No hay registros en la bitácora."
      keyExtractor={(item) => item.id}
      onRowClick={onRowClick}
    />
  )
}
