import { Bell } from "lucide-react"
import { cn } from "@/utils/cn"

interface NotificationBellProps {
  count?: number
  onClick?: () => void
  className?: string
}

function NotificationBell({ count = 0, onClick, className }: NotificationBellProps) {
  return (
    <button
      onClick={onClick}
      className={cn("relative rounded-lg p-2 text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer", className)}
    >
      <Bell size={20} />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  )
}

export { NotificationBell }
export type { NotificationBellProps }
