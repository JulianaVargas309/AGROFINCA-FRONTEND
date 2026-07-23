import { forwardRef } from "react"
import { Checkbox } from "@/components/ui/Checkbox"
import type { CheckboxProps } from "@/components/ui/Checkbox"

const FormCheckbox = forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
  return <Checkbox ref={ref} {...props} />
})

FormCheckbox.displayName = "FormCheckbox"

export { FormCheckbox }
