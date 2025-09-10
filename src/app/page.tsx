// src/app/page.tsx
'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { ChatContainer } from '@/components/feature/Chat/ChatContainer'
import { DocumentSidebar } from '@/components/feature/Document/DocumentSidebar'
import { ChatHistorySidebar } from '@/components/chat/ChatHistorySidebar'
import { Button } from '@/components/ui/Button'

export default function HomePage() {
  const [showChatHistory, setShowChatHistory] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string>()

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Chat History Sidebar (optional) */}
        {showChatHistory && (
          <ChatHistorySidebar 
            className="w-80"
            currentSessionId={currentSessionId}
            onSessionSelect={(sessionId) => {
              setCurrentSessionId(sessionId)
              console.log('Selected session:', sessionId)
            }}
            onNewChat={() => {
              setCurrentSessionId(undefined)
              console.log('Starting new chat')
            }}
          />
        )}
        
        <DocumentSidebar />
        
        <div className="flex-1 flex flex-col">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Enhanced Chat UI</h2>
                <p className="text-muted-foreground">
                  Interactive chatbot with auto-suggestions, quick actions, feedback, and multi-language support
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowChatHistory(!showChatHistory)}
                >
                  {showChatHistory ? '📚 Hide History' : '📚 Show History'}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <ChatContainer />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}