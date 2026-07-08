import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { PerfilForm } from "../components/PerfilForm"
import { useAuth } from "@/hooks/useAuth"
import { ROLES } from "@/constants/roles"
import { formatDate } from "@/utils/formatDate"
import { User, Shield, Calendar, IdCard } from "lucide-react"

function PerfilPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title="Perfil" description="Gestión de tu cuenta" />

      {user && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <div className="flex items-center gap-2 text-stone-500 mb-1"><User size={16} /><span className="text-xs font-medium">Usuario</span></div>
            <p className="text-sm font-semibold text-stone-900">{user.nombre ?? user.documento}</p>
          </Card>
          <Card>
            <div className="flex items-center gap-2 text-stone-500 mb-1"><IdCard size={16} /><span className="text-xs font-medium">Documento</span></div>
            <p className="text-sm font-semibold text-stone-900 truncate">{user.documento}</p>
          </Card>
          <Card>
            <div className="flex items-center gap-2 text-stone-500 mb-1"><Shield size={16} /><span className="text-xs font-medium">Rol</span></div>
            <Badge color={user.rol === "ADMIN" ? "error" : user.rol === "FAMILIAR" ? "info" : "default"}>{ROLES[user.rol] || user.rol}</Badge>
          </Card>
          <Card>
            <div className="flex items-center gap-2 text-stone-500 mb-1"><Calendar size={16} /><span className="text-xs font-medium">Miembro desde</span></div>
            <p className="text-sm text-stone-700">{user.createdAt ? formatDate(user.createdAt) : "-"}</p>
          </Card>
        </div>
      )}

      <PerfilForm />
    </div>
  )
}

export default PerfilPage
