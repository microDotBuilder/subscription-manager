import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, CreditCard, Calendar, TrendingUp } from "lucide-react"
import type { DashboardStats } from "@/lib/types"

interface DashboardStatsProps {
  stats: DashboardStats
}

export function DashboardStatsCards({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: "Monthly Spending",
      value: `$${stats.totalMonthlySpending.toFixed(2)}`,
      description: "Total monthly subscription costs",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Active Subscriptions",
      value: stats.totalActiveSubscriptions.toString(),
      description: "Currently active services",
      icon: CreditCard,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Upcoming Payments",
      value: stats.upcomingPayments.length.toString(),
      description: "Due in next 7 days",
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Categories",
      value: stats.categoryBreakdown.length.toString(),
      description: "Different service types",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="card-hover border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-neutral-600 tracking-tight">{stat.title}</CardTitle>
            <div className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold tracking-tight text-neutral-900 mb-1">{stat.value}</div>
            <p className="text-sm text-neutral-500">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
