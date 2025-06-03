import { z } from "zod"

export const signupSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export const subscriptionSchema = z.object({
  name: z.string().min(1, "Service name is required").max(100, "Service name must be less than 100 characters"),
  cost: z
    .string()
    .min(1, "Cost is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Cost must be a positive number",
    }),
  billing_cycle: z.enum(["weekly", "monthly", "quarterly", "yearly"], {
    required_error: "Please select a billing cycle",
  }),
  next_payment_date: z
    .string()
    .min(1, "Next payment date is required")
    .refine(
      (date) => {
        const selectedDate = new Date(date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return selectedDate >= today
      },
      {
        message: "Next payment date cannot be in the past",
      },
    ),
  category_id: z.string().optional(),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  website_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
})

export type SignupFormData = z.infer<typeof signupSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type SubscriptionFormData = z.infer<typeof subscriptionSchema>
