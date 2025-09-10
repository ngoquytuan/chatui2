// src/app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'RAG UI System',
  description: 'AI-powered document chat interface',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}