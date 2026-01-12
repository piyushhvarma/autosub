import type React from "react"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { subFont, autoFont } from "./fonts" // Importing from the same folder

export const metadata: Metadata = {
  title: "AutoSub - AI-Powered Subtitle Generation",
  description: "Generate professional subtitles from your videos in seconds.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
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
      className={`dark ${subFont.variable} ${autoFont.variable}`}
    >
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}