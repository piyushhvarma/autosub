import { Inter, Tinos } from "next/font/google"

export const subFont = Inter({
  subsets: ["latin"],
  variable: "--font-sub",
})

export const autoFont = Tinos({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-auto",
})