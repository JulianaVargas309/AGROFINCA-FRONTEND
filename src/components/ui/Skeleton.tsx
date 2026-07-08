import { cn } from "@/utils/cn"

type SkeletonVariant = "text" | "card" | "table" | "circle"

interface SkeletonProps {
  variant?: SkeletonVariant
  className?: string
  lines?: number
}

function Skeleton({ variant = "text", className, lines = 3 }: SkeletonProps) {
  if (variant === "card") {
    return (
      <div className={cn("animate-pulse rounded-xl border border-stone-200 p-5", className)}>
        <div className="h-4 w-3/4 rounded bg-stone-200" />
        <div className="mt-3 h-3 w-full rounded bg-stone-100" />
        <div className="mt-2 h-3 w-5/6 rounded bg-stone-100" />
        <div className="mt-4 h-8 w-24 rounded-lg bg-stone-200" />
      </div>
    )
  }

  if (variant === "table") {
    return (
      <div className={cn("animate-pulse rounded-lg border border-stone-200", className)}>
        <div className="border-b border-stone-100 bg-stone-50 px-4 py-3">
          <div className="h-4 w-full rounded bg-stone-200" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-b border-stone-100 px-4 py-3">
            <div className="h-4 w-full rounded bg-stone-100" />
          </div>
        ))}
      </div>
    )
  }

  if (variant === "circle") {
    return (
      <div
        className={cn(
          "animate-pulse rounded-full bg-stone-200",
          className,
        )}
      />
    )
  }

  return (
    <div className={cn("animate-pulse space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn("h-3 rounded bg-stone-200", i === lines - 1 ? "w-4/5" : "w-full")}
        />
      ))}
    </div>
  )
}

export { Skeleton }
export type { SkeletonProps, SkeletonVariant }
