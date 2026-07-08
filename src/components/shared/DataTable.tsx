import type { ReactNode } from "react"
import { Table, Thead, Tbody, Th, Td } from "@/components/ui/Table"
import { EmptyState } from "./EmptyState"
import { Spinner } from "@/components/ui/Spinner"

interface Column<T> {
  key: string
  header: string
  render?: (item: T) => ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  keyExtractor: (item: T) => string | number
  onRowClick?: (item: T) => void
}

function DataTable<T>({
  columns,
  data,
  loading,
  emptyMessage,
  keyExtractor,
  onRowClick,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    )
  }

  if (data.length === 0) {
    return <EmptyState description={emptyMessage ?? "No hay datos disponibles."} />
  }

  return (
    <Table striped hoverable>
      <Thead>
        <tr>
          {columns.map((col) => (
            <Th key={col.key} className={col.className}>
              {col.header}
            </Th>
          ))}
        </tr>
      </Thead>
      <Tbody>
        {data.map((item) => (
          <tr
            key={keyExtractor(item)}
            onClick={onRowClick ? () => onRowClick(item) : undefined}
            className={onRowClick ? "cursor-pointer" : ""}
          >
            {columns.map((col) => (
              <Td key={col.key} className={col.className}>
                {col.render
                  ? col.render(item)
                  : String((item as Record<string, unknown>)[col.key] ?? "")}
              </Td>
            ))}
          </tr>
        ))}
      </Tbody>
    </Table>
  )
}

export { DataTable }
export type { DataTableProps, Column }
