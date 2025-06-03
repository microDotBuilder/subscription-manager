import { requireAuth } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase/server";
import { DashboardClient } from "./dashboard-client";
import type { DashboardStats } from "@/lib/types";

async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const supabase = await createServerClient();

  // Get all active subscriptions with categories
  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select(
      `
      *,
      categories (*)
    `
    )
    .eq("user_id", userId)
    .eq("is_active", true);

  if (!subscriptions) {
    return {
      totalMonthlySpending: 0,
      totalActiveSubscriptions: 0,
      upcomingPayments: [],
      categoryBreakdown: [],
    };
  }

  // Calculate monthly spending
  const totalMonthlySpending = subscriptions.reduce((total, sub) => {
    let monthlyCost = sub.cost;
    switch (sub.billing_cycle) {
      case "weekly":
        monthlyCost = sub.cost * 4.33;
        break;
      case "quarterly":
        monthlyCost = sub.cost / 3;
        break;
      case "yearly":
        monthlyCost = sub.cost / 12;
        break;
    }
    return total + monthlyCost;
  }, 0);

  // Get upcoming payments (next 7 days)
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const upcomingPayments = subscriptions.filter((sub) => {
    const paymentDate = new Date(sub.next_payment_date);
    return paymentDate >= today && paymentDate <= nextWeek;
  });

  // Category breakdown
  const categoryMap = new Map();
  subscriptions.forEach((sub) => {
    const categoryName = sub.categories?.name || "Uncategorized";
    const categoryColor = sub.categories?.color || "#6b7280";
    let monthlyCost = sub.cost;

    switch (sub.billing_cycle) {
      case "weekly":
        monthlyCost = sub.cost * 4.33;
        break;
      case "quarterly":
        monthlyCost = sub.cost / 3;
        break;
      case "yearly":
        monthlyCost = sub.cost / 12;
        break;
    }

    if (categoryMap.has(categoryName)) {
      categoryMap.set(categoryName, {
        ...categoryMap.get(categoryName),
        amount: categoryMap.get(categoryName).amount + monthlyCost,
      });
    } else {
      categoryMap.set(categoryName, {
        category: categoryName,
        amount: monthlyCost,
        color: categoryColor,
      });
    }
  });

  return {
    totalMonthlySpending,
    totalActiveSubscriptions: subscriptions.length,
    upcomingPayments,
    categoryBreakdown: Array.from(categoryMap.values()),
  };
}

export default async function DashboardPage() {
  const user = await requireAuth();
  const stats = await getDashboardStats(user.id);

  return <DashboardClient initialStats={stats} />;
}
