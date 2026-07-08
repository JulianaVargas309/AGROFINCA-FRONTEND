import { Link, useLocation } from "react-router-dom"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/utils/cn"
import { capitalize } from "@/utils/capitalize"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  className?: string
}

function Breadcrumb({ items, className }: BreadcrumbProps) {
  const location = useLocation()

  const resolvedItems: BreadcrumbItem[] = items && items.length > 0
    ? items
    : location.pathname.split("/").filter(Boolean).map((segment, index, segments) => ({
        label: capitalize(segment.replace(/-/g, " ")),
        href: "/" + segments.slice(0, index + 1).join("/"),
      }))

  return (
    <nav className={cn("flex items-center gap-1 text-sm", className)}>
      <Link
        to="/app/dashboard"
        className="text-stone-400 hover:text-stone-600"
      >
        <Home size={14} />
      </Link>
      {resolvedItems.map((item, index) => (
        <div key={item.label} className="flex items-center gap-1">
          <ChevronRight size={12} className="text-stone-300" />
          {index === resolvedItems.length - 1 ? (
            <span className="text-stone-600 font-medium">{item.label}</span>
          ) : item.href ? (
            <Link to={item.href} className="text-stone-400 hover:text-stone-600">
              {item.label}
            </Link>
          ) : (
            <span className="text-stone-400">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}

export { Breadcrumb }
export type { BreadcrumbProps, BreadcrumbItem }
