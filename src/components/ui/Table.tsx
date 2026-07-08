import { cn } from "@/utils/cn"
import type { ReactNode, HTMLAttributes } from "react"

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  striped?: boolean
  hoverable?: boolean
  children: ReactNode
}

function Table({ striped, hoverable, className, children, ...props }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-stone-200">
      <table
        className={cn(
          "w-full text-left text-sm",
          striped && "[&_tbody_tr:nth-child(even)]:bg-stone-50",
          hoverable && "[&_tbody_tr:hover]:bg-stone-100",
          className,
        )}
        {...props}
      >
        {children}
      </table>
    </div>
  )
}

const Th = ({ className, children, ...props }: HTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={cn(
      "border-b border-stone-200 bg-stone-50 px-4 py-3 font-semibold text-stone-700",
      className,
    )}
    {...props}
  >
    {children}
  </th>
)

const Td = ({ className, children, ...props }: HTMLAttributes<HTMLTableCellElement>) => (
  <td
    className={cn("border-b border-stone-100 px-4 py-3 text-stone-600", className)}
    {...props}
  >
    {children}
  </td>
)

const Thead = ({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={className} {...props}>{children}</thead>
)

const Tbody = ({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={className} {...props}>{children}</tbody>
)

export { Table, Th, Td, Thead, Tbody }
export type { TableProps }
