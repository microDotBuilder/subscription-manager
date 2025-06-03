import { getUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, DollarSign, Calendar, Shield, ArrowRight, Sparkles } from "lucide-react"

export default async function HomePage() {
  const user = await getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen gradient-bg">
      <header className="container mx-auto px-6 py-8">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">SubManager</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/auth/login">
              <Button variant="ghost" className="font-medium">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="font-medium shadow-lg hover:shadow-xl transition-all duration-200">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 bg-neutral-100 rounded-full text-sm font-medium text-neutral-700 mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            Modern subscription management
          </div>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 mb-6 leading-tight">
            Take Control of Your
            <br />
            <span className="bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent">
              Subscriptions
            </span>
          </h2>
          <p className="text-xl text-neutral-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Track, manage, and optimize all your recurring payments in one beautifully designed dashboard. Never miss a
            payment or lose track of your spending again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-200">
                Start Managing Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 font-medium">
              View Demo
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            {
              icon: CreditCard,
              title: "Smart Tracking",
              description: "Organize subscriptions with intelligent categorization and detailed insights.",
              color: "text-blue-600",
              bgColor: "bg-blue-50",
            },
            {
              icon: DollarSign,
              title: "Spending Analytics",
              description: "Visualize your spending patterns and discover optimization opportunities.",
              color: "text-emerald-600",
              bgColor: "bg-emerald-50",
            },
            {
              icon: Calendar,
              title: "Smart Reminders",
              description: "Never miss a payment with intelligent notifications and alerts.",
              color: "text-purple-600",
              bgColor: "bg-purple-50",
            },
            {
              icon: Shield,
              title: "Bank-Grade Security",
              description: "Your data is protected with enterprise-level encryption and privacy.",
              color: "text-red-600",
              bgColor: "bg-red-50",
            },
          ].map((feature, index) => (
            <Card key={index} className="card-hover border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div
                  className={`w-14 h-14 mx-auto ${feature.bgColor} rounded-2xl flex items-center justify-center mb-4`}
                >
                  <feature.icon className={`h-7 w-7 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg font-semibold tracking-tight">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-center text-neutral-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center pb-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20 max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-neutral-900 mb-4 tracking-tight">Ready to get started?</h3>
            <p className="text-neutral-600 mb-8 text-lg leading-relaxed">
              Join thousands of users who have taken control of their subscription spending with our modern platform.
            </p>
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-200">
                Create Your Free Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
