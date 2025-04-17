import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import StructuredData from "./structured-data"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Arya Sasikumar | AryaGPT - Interactive Portfolio",
  description: "Meet Arya Sasikumar through this interactive AI portfolio. Arya's professional experiences, skills, and personal projects presented in a conversational AI interface.",
  generator: 'v0.dev',
  keywords: ["Arya Sasikumar", "AryaGPT", "Portfolio", "AI", "Developer", "Software Engineer", "Interactive Resume"],
  authors: [{ name: "Arya Sasikumar" }],
  creator: "Arya Sasikumar",
  publisher: "Arya Sasikumar",
  openGraph: {
    title: "Arya Sasikumar | AryaGPT - Interactive Portfolio",
    description: "Meet Arya Sasikumar through this interactive AI portfolio. Discover Arya's professional experiences, skills, and personal projects.",
    url: "https://aryasasikumar.com", // Replace with your actual domain
    siteName: "Arya Sasikumar's Portfolio",
    images: [
      {
        url: "/images/profile.png",
        width: 800,
        height: 600,
        alt: "Arya Sasikumar"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arya Sasikumar | AryaGPT - Interactive Portfolio",
    description: "Meet Arya Sasikumar through this interactive AI portfolio.",
    images: ["/images/profile.png"],
    creator: "@aryasasikumar", // Replace with actual Twitter handle if available
  },
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
        <meta name="apple-mobile-web-app-title" content="Arya Sasikumar | AryaGPT" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/images/profile.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/profile.png" />
        <link rel="canonical" href="https://aryasasikumar.com" /> {/* Replace with your actual domain */}
        <StructuredData />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}