// src/components/layout/AppLayout.tsx
'use client'

import { ReactNode, useState } from 'react'
import { Button } from '@/components/ui/Button'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-14 items-center px-4 justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">🤖</span>
            </div>
            <h1 className="font-semibold text-foreground">RAG UI System</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleTheme}
            >
              {isDark ? '☀️' : '🌙'}
            </Button>
            <Button variant="outline" size="sm">
              ⚙️ Settings
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container px-0">
        {children}
      </main>
    </div>
  )
}