import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'DadOps - Birth Cost Calculator',
  description: 'Compare insurance plans and calculate the true cost of your baby\'s birth year in 2 minutes.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-display bg-background-light dark:bg-background-dark text-[#121714] dark:text-white antialiased`}>
        {children}
      </body>
    </html>
  )
}
