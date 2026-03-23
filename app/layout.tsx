import type { Metadata } from 'next'
import { Josefin_Sans } from 'next/font/google'
import './globals.css'
import { IDPProvider } from './providers'

const josefin = Josefin_Sans({ subsets: ['latin'], variable: '--font-josefin' })

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
    <html lang="en" className={josefin.variable}>
      <body className="min-h-screen bg-mesh bg-noise">
        <IDPProvider>{children}</IDPProvider>
      </body>
    </html>
  )
}
