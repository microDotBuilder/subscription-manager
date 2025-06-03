"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField, FormInput } from "@/components/ui/form-field";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Zap,
} from "lucide-react";
import { loginSchema, type LoginFormData } from "@/lib/validations";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setAuthError("");

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setAuthError(error.message);
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-bounce-in">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>
        </div>

        <Card className="glass-effect border-0 shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 vibrant-gradient opacity-5" />
          <CardHeader className="space-y-3 text-center pb-8 relative z-10">
            <div className="w-16 h-16 vibrant-gradient rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-800">
              Welcome back
            </CardTitle>
            <CardDescription className="text-slate-600 text-lg">
              Sign in to your subscription manager
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 relative z-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                label="Email address"
                error={errors.email?.message}
                required
              >
                <FormInput
                  {...register("email")}
                  type="email"
                  placeholder="Enter your email"
                  error={errors.email?.message}
                  autoComplete="email"
                  className="h-14 text-lg border-2 border-slate-200 focus:border-electric-blue rounded-xl"
                />
              </FormField>

              <FormField
                label="Password"
                error={errors.password?.message}
                required
              >
                <div className="relative">
                  <FormInput
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    error={errors.password?.message}
                    autoComplete="current-password"
                    className="h-14 text-lg border-2 border-slate-200 focus:border-electric-blue rounded-xl pr-14"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-14 px-4 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </FormField>

              {authError && (
                <div className="flex items-center gap-3 text-sm text-red-600 bg-red-50 p-4 rounded-xl border-2 border-red-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-14 text-lg font-semibold vibrant-gradient text-white border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-xl"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Sign in
                    <Zap className="w-5 h-5 ml-2" />
                  </div>
                )}
              </Button>
            </form>
            <div className="text-center text-slate-600">
              {"Don't have an account? "}
              <Link
                href="/auth/signup"
                className="font-semibold text-neon-purple hover:text-cyber-pink transition-colors"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
