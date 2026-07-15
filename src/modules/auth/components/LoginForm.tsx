import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, Link } from "react-router-dom"
import { IdCard, Lock, LogIn } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { loginSchema, type LoginInput } from "../schemas/login.schema"
import { useLogin } from "../hooks/useAuth"

function LoginForm() {
  const navigate = useNavigate()
  const { login, loading, error, clearError } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { documento: "", password: "" },
  })

  const onSubmit = async (data: LoginInput) => {
    clearError()
    try {
      await login(data)
      navigate("/app/dashboard", { replace: true })
    } catch {
      // error ya manejado por useLogin (Alert visible)
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
        placeholder="Tu usuario"
        autoComplete="username"
        icon={<IdCard size={18} />}
        error={errors.documento?.message}
        {...register("documento")}
      />

      <div>
        <Input
          label="Contraseña"
          type="password"
          placeholder="Tu contraseña"
          autoComplete="current-password"
          icon={<Lock size={18} />}
          error={errors.password?.message}
          {...register("password")}
        />
        <div className="mt-1 text-right">
                          <Link to="/recuperar-password" className="text-xs text-emerald-700 hover:text-emerald-800">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        loading={loading}
        icon={!loading ? <LogIn size={18} /> : undefined}
      >
        Iniciar Sesión
      </Button>

      <p className="text-center text-sm text-stone-500">
        ¿No tienes cuenta?{" "}
        <Link to="/register" className="font-medium text-emerald-700 hover:text-emerald-800">
          Registrarse
        </Link>
      </p>
    </form>
  )
}

export { LoginForm }
