import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/Button"

type BackVariant = "primary" | "secondary" | "outline" | "ghost" | "danger"
type BackSize = "sm" | "md" | "lg"

interface BackButtonProps {
  to?: string
  variant?: BackVariant
  size?: BackSize
  children?: string
}

export function BackButton({ to, variant = "outline", size = "sm", children = "Volver" }: BackButtonProps) {
  const navigate = useNavigate()

  if (to) {
    return (
      <Link to={to}>
        <Button variant={variant} size={size}>
          <ArrowLeft size={size === "sm" ? 14 : 16} />
          {children}
        </Button>
      </Link>
    )
  }

  return (
    <Button variant={variant} size={size} onClick={() => navigate(-1)}>
      <ArrowLeft size={size === "sm" ? 14 : 16} />
      {children}
    </Button>
  )
}