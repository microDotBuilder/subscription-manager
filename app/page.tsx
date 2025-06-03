import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CreditCard,
  DollarSign,
  Calendar,
  Shield,
  ArrowRight,
  Sparkles,
  Zap,
  Star,
} from "lucide-react";

export default async function HomePage() {
  const user = await getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen gradient-bg">
      <header className="container mx-auto px-6 py-8">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 vibrant-gradient rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gradient animated-gradient">
              SUBMANAGER
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button
                variant="ghost"
                className="font-medium hover:bg-white/20 transition-all duration-300"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="font-medium vibrant-gradient text-white border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6">
        <div className="text-center mb-24 animate-fade-in">
          <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-slate-700 mb-8 border border-white/30">
            <Star className="w-4 h-4 mr-2 text-sunset-orange" />
            Modern subscription management reimagined
          </div>
          <h2 className="text-6xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            Take Control of Your
            <br />
            <span className="text-gradient animated-gradient">
              SUBSCRIPTIONS
            </span>
          </h2>
          <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience the future of subscription management with our
            beautifully designed dashboard. Track, analyze, and optimize all
            your recurring payments with stunning visual insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="text-lg px-10 py-6 vibrant-gradient text-white border-0 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 rounded-2xl"
              >
                Start Your Journey
                <Zap className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-10 py-6 font-medium border-2 border-white/30 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 rounded-2xl"
            >
              Watch Demo
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {[
            {
              icon: CreditCard,
              title: "Smart Tracking",
              description:
                "AI-powered categorization with beautiful visual insights and intelligent recommendations.",
              gradient: "from-electric-blue to-ocean-teal",
              iconBg: "bg-electric-blue/10",
              iconColor: "text-electric-blue",
            },
            {
              icon: DollarSign,
              title: "Spending Analytics",
              description:
                "Interactive charts and real-time analytics to visualize your financial patterns.",
              gradient: "from-mint-green to-lime-accent",
              iconBg: "bg-mint-green/10",
              iconColor: "text-mint-green",
            },
            {
              icon: Calendar,
              title: "Smart Reminders",
              description:
                "Intelligent notifications with customizable alerts and payment predictions.",
              gradient: "from-neon-purple to-cosmic-violet",
              iconBg: "bg-neon-purple/10",
              iconColor: "text-neon-purple",
            },
            {
              icon: Shield,
              title: "Bank-Grade Security",
              description:
                "Military-grade encryption with zero-knowledge architecture for ultimate privacy.",
              gradient: "from-cyber-pink to-sunset-orange",
              iconBg: "bg-cyber-pink/10",
              iconColor: "text-cyber-pink",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className="card-hover glass-effect border-0 shadow-xl group overflow-hidden relative"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              />
              <CardHeader className="text-center pb-6 relative z-10">
                <div
                  className={`w-16 h-16 mx-auto ${feature.iconBg} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
                </div>
                <CardTitle className="text-xl font-bold tracking-tight text-slate-800">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 relative z-10">
                <CardDescription className="text-center text-slate-600 leading-relaxed text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center pb-24 animate-slide-up">
          <div className="glass-effect rounded-3xl p-16 shadow-2xl border-0 max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 vibrant-gradient opacity-5" />
            <div className="relative z-10">
              <h3 className="text-4xl font-bold text-slate-800 mb-6 tracking-tight">
                Ready to Transform Your Finances?
              </h3>
              <p className="text-slate-600 mb-10 text-xl leading-relaxed max-w-2xl mx-auto">
                Join thousands of users who have revolutionized their
                subscription management with our cutting-edge platform.
              </p>
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="text-xl px-12 py-6 vibrant-gradient text-white border-0 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 rounded-2xl"
                >
                  Create Your Free Account
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
