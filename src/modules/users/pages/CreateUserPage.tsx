import { useNavigate, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { UserForm } from "../components/UserForm"
import { usersService } from "../services/users.service"
import { useNotification } from "@/hooks/useNotification"
import { ArrowLeft } from "lucide-react"

function CreateUserPage() {
  const navigate = useNavigate()
  const { notify } = useNotification()

  const handleSubmit = async (data: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await usersService.create(data as any)
    notify({ type: "success", title: "Usuario creado", message: "Usuario registrado correctamente." })
    navigate("/app/usuarios")
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title="Nuevo Usuario"
        description="Registra un nuevo usuario en el sistema"
        actions={
          <Link to="/app/usuarios">
            <Button variant="outline"><ArrowLeft size={16} />Volver</Button>
          </Link>
        }
      />
      <UserForm onSubmit={handleSubmit} />
    </div>
  )
}

export default CreateUserPage
