// src/types/chat.types.ts

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  sources?: any[];
  feedback?: FeedbackData;
}

export interface Suggestion {
  id: string;
  category: string;
  questionVi: string;
  questionEn: string;
  priority: number;
  usageCount: number;
}

export interface FeedbackData {
  messageId: string;
  type: 'thumbs_up' | 'thumbs_down';
  comment?: string;
  timestamp: Date;
}

export interface QuickAction {
  id: string;
  labelVi: string;
  labelEn: string;
  query: string;
  icon: string;
  category: 'policy' | 'procedure' | 'technical_guide';
}

export type ExportFormat = 'pdf' | 'json' | 'txt' | 'html';

export interface ExportRequest {
  format: ExportFormat;
  sessionId: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  includeSystemMessages?: boolean;
  includeAttachments?: boolean;
}

export interface ConversationSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
  status: 'active' | 'archived';
}