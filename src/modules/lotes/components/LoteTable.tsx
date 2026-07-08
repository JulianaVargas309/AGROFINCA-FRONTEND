import { DataTable } from "@/components/shared/DataTable"
import type { Column } from "@/components/shared/DataTable"

interface Lote {
  id: number
  nombre: string
  cultivo: string
  hectarea: number
}

interface LoteTableProps {
  data: Lote[]
  loading?: boolean
  onRowClick?: (item: Lote) => void
}

const columns: Column<Lote>[] = [
  { key: "nombre", header: "Nombre" },
  { key: "cultivo", header: "Cultivo" },
  { key: "hectarea", header: "Hectárea" },
]

export function LoteTable({ data, loading, onRowClick }: LoteTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      emptyMessage="No hay lotes registrados."
      keyExtractor={(item) => item.id}
      onRowClick={onRowClick}
    />
  )
}
