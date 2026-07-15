import { Select } from "@/components/ui/Select"
import type { Option } from "@/types"

interface UserFiltersProps {
  rol: string
  onRolChange: (rol: string) => void
  estado: string
  onEstadoChange: (estado: string) => void
}

const rolOptions: Option[] = [
  { value: "", label: "Todos los roles" },
  { value: "ADMIN", label: "Admin" },
  { value: "FAMILIAR", label: "Familiar" },
  { value: "CONSULTA", label: "Consulta" },
]

const estadoOptions: Option[] = [
  { value: "", label: "Todos los estados" },
  { value: "activo", label: "Activo" },
  { value: "inactivo", label: "Inactivo" },
]

function UserFilters({ rol, onRolChange, estado, onEstadoChange }: UserFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="w-44">
        <Select
          options={rolOptions}
          value={rol}
          onChange={(e) => onRolChange(e.target.value)}
        />
      </div>
      <div className="w-44">
        <Select
          options={estadoOptions}
          value={estado}
          onChange={(e) => onEstadoChange(e.target.value)}
        />
      </div>
    </div>
  )
}

export { UserFilters }
