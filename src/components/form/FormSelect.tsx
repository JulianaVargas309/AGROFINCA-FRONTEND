import { forwardRef } from "react"
import { Select } from "@/components/ui/Select"
import type { SelectProps } from "@/components/ui/Select"

const FormSelect = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  return <Select ref={ref} {...props} />
})

FormSelect.displayName = "FormSelect"

export { FormSelect }
