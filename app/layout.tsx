import type { Metadata } from "next"
import { Space_Grotesk, Poppins } from "next/font/google"
import "./globals.css"
import { BottomNav } from "@/components/bottom-nav"
import { AuthProvider } from "@/lib/auth-context"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Saraswati Puja 2025",
  description: "Celebrate Vasant Panchami with us",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${poppins.variable} bg-background/50 min-h-screen font-sans text-text-primary`}
      >
        <AuthProvider>
          <main className="container max-w-md mx-auto pb-16">{children}</main>
        </AuthProvider>
        <BottomNav />
      </body>
    </html>
  )
}

