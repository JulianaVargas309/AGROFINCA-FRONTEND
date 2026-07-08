type ClassValue = string | number | boolean | null | undefined | ClassValue[]

function toVal(mix: ClassValue): string {
  let k: number
  let y: string
  let str = ""

  if (typeof mix === "string" || typeof mix === "number") {
    str += mix
  } else if (typeof mix === "object") {
    if (Array.isArray(mix)) {
      for (k = 0; k < mix.length; k++) {
        if (mix[k]) {
          const x = toVal(mix[k])
          if (x) {
            y = str ? " " : ""
            str += y + x
          }
        }
      }
    }
  }

  return str
}

export function cn(...inputs: ClassValue[]): string {
  let i = 0
  let tmp: ClassValue
  let x: string
  let str = ""

  while (i < inputs.length) {
    tmp = inputs[i++]
    if (tmp) {
      x = toVal(tmp)
      if (x) {
        const y = str ? " " : ""
        str += y + x
      }
    }
  }

  return str
}
