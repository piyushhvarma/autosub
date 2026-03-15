import type React from "react"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { subFont, autoFont } from "./fonts"

export const metadata: Metadata = {
  title: "AutoSub",
  description: "AI Subtitle Generator",
  icons: {
    icon: "/icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#1a1a2e",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      // ✅ VERIFY THIS LINE: passing autoFont.variable
      className={`dark ${subFont.variable} ${autoFont.variable}`}
    >
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  )
}