import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { IDPProvider } from './providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'My IDP \u2014 Individual Development Plan',
  description: 'Track and manage your professional development goals',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-mesh bg-noise">
        <IDPProvider>{children}</IDPProvider>
      </body>
    </html>
  )
}
