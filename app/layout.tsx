import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
import { IDPProvider } from './providers'

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })

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
    <html lang="en" className={manrope.variable}>
      <body className="min-h-screen bg-mesh bg-noise">
        <IDPProvider>{children}</IDPProvider>
      </body>
    </html>
  )
}
