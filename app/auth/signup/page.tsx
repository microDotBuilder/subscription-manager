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
  CheckCircle,
  AlertCircle,
  Zap,
} from "lucide-react";
import { signupSchema, type SignupFormData } from "@/lib/validations";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  const password = watch("password");

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    setAuthError("");
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setAuthError(error.message);
    } else {
      setMessage("Check your email for the confirmation link!");
    }
    setLoading(false);
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    const checks = [
      password.length >= 8,
      /[a-zA-Z]/.test(password),
      /[0-9]/.test(password),
      /[^a-zA-Z0-9]/.test(password),
    ];

    strength = checks.filter(Boolean).length;

    const labels = ["", "Weak", "Fair", "Good", "Strong"];
    const colors = [
      "",
      "text-red-500",
      "text-sunset-orange",
      "text-lime-accent",
      "text-mint-green",
    ];

    return { strength, label: labels[strength], color: colors[strength] };
  };

  const passwordStrength = getPasswordStrength(password || "");

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
              Create account
            </CardTitle>
            <CardDescription className="text-slate-600 text-lg">
              Start managing your subscriptions today
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
                <div className="space-y-4">
                  <div className="relative">
                    <FormInput
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      error={errors.password?.message}
                      autoComplete="new-password"
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
                  {password && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 font-medium">
                          Password strength:
                        </span>
                        <span
                          className={`font-semibold ${passwordStrength.color}`}
                        >
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                              level <= passwordStrength.strength
                                ? level === 1
                                  ? "bg-red-400"
                                  : level === 2
                                  ? "bg-sunset-orange"
                                  : level === 3
                                  ? "bg-lime-accent"
                                  : "bg-mint-green"
                                : "bg-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </FormField>

              <FormField
                label="Confirm password"
                error={errors.confirmPassword?.message}
                required
              >
                <FormInput
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="Confirm your password"
                  error={errors.confirmPassword?.message}
                  autoComplete="new-password"
                  className="h-14 text-lg border-2 border-slate-200 focus:border-electric-blue rounded-xl"
                />
              </FormField>

              {authError && (
                <div className="flex items-center gap-3 text-sm text-red-600 bg-red-50 p-4 rounded-xl border-2 border-red-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {message && (
                <div className="flex items-center gap-3 text-sm text-emerald-600 bg-emerald-50 p-4 rounded-xl border-2 border-emerald-200">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{message}</span>
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
                    Creating account...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Create account
                    <Zap className="w-5 h-5 ml-2" />
                  </div>
                )}
              </Button>
            </form>
            <div className="text-center text-slate-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-neon-purple hover:text-cyber-pink transition-colors"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
