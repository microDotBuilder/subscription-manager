"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, LogOut, Sparkles, Zap } from "lucide-react";
import { DashboardStatsCards } from "@/components/dashboard-stats";
import { SubscriptionCard } from "@/components/subscription-card";
import { SubscriptionForm } from "@/components/subscription-form";
import type { Subscription, DashboardStats } from "@/lib/types";
import { useRouter } from "next/navigation";

interface DashboardClientProps {
  initialStats: DashboardStats;
}

export function DashboardClient({ initialStats }: DashboardClientProps) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("subscriptions")
      .select(
        `
        *,
        categories (*)
      `
      )
      .eq("is_active", true)
      .order("next_payment_date", { ascending: true });

    if (data) {
      setSubscriptions(data);
    }
    setLoading(false);
  };

  const handleEdit = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this subscription?")) {
      const { error } = await supabase
        .from("subscriptions")
        .delete()
        .eq("id", id);

      if (!error) {
        fetchSubscriptions();
        window.location.reload();
      }
    }
  };

  const handleFormSuccess = () => {
    fetchSubscriptions();
    setSelectedSubscription(null);
    window.location.reload();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const handleAddNew = () => {
    setSelectedSubscription(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <header className="glass-effect shadow-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 vibrant-gradient rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gradient tracking-tight">
                SUBSCRIPTION MANAGER
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={handleAddNew}
                className="vibrant-gradient text-white border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Subscription
              </Button>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="border-2 border-slate-200 hover:bg-white/20 transition-all duration-300 rounded-xl"
              >
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
            <Card className="glass-effect border-0 shadow-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-sunset-orange/5 to-cyber-pink/5" />
              <CardHeader className="pb-6 relative z-10">
                <CardTitle className="text-2xl font-bold tracking-tight text-slate-800 flex items-center">
                  <Zap className="w-6 h-6 mr-3 text-sunset-orange" />
                  Upcoming Payments
                </CardTitle>
                <CardDescription className="text-slate-600 text-lg">
                  Payments due in the next 7 days
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
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

          <Card className="glass-effect border-0 shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/5 to-neon-purple/5" />
            <CardHeader className="pb-6 relative z-10">
              <CardTitle className="text-2xl font-bold tracking-tight text-slate-800">
                ALL SUBSCRIPTIONS
              </CardTitle>
              <CardDescription className="text-slate-600 text-lg">
                Manage your active subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              {loading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-purple mx-auto mb-4"></div>
                  <p className="text-slate-600 text-lg">
                    Loading subscriptions...
                  </p>
                </div>
              ) : subscriptions.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-electric-blue/10 to-neon-purple/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Plus className="w-10 h-10 text-neon-purple" />
                  </div>
                  <p className="text-slate-600 mb-8 text-xl">
                    No subscriptions found
                  </p>
                  <Button
                    onClick={handleAddNew}
                    size="lg"
                    className="vibrant-gradient text-white border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-xl text-lg px-8 py-4"
                  >
                    <Plus className="h-5 w-5 mr-2" />
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
  );
}
