import type { FieldError, FieldErrors } from "react-hook-form"

export function getFieldError(errors: FieldErrors, fieldName: string): string | undefined {
  const error = errors[fieldName] as FieldError | undefined
  return error?.message
}

export function hasFormErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0
}

export function getFormErrorCount(errors: FieldErrors): number {
  return Object.keys(errors).length
}

export function scrollToFirstError(errors: FieldErrors) {
  const firstErrorField = Object.keys(errors)[0]
  if (firstErrorField) {
    const element = document.querySelector(`[name="${firstErrorField}"]`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
      ;(element as HTMLElement).focus()
    }
  }
}

export function formatValidationError(error: any): string {
  if (typeof error === "string") return error
  if (error?.message) return error.message
  return "Invalid input"
}
