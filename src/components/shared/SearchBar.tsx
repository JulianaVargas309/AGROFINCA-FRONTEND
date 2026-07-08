import { Search, X } from "lucide-react"
import { type ChangeEvent, useState, useCallback } from "react"
import { useDebounce } from "@/hooks/useDebounce"
import { useEffect } from "react"

interface SearchBarProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  debounceMs?: number
}

function SearchBar({
  value: controlledValue,
  onChange,
  placeholder = "Buscar...",
  debounceMs = 300,
}: SearchBarProps) {
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState("")
  const localValue = isControlled ? controlledValue : internalValue
  const debouncedValue = useDebounce(isControlled ? controlledValue : internalValue, debounceMs)

  useEffect(() => {
    onChange(debouncedValue)
  }, [debouncedValue, onChange])

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (isControlled) {
      onChange(e.target.value)
    } else {
      setInternalValue(e.target.value)
    }
  }, [isControlled, onChange])

  const handleClear = useCallback(() => {
    if (isControlled) {
      onChange("")
    } else {
      setInternalValue("")
    }
    onChange("")
  }, [isControlled, onChange])

  return (
    <div className="relative">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
      />
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-stone-300 bg-white py-2 pl-10 pr-9 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}

export { SearchBar }
export type { SearchBarProps }
