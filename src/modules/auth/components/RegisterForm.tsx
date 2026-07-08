import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, Link } from "react-router-dom"
import { IdCard } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { registerSchema, type RegisterInput } from "../schemas/register.schema"
import { useRegister } from "../hooks/useRegister"
import { ROLES_LIST } from "@/constants/roles"

function RegisterForm() {
  const navigate = useNavigate()
  const { register: registerUser, loading, error, clearError } = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(registerSchema) as any,
    defaultValues: { documento: "", rol: "FAMILIAR" },
  })

  const onSubmit = async (data: RegisterInput) => {
    clearError()
    try {
      await registerUser(data)
      navigate("/app/dashboard", { replace: true })
    } catch {
      // error manejado en useRegister
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <Alert severity="error" onClose={clearError}>
          {error}
        </Alert>
      )}

      <Input
        label="Usuario"
        placeholder="Número de documento"
        autoComplete="off"
        icon={<IdCard size={18} />}
        error={errors.documento?.message}
        {...register("documento")}
      />

      <Select
        label="Rol"
        options={ROLES_LIST}
        error={errors.rol?.message}
        {...register("rol")}
      />

      <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
        Crear Cuenta
      </Button>

      <p className="text-center text-sm text-stone-500">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="font-medium text-emerald-700 hover:text-emerald-800">
          Iniciar Sesión
        </Link>
      </p>
    </form>
  )
}

export { RegisterForm }
