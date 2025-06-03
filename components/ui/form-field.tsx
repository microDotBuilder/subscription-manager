"use client"

import type React from "react"

import { forwardRef } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  className?: string
  children?: React.ReactNode
}

export function FormField({ label, error, required, className, children }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium text-neutral-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({ error, className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      className={cn(
        "h-12 border-neutral-200 focus:border-neutral-400 transition-colors",
        error && "border-red-300 focus:border-red-400",
        className,
      )}
      {...props}
    />
  )
})
FormInput.displayName = "FormInput"

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <Textarea
        ref={ref}
        className={cn(
          "border-neutral-200 focus:border-neutral-400 transition-colors resize-none",
          error && "border-red-300 focus:border-red-400",
          className,
        )}
        {...props}
      />
    )
  },
)
FormTextarea.displayName = "FormTextarea"

interface FormSelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  error?: string
  children: React.ReactNode
}

export function FormSelect({ value, onValueChange, placeholder, error, children }: FormSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn(
          "h-12 border-neutral-200 focus:border-neutral-400",
          error && "border-red-300 focus:border-red-400",
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  )
}
