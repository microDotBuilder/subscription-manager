"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, ExternalLink, AlertCircle } from "lucide-react"
import type { Subscription } from "@/lib/types"
import { format } from "date-fns"

interface SubscriptionCardProps {
  subscription: Subscription
  onEdit: (subscription: Subscription) => void
  onDelete: (id: string) => void
}

export function SubscriptionCard({ subscription, onEdit, onDelete }: SubscriptionCardProps) {
  const getBillingCycleColor = (cycle: string) => {
    switch (cycle) {
      case "monthly":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "yearly":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "weekly":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "quarterly":
        return "bg-orange-50 text-orange-700 border-orange-200"
      default:
        return "bg-neutral-50 text-neutral-700 border-neutral-200"
    }
  }

  const isUpcoming = () => {
    const today = new Date()
    const paymentDate = new Date(subscription.next_payment_date)
    const diffTime = paymentDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays >= 0
  }

  return (
    <Card
      className={`card-hover border-0 shadow-lg bg-white/90 backdrop-blur-sm relative overflow-hidden ${
        isUpcoming() ? "ring-2 ring-orange-200 ring-offset-2" : ""
      }`}
    >
      {isUpcoming() && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-red-400" />
      )}

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg font-semibold tracking-tight text-neutral-900">{subscription.name}</CardTitle>
            <CardDescription className="text-neutral-600">
              {subscription.categories?.name || "Uncategorized"}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-neutral-100">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEdit(subscription)} className="cursor-pointer">
                <Edit className="h-4 w-4 mr-2" />
                Edit subscription
              </DropdownMenuItem>
              {subscription.website_url && (
                <DropdownMenuItem asChild>
                  <a
                    href={subscription.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit website
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => onDelete(subscription.id)}
                className="text-red-600 cursor-pointer focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete subscription
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold tracking-tight text-neutral-900">${subscription.cost}</span>
          <Badge variant="outline" className={`font-medium ${getBillingCycleColor(subscription.billing_cycle)}`}>
            {subscription.billing_cycle}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="text-sm text-neutral-600">
            <span className="font-medium">Next payment:</span>{" "}
            {format(new Date(subscription.next_payment_date), "MMM dd, yyyy")}
          </div>

          {isUpcoming() && (
            <div className="flex items-center gap-2 text-sm text-orange-700 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
              <AlertCircle className="w-4 h-4" />
              Payment due soon
            </div>
          )}

          {subscription.description && (
            <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed">{subscription.description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
