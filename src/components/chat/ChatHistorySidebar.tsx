// src/components/chat/ChatHistorySidebar.tsx
'use client'

import { useState, useEffect } from 'react';
import { ConversationSession } from '@/types/chat.types';
import { mockChatHistoryService } from '@/services/mockApi';
import { i18nService } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface ChatHistorySidebarProps {
  currentSessionId?: string;
  onSessionSelect?: (sessionId: string) => void;
  onNewChat?: () => void;
  className?: string;
}

export function ChatHistorySidebar({
  currentSessionId,
  onSessionSelect,
  onNewChat,
  className
}: ChatHistorySidebarProps) {
  const [sessions, setSessions] = useState<ConversationSession[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const history = await mockChatHistoryService.getConversationHistory();
      setSessions(history);
    } catch (err) {
      console.error('Failed to load chat history:', err);
      setError('Failed to load chat history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      await loadSessions();
      return;
    }

    try {
      const results = await mockChatHistoryService.searchConversations(query);
      setSessions(results);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleDeleteSession = async (sessionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!confirm(i18nService.t('history.deleteConfirm'))) {
      return;
    }

    try {
      await mockChatHistoryService.deleteConversation(sessionId);
      setSessions(sessions.filter(s => s.id !== sessionId));
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  const formatRelativeTime = (timestamp: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - timestamp.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;

    if (diffInHours < 24) {
      return i18nService.t('history.today');
    } else if (diffInDays < 2) {
      return i18nService.t('history.yesterday');
    } else if (diffInDays < 7) {
      return i18nService.t('history.thisWeek');
    } else {
      return i18nService.t('history.older');
    }
  };

  const groupSessionsByTime = (sessions: ConversationSession[]) => {
    const groups: Record<string, ConversationSession[]> = {};

    sessions.forEach(session => {
      const group = formatRelativeTime(session.timestamp);
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(session);
    });

    return groups;
  };

  const sessionGroups = groupSessionsByTime(sessions);
  const groupOrder = [
    i18nService.t('history.today'),
    i18nService.t('history.yesterday'),
    i18nService.t('history.thisWeek'),
    i18nService.t('history.older')
  ];

  return (
    <div className={cn("flex flex-col h-full bg-muted/30 border-r border-border", className)}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <span>💬</span>
            {i18nService.t('history.title')}
          </h2>
          <button
            onClick={onNewChat}
            className={cn(
              "p-2 rounded-md bg-primary text-primary-foreground",
              "hover:bg-primary/90 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-primary/20"
            )}
            title="New Chat"
          >
            <span className="text-sm">✨</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={i18nService.t('history.search')}
            className={cn(
              "w-full pl-8 pr-3 py-2 text-sm rounded-md border border-border",
              "bg-background text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary/20"
            )}
          />
          <span className="absolute left-2.5 top-2.5 text-muted-foreground">
            🔍
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">{i18nService.t('common.loading')}</span>
            </div>
          </div>
        ) : error ? (
          <div className="p-4">
            <div className="text-red-600 text-sm flex items-center gap-2 mb-2">
              <span>❌</span>
              {error}
            </div>
            <button
              onClick={loadSessions}
              className="text-blue-600 hover:text-blue-700 underline text-sm"
            >
              Try again
            </button>
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <span className="text-4xl mb-2">💬</span>
            <div className="text-muted-foreground text-sm">
              {searchQuery ? i18nService.t('history.noResults') : 'No conversations yet'}
            </div>
            {searchQuery && (
              <button
                onClick={() => handleSearch('')}
                className="text-blue-600 hover:text-blue-700 underline text-sm mt-2"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="p-2">
            {groupOrder.map(groupName => {
              const groupSessions = sessionGroups[groupName];
              if (!groupSessions || groupSessions.length === 0) return null;

              return (
                <div key={groupName} className="mb-4">
                  <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {groupName}
                  </div>
                  <div className="space-y-1">
                    {groupSessions.map((session) => (
                      <button
                        key={session.id}
                        onClick={() => onSessionSelect?.(session.id)}
                        className={cn(
                          "w-full text-left p-3 rounded-lg border transition-colors group",
                          "hover:bg-accent hover:border-accent-foreground/20",
                          currentSessionId === session.id
                            ? 'bg-primary/10 border-primary/20'
                            : 'bg-background border-transparent'
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-foreground text-sm truncate">
                              {session.title}
                            </div>
                            <div className="text-xs text-muted-foreground truncate mt-1">
                              {session.lastMessage}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                              <span>{session.messageCount} {i18nService.t('history.messageCount')}</span>
                              <span>•</span>
                              <span>{session.timestamp.toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={(e) => handleDeleteSession(session.id, e)}
                            className={cn(
                              "opacity-0 group-hover:opacity-100 p-1 rounded",
                              "text-red-500 hover:text-red-700 hover:bg-red-50",
                              "transition-all duration-200"
                            )}
                            title="Delete conversation"
                          >
                            <span className="text-xs">🗑️</span>
                          </button>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}