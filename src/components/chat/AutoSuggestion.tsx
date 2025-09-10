// src/components/chat/AutoSuggestion.tsx
'use client'

import { useEffect, useState } from 'react';
import { Suggestion } from '@/types/chat.types';
import { mockSuggestionService } from '@/services/mockApi';
import { i18nService } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface AutoSuggestionProps {
  onSuggestionClick: (suggestion: string) => void;
  visible: boolean;
  conversationHistory: string[];
  language: string;
}

export function AutoSuggestion({
  onSuggestionClick,
  visible,
  conversationHistory,
  language
}: AutoSuggestionProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && conversationHistory.length > 1) {
      loadSuggestions();
    }
  }, [visible, conversationHistory.length, language]);

  const loadSuggestions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const contextualSuggestions = await mockSuggestionService.getContextualSuggestions(
        conversationHistory,
        language
      );
      setSuggestions(contextualSuggestions.slice(0, 5)); // Top 5 suggestions
    } catch (err) {
      console.error('Failed to load suggestions:', err);
      setError('Failed to load suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = async (suggestion: Suggestion) => {
    try {
      await mockSuggestionService.trackSuggestionUsage(suggestion.id);
      const question = language === 'vi' ? suggestion.questionVi : suggestion.questionEn;
      onSuggestionClick(question);
    } catch (err) {
      console.error('Failed to track suggestion usage:', err);
      // Still proceed with the suggestion even if tracking fails
      const question = language === 'vi' ? suggestion.questionVi : suggestion.questionEn;
      onSuggestionClick(question);
    }
  };

  if (!visible || (!loading && suggestions.length === 0 && !error)) {
    return null;
  }

  return (
    <div className="bg-muted/30 p-4 rounded-lg mb-4 border">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
          <span>🔮</span>
          {i18nService.t('suggestions.title')}
        </h4>
        {loading && (
          <div className="flex items-center text-xs text-muted-foreground">
            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            {i18nService.t('suggestions.loading')}
          </div>
        )}
      </div>

      {error && (
        <div className="text-red-600 text-sm mb-2 flex items-center gap-2">
          <span>❌</span>
          {error}
          <button
            onClick={loadSuggestions}
            className="text-blue-600 hover:text-blue-700 underline ml-2"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className={cn(
                "px-3 py-2 bg-background hover:bg-accent text-foreground",
                "text-sm rounded-md transition-colors border border-border",
                "hover:shadow-sm active:scale-95 transform transition-transform",
                "focus:outline-none focus:ring-2 focus:ring-primary/20"
              )}
              title={`Category: ${suggestion.category} | Used ${suggestion.usageCount} times`}
            >
              <div className="flex items-center gap-2">
                {suggestion.category === 'policy' && <span>📋</span>}
                {suggestion.category === 'procedure' && <span>⚙️</span>}
                {suggestion.category === 'technical_guide' && <span>🛠️</span>}
                <span className="line-clamp-2">
                  {language === 'vi' ? suggestion.questionVi : suggestion.questionEn}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {!loading && suggestions.length === 0 && !error && (
        <div className="text-muted-foreground text-sm text-center py-2">
          {i18nService.t('suggestions.noSuggestions')}
        </div>
      )}
    </div>
  );
}