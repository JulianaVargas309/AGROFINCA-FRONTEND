import { forwardRef } from "react"
import { Textarea } from "@/components/ui/Textarea"
import type { TextareaProps } from "@/components/ui/Textarea"

const FormTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
  return <Textarea ref={ref} {...props} />
})

FormTextarea.displayName = "FormTextarea"

export { FormTextarea }
