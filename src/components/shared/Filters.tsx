import { X } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Select } from "@/components/ui/Select"
import { Input } from "@/components/ui/Input"
import type { ReactNode, ChangeEvent } from "react"

interface FilterItem {
  key: string
  label: string
  type: "text" | "select"
  value: string
  options?: { value: string; label: string }[]
  placeholder?: string
}

interface FiltersProps {
  filters: FilterItem[]
  onChange: (key: string, value: string) => void
  onClear: () => void
  className?: string
  children?: ReactNode
}

function Filters({ filters, onChange, onClear, className, children }: FiltersProps) {
  const hasFilters = filters.some((f) => f.value)

  return (
    <div className={`flex flex-wrap items-end gap-3 ${className ?? ""}`}>
      {filters.map((filter) =>
        filter.type === "select" ? (
          <Select
            key={filter.key}
            label={filter.label}
            options={filter.options ?? []}
            value={filter.value}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(filter.key, e.target.value)}
            placeholder={filter.placeholder ?? "Todos"}
            className="min-w-[180px]"
          />
        ) : (
          <Input
            key={filter.key}
            label={filter.label}
            value={filter.value}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(filter.key, e.target.value)}
            placeholder={filter.placeholder}
            className="min-w-[200px]"
          />
        ),
      )}
      {children}
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X size={14} />
          Limpiar
        </Button>
      )}
    </div>
  )
}

export { Filters }
export type { FiltersProps, FilterItem }
