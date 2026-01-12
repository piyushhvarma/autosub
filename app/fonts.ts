import { Inter, Playfair_Display } from "next/font/google"

export const subFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})


export const autoFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-premium",
  weight: "variable", // Supports Thin, Regular, Medium, Bold, etc.
  display: "swap",
})