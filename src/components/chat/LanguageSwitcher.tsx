// src/components/chat/LanguageSwitcher.tsx
'use client'

import { useState, useEffect } from 'react';
import { Language, i18nService } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  onLanguageChange?: (language: Language) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export function LanguageSwitcher({ 
  onLanguageChange, 
  className,
  size = 'md'
}: LanguageSwitcherProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('vi');
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'vi' as Language, name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' }
  ];

  useEffect(() => {
    const savedLanguage = i18nService.getLanguage();
    setCurrentLanguage(savedLanguage);
  }, []);

  const handleLanguageChange = (languageCode: Language) => {
    i18nService.setLanguage(languageCode);
    setCurrentLanguage(languageCode);
    setIsOpen(false);
    onLanguageChange?.(languageCode);
  };

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md border border-border",
          "bg-background hover:bg-accent transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary/20",
          size === 'sm' ? 'text-xs' : 'text-sm',
          size === 'sm' ? 'px-2 py-1' : 'px-3 py-2'
        )}
        title={i18nService.t('language.switch')}
      >
        <span className="text-base">{currentLang?.flag}</span>
        <span className="hidden sm:inline font-medium">
          {currentLang?.name}
        </span>
        <span className={cn(
          "transition-transform",
          isOpen ? 'rotate-180' : 'rotate-0'
        )}>
          ▼
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className={cn(
            "absolute right-0 mt-2 py-1 w-40 bg-popover border border-border rounded-md shadow-lg z-20",
            "animate-in fade-in-0 zoom-in-95 duration-100"
          )}>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-left",
                  "hover:bg-accent transition-colors",
                  size === 'sm' ? 'text-xs' : 'text-sm',
                  currentLanguage === lang.code 
                    ? 'bg-accent font-medium' 
                    : 'font-normal'
                )}
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.name}</span>
                {currentLanguage === lang.code && (
                  <span className="ml-auto text-primary">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Hook to use language in components
export function useLanguage() {
  const [language, setLanguage] = useState<Language>('vi');

  useEffect(() => {
    const savedLanguage = i18nService.getLanguage();
    setLanguage(savedLanguage);
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    i18nService.setLanguage(newLanguage);
    setLanguage(newLanguage);
  };

  const t = (key: string) => i18nService.t(key);

  return {
    language,
    changeLanguage,
    t,
  };
}