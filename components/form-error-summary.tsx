import { AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface FormErrorSummaryProps {
  errors: Record<string, any>
  title?: string
}

export function FormErrorSummary({ errors, title = "Please fix the following errors:" }: FormErrorSummaryProps) {
  const errorMessages = Object.values(errors)
    .filter(Boolean)
    .map((error: any) => error.message)
    .filter(Boolean)

  if (errorMessages.length === 0) return null

  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-red-800">{title}</h4>
            <ul className="text-sm text-red-700 space-y-1">
              {errorMessages.map((message, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-600 rounded-full flex-shrink-0" />
                  {message}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
