import type React from "react"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { subFont, autoFont } from "./fonts"

export const metadata: Metadata = {
  title: "AutoSub — AI Hinglish Subtitles for Creators",
  description: "Generate clean, readable Hinglish (Romanized Hindi) subtitles automatically. No more Devanagari—just pure Hinglish for Reels, Shorts, and YouTube.",
  keywords: [
    "Hinglish Subtitles", 
    "AI Hinglish Captions", 
    "Roman Hindi Subtitles", 
    "Auto Captions for Reels", 
    "Hindi English Transcription"
  ],
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "AutoSub — Instant Hinglish Subtitles",
    description: "The fastest way to add Romanized Hindi captions to your videos. Built for Indian creators.",
    type: "website",
    url: "https://autosub.xyz", // Placeholder
    images: [
      {
        url: "/meta-tag-png.png",
        width: 1200,
        height: 630,
        alt: "AutoSub Hinglish Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoSub — AI Hinglish Subtitles",
    description: "No more Devanagari. Get pure Hinglish subtitles for your content.",
    images: ["/meta-tag-png.png"],
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