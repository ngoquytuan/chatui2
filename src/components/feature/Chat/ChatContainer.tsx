// src/components/feature/Chat/ChatContainer.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { chatAPI, API_BASE_URL } from '@/lib/api/client'
import { ChatMessage, Language } from '@/types/chat.types'
import { AutoSuggestion } from '@/components/chat/AutoSuggestion'
import { QuickActions } from '@/components/chat/QuickActions'
import { FeedbackWidget } from '@/components/chat/FeedbackWidget'
import { LanguageSwitcher, useLanguage } from '@/components/chat/LanguageSwitcher'
import { ExportDialog } from '@/components/chat/ExportDialog'
import { i18nService } from '@/lib/i18n'

export function ChatContainer() {
  const { language, changeLanguage, t } = useLanguage()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string>()
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')
  const [isClient, setIsClient] = useState(false) // Fix hydration
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fix hydration mismatch
  useEffect(() => {
    setIsClient(true)
    // Initialize messages after client-side hydration
    const welcomeMessage = language === 'vi' 
      ? 'Xin chào! Tôi là trợ lý RAG của bạn. Hãy tải lên tài liệu và đặt câu hỏi!'
      : 'Hello! I\'m your RAG assistant. Upload documents and ask me questions!'
    
    setMessages([
      { 
        id: '1', 
        content: welcomeMessage, 
        role: 'assistant',
        timestamp: new Date()
      }
    ])
    setConversationHistory([welcomeMessage])
    setConversationId(`session-${Date.now()}`)
    checkBackendConnection()
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Update conversation history for suggestions
  useEffect(() => {
    setConversationHistory(messages.map(m => m.content))
  }, [messages])

  const checkBackendConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`)
      if (response.ok) {
        setConnectionStatus('connected')
        console.log('✅ Backend connected')
      } else {
        setConnectionStatus('disconnected')
      }
    } catch (error) {
      setConnectionStatus('disconnected')
      console.error('❌ Backend connection failed:', error)
    }
  }

  const handleSend = async (messageContent?: string) => {
    const content = messageContent || message.trim()
    if (!content) return
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setIsLoading(true)
    setShowSuggestions(false) // Hide suggestions when user sends message
    
    try {
      const response = await chatAPI.sendMessage(content, conversationId)
      
      const assistantMessage: ChatMessage = {
        id: response.id,
        content: response.content,
        role: 'assistant',
        timestamp: new Date(response.timestamp),
        sources: response.sources
      }
      
      setMessages(prev => [...prev, assistantMessage])
      
      // Set conversation ID if first message
      if (!conversationId) {
        setConversationId(response.conversation_id)
      }
      
      // Show suggestions again after response
      setTimeout(() => setShowSuggestions(true), 1000)
      
    } catch (error) {
      console.error('Chat error:', error)
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `❌ Error: ${error instanceof Error ? error.message : 'Failed to send message'}. Please check if the backend is running.`,
        role: 'assistant',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
      setShowSuggestions(true) // Show suggestions even after error
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion)
  }

  const handleQuickAction = (query: string) => {
    handleSend(query)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChat = () => {
    const welcomeMessage = language === 'vi' 
      ? 'Xin chào! Tôi là trợ lý RAG của bạn. Hãy tải lên tài liệu và đặt câu hỏi!'
      : 'Hello! I\'m your RAG assistant. Upload documents and ask me questions!'
    
    setMessages([
      { 
        id: '1', 
        content: welcomeMessage, 
        role: 'assistant',
        timestamp: new Date()
      }
    ])
    setConversationId(`session-${Date.now()}`)
    setShowSuggestions(true)
  }

  const formatTime = (timestamp: Date) => {
    // Fix hydration by consistent formatting
    if (!isClient) return ''
    return timestamp.toLocaleTimeString()
  }

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b bg-muted/30">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium">Chat Assistant</h3>
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-xs text-muted-foreground">Loading...</span>
          </div>
        </div>
        <Card className="flex-1 flex flex-col m-4">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-muted-foreground">Loading chat...</div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with connection status */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div className="flex items-center space-x-2">
          <h3 className="font-medium">{t('chat.title')}</h3>
          <div className={`w-2 h-2 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' : 
            connectionStatus === 'checking' ? 'bg-yellow-500' : 'bg-red-500'
          }`} />
          <span className="text-xs text-muted-foreground">
            {connectionStatus === 'connected' ? t('chat.connected') : 
             connectionStatus === 'checking' ? t('chat.connecting') : t('chat.disconnected')}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <LanguageSwitcher 
            onLanguageChange={changeLanguage}
            size="sm"
          />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkBackendConnection}
            disabled={connectionStatus === 'checking'}
            title={t('chat.refresh')}
          >
            🔄
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowExportDialog(true)}
            disabled={messages.length === 0}
            title={t('chat.export')}
          >
            📤
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearChat}
            title={t('chat.clear')}
          >
            🗑️
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions 
        onActionClick={handleQuickAction}
        language={language}
        disabled={isLoading || connectionStatus !== 'connected'}
      />

      {/* Chat messages */}
      <Card className="flex-1 flex flex-col m-4">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
                
                {/* Show sources if available */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-current/20">
                    <div className="text-xs opacity-75">Sources:</div>
                    {msg.sources.map((source, idx) => (
                      <div key={idx} className="text-xs opacity-75">
                        📄 {source.filename} (Score: {source.relevance_score})
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="text-xs opacity-50 mt-1">
                  {formatTime(msg.timestamp)}
                </div>

                {/* Feedback for assistant messages */}
                {msg.role === 'assistant' && msg.id !== '1' && (
                  <FeedbackWidget 
                    messageId={msg.id}
                    onFeedbackSubmitted={(feedback) => {
                      console.log('Feedback submitted:', feedback)
                    }}
                  />
                )}
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="text-sm">{t('chat.typing')}</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input area */}
        <div className="border-t">
          {/* Auto Suggestions */}
          {showSuggestions && messages.length > 1 && (
            <div className="p-4 pb-0">
              <AutoSuggestion
                onSuggestionClick={handleSuggestionClick}
                visible={showSuggestions}
                conversationHistory={conversationHistory}
                language={language}
              />
            </div>
          )}
          
          <div className="p-4">
            <div className="flex space-x-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 border rounded-md bg-background text-foreground resize-none min-h-[40px] max-h-[120px]"
                placeholder={
                  connectionStatus === 'connected' 
                    ? t('chat.placeholder')
                    : t('chat.disconnected')
                }
                disabled={isLoading || connectionStatus !== 'connected'}
                rows={1}
              />
              <Button 
                onClick={() => handleSend()} 
                disabled={!message.trim() || isLoading || connectionStatus !== 'connected'}
              >
                {isLoading ? '⏳' : '📤'} {t('common.send')}
              </Button>
            </div>
          </div>
          
          {/* Debug info */}
          <div className="px-4 pb-4">
            <div className="text-xs text-muted-foreground">
              <div className="flex items-center space-x-4">
                <div>
                  🔗 Backend: {API_BASE_URL}
                </div>
                {conversationId && (
                  <div>
                    💬 Conversation: {conversationId.slice(0, 8)}...
                  </div>
                )}
                <div>
                  📊 Messages: {messages.length}
                </div>
                <div>
                  🌍 Language: {language.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Export Dialog */}
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        messages={messages}
        sessionId={conversationId || 'default-session'}
      />
    </div>
  )
}