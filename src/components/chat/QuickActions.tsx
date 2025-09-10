// src/components/chat/QuickActions.tsx
'use client'

import { useEffect, useState } from 'react';
import { QuickAction } from '@/types/chat.types';
import { mockQuickActionService } from '@/services/mockApi';
import { i18nService } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface QuickActionsProps {
  onActionClick: (query: string) => void;
  language: string;
  disabled?: boolean;
}

export function QuickActions({ onActionClick, language, disabled = false }: QuickActionsProps) {
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuickActions();
  }, [language]);

  const loadQuickActions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const actions = await mockQuickActionService.getQuickActions(language);
      setQuickActions(actions);
    } catch (err) {
      console.error('Failed to load quick actions:', err);
      setError('Failed to load quick actions');
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = async (action: QuickAction) => {
    if (disabled) return;
    
    try {
      // For demo purposes, we'll use a simple parameter replacement
      let query = action.query;
      
      // Simple parameter prompts for demo
      if (query.includes('{{topic}}')) {
        const topic = prompt('Enter topic:') || 'general';
        query = query.replace('{{topic}}', topic);
      } else if (query.includes('{{process}}')) {
        const process = prompt('Enter process name:') || 'standard';
        query = query.replace('{{process}}', process);
      } else if (query.includes('{{technology}}')) {
        const technology = prompt('Enter technology:') || 'system';
        query = query.replace('{{technology}}', technology);
      }
      
      onActionClick(query);
    } catch (err) {
      console.error('Failed to execute quick action:', err);
    }
  };

  const getIcon = (iconName: string, category: string) => {
    const iconMap: Record<string, string> = {
      document: '📄',
      clipboard: '📋',
      cog: '⚙️',
    };
    
    // Fallback based on category
    if (!iconMap[iconName]) {
      switch (category) {
        case 'policy': return '📋';
        case 'procedure': return '⚙️';
        case 'technical_guide': return '🛠️';
        default: return '❓';
      }
    }
    
    return iconMap[iconName];
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'policy': return 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700';
      case 'procedure': return 'bg-green-50 border-green-200 hover:bg-green-100 text-green-700';
      case 'technical_guide': return 'bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-700';
      default: return 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-3 p-4 border-b border-border bg-muted/30">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-muted-foreground/20 rounded mb-2" />
              <div className="w-16 h-3 bg-muted-foreground/20 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="text-red-600 text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span>❌</span>
            {error}
          </span>
          <button
            onClick={loadQuickActions}
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-border bg-muted/30">
      <div className="p-4">
        <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <span>⚡</span>
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action) => {
            const IconEmoji = getIcon(action.icon, action.category);
            const colorClasses = getCategoryColor(action.category);
            
            return (
              <button
                key={action.id}
                onClick={() => handleActionClick(action)}
                disabled={disabled}
                className={cn(
                  'flex flex-col items-center p-4 rounded-lg transition-all transform',
                  'border focus:outline-none focus:ring-2 focus:ring-primary/20',
                  'active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
                  colorClasses
                )}
                title={`${language === 'vi' ? action.labelVi : action.labelEn} - ${action.category}`}
              >
                <span className="text-2xl mb-2">{IconEmoji}</span>
                <span className="text-sm font-medium text-center leading-tight">
                  {language === 'vi' ? action.labelVi : action.labelEn}
                </span>
              </button>
            );
          })}
        </div>
        
        {quickActions.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <span className="text-4xl mb-2 block">⚡</span>
            <div>No quick actions available</div>
          </div>
        )}
      </div>
      
      <div className="px-4 pb-2">
        <div className="text-xs text-muted-foreground">
          💡 Tip: Click any action to quickly start a conversation on that topic
        </div>
      </div>
    </div>
  );
}