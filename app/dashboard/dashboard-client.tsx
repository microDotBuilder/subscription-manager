"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, LogOut, Sparkles } from "lucide-react"
import { DashboardStatsCards } from "@/components/dashboard-stats"
import { SubscriptionCard } from "@/components/subscription-card"
import { SubscriptionForm } from "@/components/subscription-form"
import type { Subscription, DashboardStats } from "@/lib/types"
import { useRouter } from "next/navigation"

interface DashboardClientProps {
  initialStats: DashboardStats
}

export function DashboardClient({ initialStats }: DashboardClientProps) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [stats, setStats] = useState<DashboardStats>(initialStats)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    setLoading(true)
    const { data } = await supabase
      .from("subscriptions")
      .select(`
        *,
        categories (*)
      `)
      .eq("is_active", true)
      .order("next_payment_date", { ascending: true })

    if (data) {
      setSubscriptions(data)
    }
    setLoading(false)
  }

  const handleEdit = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this subscription?")) {
      const { error } = await supabase.from("subscriptions").delete().eq("id", id)

      if (!error) {
        fetchSubscriptions()
        window.location.reload()
      }
    }
  }

  const handleFormSuccess = () => {
    fetchSubscriptions()
    setSelectedSubscription(null)
    window.location.reload()
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const handleAddNew = () => {
    setSelectedSubscription(null)
    setShowForm(true)
  }

  return (
    <div className="min-h-screen gradient-bg">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-neutral-200/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Subscription Manager</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={handleAddNew} className="shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="h-4 w-4 mr-2" />
                Add Subscription
              </Button>
              <Button variant="outline" onClick={handleSignOut} className="border-neutral-200">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="space-y-8 animate-fade-in">
          <DashboardStatsCards stats={stats} />

          {stats.upcomingPayments.length > 0 && (
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl font-semibold tracking-tight text-neutral-900">
                  Upcoming Payments
                </CardTitle>
                <CardDescription className="text-neutral-600">Payments due in the next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {stats.upcomingPayments.map((subscription) => (
                    <SubscriptionCard
                      key={subscription.id}
                      subscription={subscription}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-semibold tracking-tight text-neutral-900">All Subscriptions</CardTitle>
              <CardDescription className="text-neutral-600">Manage your active subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 mx-auto"></div>
                  <p className="text-neutral-600 mt-4">Loading subscriptions...</p>
                </div>
              ) : subscriptions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-neutral-400" />
                  </div>
                  <p className="text-neutral-600 mb-6 text-lg">No subscriptions found</p>
                  <Button
                    onClick={handleAddNew}
                    size="lg"
                    className="shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Subscription
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {subscriptions.map((subscription) => (
                    <SubscriptionCard
                      key={subscription.id}
                      subscription={subscription}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <SubscriptionForm
        subscription={selectedSubscription}
        open={showForm}
        onOpenChange={setShowForm}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
}
