import { Badge } from "@/components/ui/Badge"

interface UserStatusProps {
  activo: boolean
}

function UserStatus({ activo }: UserStatusProps) {
  return (
    <Badge color={activo ? "success" : "default"}>
      {activo ? "Activo" : "Inactivo"}
    </Badge>
  )
}

export { UserStatus }
