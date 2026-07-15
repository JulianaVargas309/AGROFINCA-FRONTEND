import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { UserStatus } from "./UserStatus"
import { formatDate } from "@/utils/formatDate"
import { User, IdCard, Mail, Phone, Shield, Calendar, Clock } from "lucide-react"
import type { User as UserType } from "../types/user.types"

interface UserCardProps {
  user: UserType
}

function UserCard({ user }: UserCardProps) {
  const infoItems = [
    { label: "Nombre", value: `${user.nombre} ${user.apellido || ""}`, icon: User },
    { label: "Documento", value: user.documento, icon: IdCard },
    { label: "Correo", value: user.correo || "-", icon: Mail },
    { label: "Teléfono", value: user.telefono || "-", icon: Phone },
    { label: "Rol", value: <Badge color={user.rol === "ADMIN" ? "error" : user.rol === "FAMILIAR" ? "info" : "default"}>{user.rol}</Badge>, icon: Shield },
    { label: "Estado", value: <UserStatus activo={user.activo} />, icon: Shield },
    { label: "Creado", value: formatDate(user.createdAt), icon: Calendar },
    { label: "Último acceso", value: user.ultimoAcceso ? formatDate(user.ultimoAcceso) : "-", icon: Clock },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {infoItems.map((item) => (
        <Card key={item.label}>
          <div className="flex items-center gap-2 text-stone-500 mb-1">
            <item.icon size={16} />
            <span className="text-xs font-medium">{item.label}</span>
          </div>
          <div className="text-sm font-semibold text-stone-900">{item.value}</div>
        </Card>
      ))}
    </div>
  )
}

export { UserCard }
