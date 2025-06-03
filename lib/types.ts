export interface Category {
  id: string
  name: string
  color: string
  icon: string
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  name: string
  cost: number
  billing_cycle: "monthly" | "yearly" | "weekly" | "quarterly"
  next_payment_date: string
  category_id: string | null
  description: string | null
  website_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  categories?: Category
}

export interface DashboardStats {
  totalMonthlySpending: number
  totalActiveSubscriptions: number
  upcomingPayments: Subscription[]
  categoryBreakdown: { category: string; amount: number; color: string }[]
}
