import { Link } from "react-router-dom"
import { DataTable } from "@/components/shared/DataTable"
import type { Column } from "@/components/shared/DataTable"
import { Badge } from "@/components/ui/Badge"
import { UserStatus } from "./UserStatus"
import { formatDate } from "@/utils/formatDate"
import type { User } from "../types/user.types"

interface UserTableProps {
  users: User[]
  loading: boolean
  renderActions: (user: User) => React.ReactNode
}

function UserTable({ users, loading, renderActions }: UserTableProps) {
  const columns: Column<User>[] = [
    {
      key: "nombre",
      header: "Nombre",
      render: (item) => (
        <Link
          to={`/app/usuarios/${item.id}`}
          className="font-medium text-emerald-700 hover:text-emerald-800"
        >
          {item.nombre} {item.apellido || ""}
        </Link>
      ),
    },
    { key: "documento", header: "Documento" },
    {
      key: "rol",
      header: "Rol",
      render: (item) => (
        <Badge color={item.rol === "ADMIN" ? "error" : item.rol === "FAMILIAR" ? "info" : item.rol === "TRABAJADOR" ? "warning" : "default"}>
          {item.rol}
        </Badge>
      ),
    },
    {
      key: "activo",
      header: "Estado",
      render: (item) => <UserStatus activo={item.activo} />,
    },
    {
      key: "ultimoAcceso",
      header: "Último acceso",
      render: (item) => (item.ultimoAcceso ? formatDate(item.ultimoAcceso) : "-"),
    },
    {
      key: "acciones",
      header: "",
      className: "w-[100px]",
      render: (item) => renderActions(item),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={users}
      loading={loading}
      emptyMessage="No hay usuarios registrados."
      keyExtractor={(item) => item.id}
    />
  )
}

export { UserTable }
