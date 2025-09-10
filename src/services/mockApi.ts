// src/services/mockApi.ts
import { Suggestion, FeedbackData, QuickAction, ExportRequest, ConversationSession } from '@/types/chat.types';

// Mock data
const mockSuggestions: Suggestion[] = [
  {
    id: '1',
    category: 'policy',
    questionVi: 'Chính sách nghỉ phép của công ty như thế nào?',
    questionEn: 'What is the company leave policy?',
    priority: 1,
    usageCount: 15
  },
  {
    id: '2',
    category: 'procedure',
    questionVi: 'Quy trình onboarding nhân viên mới?',
    questionEn: 'What is the new employee onboarding process?',
    priority: 2,
    usageCount: 12
  },
  {
    id: '3',
    category: 'technical_guide',
    questionVi: 'Hướng dẫn sử dụng hệ thống HR?',
    questionEn: 'How to use the HR system?',
    priority: 3,
    usageCount: 8
  },
  {
    id: '4',
    category: 'policy',
    questionVi: 'Chính sách làm việc từ xa?',
    questionEn: 'What is the remote work policy?',
    priority: 1,
    usageCount: 20
  },
  {
    id: '5',
    category: 'procedure',
    questionVi: 'Cách báo cáo chi phí công tác?',
    questionEn: 'How to report business expenses?',
    priority: 2,
    usageCount: 6
  }
];

const mockQuickActions: QuickAction[] = [
  {
    id: 'find-policy',
    labelVi: 'Tìm Chính sách',
    labelEn: 'Find Policy',
    query: 'Cho tôi biết các chính sách về {{topic}}',
    icon: 'document',
    category: 'policy'
  },
  {
    id: 'find-procedure',
    labelVi: 'Tìm Quy trình',
    labelEn: 'Find Procedure',
    query: 'Quy trình {{process}} được thực hiện như thế nào?',
    icon: 'clipboard',
    category: 'procedure'
  },
  {
    id: 'tech-guide',
    labelVi: 'Hướng dẫn Kỹ thuật',
    labelEn: 'Technical Guide',
    query: 'Hướng dẫn kỹ thuật về {{technology}}',
    icon: 'cog',
    category: 'technical_guide'
  }
];

// Utility function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockSuggestionService {
  async getSuggestions(category?: string, lang: string = 'vi'): Promise<Suggestion[]> {
    await delay(300);
    
    let filteredSuggestions = mockSuggestions;
    if (category) {
      filteredSuggestions = mockSuggestions.filter(s => s.category === category);
    }
    
    return filteredSuggestions.sort((a, b) => b.usageCount - a.usageCount);
  }
  
  async getContextualSuggestions(
    conversationHistory: string[],
    lang: string = 'vi'
  ): Promise<Suggestion[]> {
    await delay(400);
    
    // Simple contextual logic - return suggestions based on keywords in history
    const historyText = conversationHistory.join(' ').toLowerCase();
    let contextualSuggestions: Suggestion[] = [];
    
    if (historyText.includes('policy') || historyText.includes('chính sách')) {
      contextualSuggestions = mockSuggestions.filter(s => s.category === 'policy');
    } else if (historyText.includes('procedure') || historyText.includes('quy trình')) {
      contextualSuggestions = mockSuggestions.filter(s => s.category === 'procedure');
    } else if (historyText.includes('technical') || historyText.includes('kỹ thuật')) {
      contextualSuggestions = mockSuggestions.filter(s => s.category === 'technical_guide');
    } else {
      // Return top suggestions if no specific context
      contextualSuggestions = mockSuggestions.slice(0, 3);
    }
    
    return contextualSuggestions;
  }
  
  async trackSuggestionUsage(suggestionId: string): Promise<void> {
    await delay(100);
    
    const suggestion = mockSuggestions.find(s => s.id === suggestionId);
    if (suggestion) {
      suggestion.usageCount += 1;
    }
    
    console.log(`📊 Suggestion ${suggestionId} usage tracked`);
  }
}

