import { DataTable } from "@/components/shared/DataTable"
import type { Column } from "@/components/shared/DataTable"

interface InventarioItem {
  id: number
  producto: string
  categoria: string
  cantidad: number
  unidad: string
}

interface InventarioTableProps {
  data: InventarioItem[]
  loading?: boolean
  onRowClick?: (item: InventarioItem) => void
}

const columns: Column<InventarioItem>[] = [
  { key: "producto", header: "Producto" },
  { key: "categoria", header: "Categoría" },
  { key: "cantidad", header: "Cantidad" },
  { key: "unidad", header: "Unidad" },
]

export function InventarioTable({ data, loading, onRowClick }: InventarioTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      emptyMessage="No hay productos en inventario."
      keyExtractor={(item) => item.id}
      onRowClick={onRowClick}
    />
  )
}
