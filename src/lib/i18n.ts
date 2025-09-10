// src/lib/i18n.ts
export type Language = 'vi' | 'en';

export interface TranslationKeys {
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    save: string;
    delete: string;
    edit: string;
    send: string;
  };
  
  // Chat
  chat: {
    title: string;
    placeholder: string;
    clear: string;
    export: string;
    typing: string;
    connected: string;
    connecting: string;
    disconnected: string;
    refresh: string;
    noMessages: string;
    messageSent: string;
    messageReceived: string;
  };
  
  // Suggestions
  suggestions: {
    title: string;
    noSuggestions: string;
    loading: string;
  };
  
  // Quick Actions
  quickActions: {
    findPolicy: string;
    findProcedure: string;
    techGuide: string;
    findPolicyQuery: string;
    findProcedureQuery: string;
    techGuideQuery: string;
  };
  
  // Feedback
  feedback: {
    thankYou: string;
    commentPlaceholder: string;
    submit: string;
    cancel: string;
    positive: string;
    negative: string;
    helpful: string;
    notHelpful: string;
  };
  
  // Export
  export: {
    title: string;
    formats: {
      pdf: string;
      json: string;
      txt: string;
      html: string;
    };
    options: {
      includeSystemMessages: string;
      includeAttachments: string;
      dateRange: string;
    };
    downloading: string;
    success: string;
    error: string;
    noMessages: string;
  };
  
  // Language
  language: {
    switch: string;
    vietnamese: string;
    english: string;
  };
  
  // History
  history: {
    title: string;
    search: string;
    noResults: string;
    deleteConfirm: string;
    today: string;
    yesterday: string;
    thisWeek: string;
    older: string;
    messageCount: string;
  };
}

const viTranslations: TranslationKeys = {
  common: {
    loading: 'Đang tải...',
    error: 'Có lỗi xảy ra',
    success: 'Thành công',
    cancel: 'Hủy',
    confirm: 'Xác nhận',
    save: 'Lưu',
    delete: 'Xóa',
    edit: 'Sửa',
    send: 'Gửi',
  },
  chat: {
    title: 'Trợ lý Chat',
    placeholder: 'Nhập tin nhắn của bạn...',
    clear: 'Xóa cuộc trò chuyện',
    export: 'Xuất cuộc trò chuyện',
    typing: 'Đang soạn tin...',
    connected: 'Đã kết nối',
    connecting: 'Đang kết nối...',
    disconnected: 'Mất kết nối',
    refresh: 'Làm mới',
    noMessages: 'Chưa có tin nhắn nào',
    messageSent: 'Tin nhắn đã gửi',
    messageReceived: 'Tin nhắn đã nhận',
  },
  suggestions: {
    title: 'Câu hỏi gợi ý',
    noSuggestions: 'Không có gợi ý nào',
    loading: 'Đang tải gợi ý...',
  },
  quickActions: {
    findPolicy: 'Tìm Chính sách',
    findProcedure: 'Tìm Quy trình',
    techGuide: 'Hướng dẫn Kỹ thuật',
    findPolicyQuery: 'Cho tôi biết các chính sách về',
    findProcedureQuery: 'Quy trình này được thực hiện như thế nào?',
    techGuideQuery: 'Hướng dẫn kỹ thuật về',
  },
  feedback: {
    thankYou: 'Cảm ơn phản hồi của bạn!',
    commentPlaceholder: 'Chia sẻ chi tiết về trải nghiệm của bạn...',
    submit: 'Gửi',
    cancel: 'Hủy',
    positive: 'Hữu ích',
    negative: 'Không hữu ích',
    helpful: 'Hữu ích',
    notHelpful: 'Không hữu ích',
  },
  export: {
    title: 'Xuất cuộc trò chuyện',
    formats: {
      pdf: 'PDF',
      json: 'JSON',
      txt: 'Text',
      html: 'HTML',
    },
    options: {
      includeSystemMessages: 'Bao gồm tin nhắn hệ thống',
      includeAttachments: 'Bao gồm tệp đính kèm',
      dateRange: 'Khoảng thời gian',
    },
    downloading: 'Đang tải xuống...',
    success: 'Xuất thành công!',
    error: 'Lỗi khi xuất file',
    noMessages: 'Không có tin nhắn để xuất',
  },
  language: {
    switch: 'Chuyển ngôn ngữ',
    vietnamese: 'Tiếng Việt',
    english: 'English',
  },
  history: {
    title: 'Lịch sử trò chuyện',
    search: 'Tìm kiếm cuộc trò chuyện...',
    noResults: 'Không tìm thấy kết quả',
    deleteConfirm: 'Bạn có chắc muốn xóa cuộc trò chuyện này?',
    today: 'Hôm nay',
    yesterday: 'Hôm qua',
    thisWeek: 'Tuần này',
    older: 'Cũ hơn',
    messageCount: 'tin nhắn',
  },
};

