import { DataTable } from "@/components/shared/DataTable"
import { formatCurrency } from "@/utils/formatCurrency"
import { formatDate } from "@/utils/formatDate"
import type { Column } from "@/components/shared/DataTable"

interface FinanzaItem {
  id: number
  concepto: string
  monto: number
  tipo: string
  fecha: string
}

interface FinanzaTableProps {
  data: FinanzaItem[]
  loading?: boolean
  onRowClick?: (item: FinanzaItem) => void
}

const columns: Column<FinanzaItem>[] = [
  { key: "concepto", header: "Concepto" },
  {
    key: "monto",
    header: "Monto",
    render: (item) => (
      <span className={item.tipo === "ingreso" ? "text-emerald-600" : "text-red-600"}>
        {item.tipo === "ingreso" ? "+" : "-"}
        {formatCurrency(item.monto)}
      </span>
    ),
  },
  { key: "tipo", header: "Tipo" },
  {
    key: "fecha",
    header: "Fecha",
    render: (item) => formatDate(item.fecha),
  },
]

export function FinanzaTable({ data, loading, onRowClick }: FinanzaTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      emptyMessage="No hay registros financieros."
      keyExtractor={(item) => item.id}
      onRowClick={onRowClick}
    />
  )
}
