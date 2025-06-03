"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField, FormInput } from "@/components/ui/form-field"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, ArrowLeft, Sparkles, CheckCircle, AlertCircle } from "lucide-react"
import { signupSchema, type SignupFormData } from "@/lib/validations"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  })

  const password = watch("password")

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true)
    setAuthError("")
    setMessage("")

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setAuthError(error.message)
    } else {
      setMessage("Check your email for the confirmation link!")
    }
    setLoading(false)
  }

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "" }

    let strength = 0
    const checks = [
      password.length >= 8,
      /[a-zA-Z]/.test(password),
      /[0-9]/.test(password),
      /[^a-zA-Z0-9]/.test(password),
    ]

    strength = checks.filter(Boolean).length

    const labels = ["", "Weak", "Fair", "Good", "Strong"]
    const colors = ["", "text-red-500", "text-orange-500", "text-yellow-500", "text-green-500"]

    return { strength, label: labels[strength], color: colors[strength] }
  }

  const passwordStrength = getPasswordStrength(password || "")

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-neutral-600 hover:text-neutral-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>
        </div>

        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center pb-8">
            <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Create account</CardTitle>
            <CardDescription className="text-neutral-600">Start managing your subscriptions today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <FormField label="Email address" error={errors.email?.message} required>
                <FormInput
                  {...register("email")}
                  type="email"
                  placeholder="Enter your email"
                  error={errors.email?.message}
                  autoComplete="email"
                />
              </FormField>

              <FormField label="Password" error={errors.password?.message} required>
                <div className="space-y-3">
                  <div className="relative">
                    <FormInput
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      error={errors.password?.message}
                      autoComplete="new-password"
                      className="pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {password && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-600">Password strength:</span>
                        <span className={passwordStrength.color}>{passwordStrength.label}</span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full ${
                              level <= passwordStrength.strength
                                ? level === 1
                                  ? "bg-red-400"
                                  : level === 2
                                    ? "bg-orange-400"
                                    : level === 3
                                      ? "bg-yellow-400"
                                      : "bg-green-400"
                                : "bg-neutral-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </FormField>

              <FormField label="Confirm password" error={errors.confirmPassword?.message} required>
                <FormInput
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="Confirm your password"
                  error={errors.confirmPassword?.message}
                  autoComplete="new-password"
                />
              </FormField>

              {authError && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {message && (
                <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </form>
            <div className="text-center text-sm text-neutral-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-medium text-neutral-900 hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