const enTranslations: TranslationKeys = {
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    send: 'Send',
  },
  chat: {
    title: 'Chat Assistant',
    placeholder: 'Type your message...',
    clear: 'Clear conversation',
    export: 'Export conversation',
    typing: 'Typing...',
    connected: 'Connected',
    connecting: 'Connecting...',
    disconnected: 'Disconnected',
    refresh: 'Refresh',
    noMessages: 'No messages yet',
    messageSent: 'Message sent',
    messageReceived: 'Message received',
  },
  suggestions: {
    title: 'Suggested questions',
    noSuggestions: 'No suggestions available',
    loading: 'Loading suggestions...',
  },
  quickActions: {
    findPolicy: 'Find Policy',
    findProcedure: 'Find Procedure',
    techGuide: 'Technical Guide',
    findPolicyQuery: 'Tell me about policies regarding',
    findProcedureQuery: 'How is this procedure performed?',
    techGuideQuery: 'Technical guide for',
  },
  feedback: {
    thankYou: 'Thank you for your feedback!',
    commentPlaceholder: 'Share details about your experience...',
    submit: 'Submit',
    cancel: 'Cancel',
    positive: 'Helpful',
    negative: 'Not helpful',
    helpful: 'Helpful',
    notHelpful: 'Not helpful',
  },
  export: {
    title: 'Export conversation',
    formats: {
      pdf: 'PDF',
      json: 'JSON',
      txt: 'Text',
      html: 'HTML',
    },
    options: {
      includeSystemMessages: 'Include system messages',
      includeAttachments: 'Include attachments',
      dateRange: 'Date range',
    },
    downloading: 'Downloading...',
    success: 'Export successful!',
    error: 'Error exporting file',
    noMessages: 'No messages to export',
  },
  language: {
    switch: 'Switch language',
    vietnamese: 'Tiếng Việt',
    english: 'English',
  },
  history: {
    title: 'Chat History',
    search: 'Search conversations...',
    noResults: 'No results found',
    deleteConfirm: 'Are you sure you want to delete this conversation?',
    today: 'Today',
    yesterday: 'Yesterday',
    thisWeek: 'This week',
    older: 'Older',
    messageCount: 'messages',
  },
};

const translations: Record<Language, TranslationKeys> = {
  vi: viTranslations,
  en: enTranslations,
};

export class I18nService {
  private currentLanguage: Language = 'vi';
  
  setLanguage(language: Language): void {
    this.currentLanguage = language;
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
    }
  }
  
  getLanguage(): Language {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('language') as Language;
      if (stored && ['vi', 'en'].includes(stored)) {
        this.currentLanguage = stored;
        return stored;
      }
    }
    return this.currentLanguage;
  }
  
  t(key: string): string {
    const keys = key.split('.');
    let value: any = translations[this.currentLanguage];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  }
  
  getTranslations(): TranslationKeys {
    return translations[this.currentLanguage];
  }
}

export const i18nService = new I18nService();