import { forwardRef } from "react"
import { Input } from "@/components/ui/Input"
import type { InputProps } from "@/components/ui/Input"

const FormInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <Input ref={ref} {...props} />
})

FormInput.displayName = "FormInput"

export { FormInput }
