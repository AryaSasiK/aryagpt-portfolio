import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AryaGPT - Arya Sasikumar's Portfolio",
  description: "A ChatGPT-like interface for AryaGPT",
  generator: 'v0.dev',
  icons: {
    icon: '/images/profile.png',
    apple: '/images/profile.png'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#171717" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AryaGPT" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/images/profile.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/profile.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}