export class MockFeedbackService {
  private feedbacks: FeedbackData[] = [];
  
  async submitFeedback(feedback: FeedbackData): Promise<void> {
    await delay(200);
    
    this.feedbacks.push(feedback);
    console.log('📝 Feedback submitted:', feedback);
  }
  
  async getFeedbackStats(sessionId: string): Promise<{ positive: number; negative: number }> {
    await delay(150);
    
    const sessionFeedbacks = this.feedbacks.filter(f => 
      f.messageId.startsWith(sessionId) // Simple session matching
    );
    
    const positive = sessionFeedbacks.filter(f => f.type === 'thumbs_up').length;
    const negative = sessionFeedbacks.filter(f => f.type === 'thumbs_down').length;
    
    return { positive, negative };
  }
}

export class MockExportService {
  async exportConversation(request: ExportRequest): Promise<{ downloadUrl: string; filename: string }> {
    await delay(1500); // Simulate processing time
    
    const timestamp = new Date().toISOString().slice(0, 16).replace(':', '-');
    const filename = `conversation-${request.sessionId.slice(0, 8)}-${timestamp}.${request.format}`;
    
    // In a real implementation, this would generate the actual file
    const mockDownloadUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(
      `Mock export file for session ${request.sessionId}\nFormat: ${request.format}\nGenerated: ${new Date().toISOString()}`
    )}`;
    
    console.log(`📤 Export generated: ${filename}`);
    
    return {
      downloadUrl: mockDownloadUrl,
      filename
    };
  }
}

export class MockQuickActionService {
  async getQuickActions(lang: string = 'vi'): Promise<QuickAction[]> {
    await delay(200);
    return mockQuickActions;
  }
  
  async executeQuickAction(actionId: string, parameters?: Record<string, string>): Promise<string> {
    await delay(100);
    
    const action = mockQuickActions.find(a => a.id === actionId);
    if (!action) {
      throw new Error('Quick action not found');
    }
    
    let query = action.query;
    if (parameters) {
      Object.entries(parameters).forEach(([key, value]) => {
        query = query.replace(`{{${key}}}`, value);
      });
    }
    
    console.log(`⚡ Quick action executed: ${actionId}`);
    return query;
  }
}

export class MockChatHistoryService {
  private sessions: ConversationSession[] = [
    {
      id: 'session-1',
      title: 'Hỏi về chính sách nghỉ phép',
      lastMessage: 'Cảm ơn bạn đã giải thích rõ ràng!',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      messageCount: 8,
      status: 'archived'
    },
    {
      id: 'session-2',
      title: 'Quy trình onboarding',
      lastMessage: 'Tôi hiểu rồi, còn gì nữa không?',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      messageCount: 12,
      status: 'archived'
    },
    {
      id: 'session-3',
      title: 'Hướng dẫn sử dụng hệ thống',
      lastMessage: 'Đã clear, thanks!',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      messageCount: 5,
      status: 'archived'
    }
  ];
  
  async getConversationHistory(): Promise<ConversationSession[]> {
    await delay(300);
    return this.sessions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  
  async searchConversations(query: string): Promise<ConversationSession[]> {
    await delay(500);
    
    const lowercaseQuery = query.toLowerCase();
    return this.sessions.filter(session =>
      session.title.toLowerCase().includes(lowercaseQuery) ||
      session.lastMessage.toLowerCase().includes(lowercaseQuery)
    );
  }
  
  async deleteConversation(sessionId: string): Promise<void> {
    await delay(200);
    
    const index = this.sessions.findIndex(s => s.id === sessionId);
    if (index > -1) {
      this.sessions.splice(index, 1);
      console.log(`🗑️ Conversation ${sessionId} deleted`);
    }
  }
}

// Export singleton instances
export const mockSuggestionService = new MockSuggestionService();
export const mockFeedbackService = new MockFeedbackService();
export const mockExportService = new MockExportService();
export const mockQuickActionService = new MockQuickActionService();
export const mockChatHistoryService = new MockChatHistoryService();