// src/components/chat/FeedbackWidget.tsx
'use client'

import { useState } from 'react';
import { FeedbackData } from '@/types/chat.types';
import { mockFeedbackService } from '@/services/mockApi';
import { i18nService } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface FeedbackWidgetProps {
  messageId: string;
  onFeedbackSubmitted?: (feedback: FeedbackData) => void;
  className?: string;
}

export function FeedbackWidget({ 
  messageId, 
  onFeedbackSubmitted,
  className 
}: FeedbackWidgetProps) {
  const [selectedFeedback, setSelectedFeedback] = useState<'thumbs_up' | 'thumbs_down' | null>(null);
  const [comment, setComment] = useState('');
  const [showComment, setShowComment] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFeedbackClick = async (type: 'thumbs_up' | 'thumbs_down') => {
    if (submitted || submitting) return;
    
    setSelectedFeedback(type);
    setError(null);
    
    if (type === 'thumbs_down') {
      setShowComment(true);
      return;
    }
    
    // For thumbs up, submit immediately
    await submitFeedback(type);
  };

  const submitFeedback = async (type: 'thumbs_up' | 'thumbs_down') => {
    setSubmitting(true);
    setError(null);
    
    try {
      const feedbackData: FeedbackData = {
        messageId,
        type,
        comment: comment.trim() || undefined,
        timestamp: new Date()
      };
      
      await mockFeedbackService.submitFeedback(feedbackData);
      setSubmitted(true);
      setShowComment(false);
      
      onFeedbackSubmitted?.(feedbackData);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!selectedFeedback) return;
    await submitFeedback(selectedFeedback);
  };

  const handleCommentCancel = () => {
    setShowComment(false);
    setSelectedFeedback(null);
    setComment('');
    setError(null);
  };

  if (submitted) {
    return (
      <div className={cn("flex items-center gap-2 mt-2 text-xs", className)}>
        <span className="text-green-600">✅</span>
        <span className="text-green-600 font-medium">
          {i18nService.t('feedback.thankYou')}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("mt-2", className)}>
      {/* Feedback Buttons */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          Was this helpful?
        </span>
        
        <button
          onClick={() => handleFeedbackClick('thumbs_up')}
          disabled={submitting}
          className={cn(
            "p-1 rounded hover:bg-accent transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-primary/20",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            selectedFeedback === 'thumbs_up' 
              ? 'text-green-600 bg-green-50' 
              : 'text-muted-foreground hover:text-green-600'
          )}
          title={i18nService.t('feedback.helpful')}
        >
          <span className="text-base">👍</span>
        </button>
        
        <button
          onClick={() => handleFeedbackClick('thumbs_down')}
          disabled={submitting}
          className={cn(
            "p-1 rounded hover:bg-accent transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-primary/20",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            selectedFeedback === 'thumbs_down' 
              ? 'text-red-600 bg-red-50' 
              : 'text-muted-foreground hover:text-red-600'
          )}
          title={i18nService.t('feedback.notHelpful')}
        >
          <span className="text-base">👎</span>
        </button>

        {submitting && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Submitting...</span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
          ❌ {error}
        </div>
      )}
      
      {/* Comment Section */}
      {showComment && (
        <div className="mt-3 p-3 border border-border rounded bg-background">
          <div className="text-xs font-medium text-foreground mb-2">
            Help us improve - what went wrong?
          </div>
          
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={i18nService.t('feedback.commentPlaceholder')}
            className={cn(
              "w-full text-xs border border-input rounded px-2 py-1 resize-none",
              "focus:outline-none focus:ring-2 focus:ring-primary/20",
              "bg-background text-foreground placeholder:text-muted-foreground"
            )}
            rows={3}
            maxLength={500}
            disabled={submitting}
          />
          
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-muted-foreground">
              {comment.length}/500
            </span>
            
            <div className="flex gap-2">
              <button
                onClick={handleCommentCancel}
                disabled={submitting}
                className={cn(
                  "px-3 py-1 text-xs rounded border border-border",
                  "hover:bg-accent transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {i18nService.t('feedback.cancel')}
              </button>
              
              <button
                onClick={handleCommentSubmit}
                disabled={submitting}
                className={cn(
                  "px-3 py-1 text-xs rounded bg-primary text-primary-foreground",
                  "hover:bg-primary/90 transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {i18nService.t('feedback.submit')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}