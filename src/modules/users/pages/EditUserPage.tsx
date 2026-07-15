import { useParams, useNavigate, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { Spinner } from "@/components/ui/Spinner"
import { UserForm } from "../components/UserForm"
import { useUser } from "../hooks/useUser"
import { usersService } from "../services/users.service"
import { useNotification } from "@/hooks/useNotification"
import { ArrowLeft } from "lucide-react"

function EditUserPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { notify } = useNotification()
  const { user, loading, error } = useUser(id ? Number(id) : null)

  if (loading) return <Spinner />
  if (error) return <Alert severity="error">{error}</Alert>
  if (!user) return <Alert severity="info">Usuario no encontrado</Alert>

  const handleSubmit = async (_data: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await usersService.update(user.id, _data as any)
    notify({ type: "success", title: "Usuario actualizado", message: "Cambios guardados correctamente." })
    navigate(`/app/usuarios/${user.id}`)
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title={`Editar: ${user.nombre}`}
        description="Actualiza la información del usuario"
        actions={
          <Link to={`/app/usuarios/${user.id}`}>
            <Button variant="outline"><ArrowLeft size={16} />Volver</Button>
          </Link>
        }
      />
      <UserForm
        isEdit
        defaultValues={{
          nombre: user.nombre,
          apellido: user.apellido || "",
          correo: user.correo || "",
          telefono: user.telefono || "",
          rol: user.rol,
        }}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default EditUserPage
