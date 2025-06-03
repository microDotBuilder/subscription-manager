import type React from "react"
import type { Metadata } from "next"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const metadata: Metadata = {
  title: "SubManager - Subscription Management",
  description: "Take control of your subscriptions with modern management tools",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistMono.className}>
      <body className="antialiased bg-neutral-50 text-neutral-900">{children}</body>
    </html>
  )
}
