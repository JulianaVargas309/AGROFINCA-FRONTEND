import { DataTable } from "@/components/shared/DataTable"
import type { Column } from "@/components/shared/DataTable"

interface Finca {
  id: number
  nombre: string
  ubicacion: string
  hectareas: number
}

interface FincaTableProps {
  data: Finca[]
  loading?: boolean
  onRowClick?: (item: Finca) => void
}

const columns: Column<Finca>[] = [
  { key: "nombre", header: "Nombre" },
  { key: "ubicacion", header: "Ubicación" },
  { key: "hectareas", header: "Hectáreas" },
]

export function FincaTable({ data, loading, onRowClick }: FincaTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      emptyMessage="No hay fincas registradas."
      keyExtractor={(item) => item.id}
      onRowClick={onRowClick}
    />
  )
}
