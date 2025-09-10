// src/components/chat/ExportDialog.tsx
'use client'

import { useState } from 'react';
import { ExportFormat, ExportRequest, ChatMessage } from '@/types/chat.types';
import { mockExportService } from '@/services/mockApi';
import { i18nService } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  sessionId: string;
}

export function ExportDialog({ isOpen, onClose, messages, sessionId }: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [includeSystemMessages, setIncludeSystemMessages] = useState(false);
  const [includeAttachments, setIncludeAttachments] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formats: Array<{ id: ExportFormat; name: string; description: string; icon: string }> = [
    {
      id: 'pdf',
      name: i18nService.t('export.formats.pdf'),
      description: 'Formatted document with styling',
      icon: '📄'
    },
    {
      id: 'json',
      name: i18nService.t('export.formats.json'),
      description: 'Structured data format',
      icon: '🔧'
    },
    {
      id: 'txt',
      name: i18nService.t('export.formats.txt'),
      description: 'Plain text format',
      icon: '📝'
    },
    {
      id: 'html',
      name: i18nService.t('export.formats.html'),
      description: 'Web page format',
      icon: '🌐'
    }
  ];

  const handleExport = async () => {
    if (messages.length === 0) {
      setError(i18nService.t('export.noMessages'));
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      const exportRequest: ExportRequest = {
        format: selectedFormat,
        sessionId,
        includeSystemMessages,
        includeAttachments
      };

      const result = await mockExportService.exportConversation(exportRequest);

      // Create download link
      const link = document.createElement('a');
      link.href = result.downloadUrl;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success message
      const successMessage = i18nService.t('export.success');
      alert(successMessage);

      onClose();
    } catch (err) {
      console.error('Export failed:', err);
      setError(err instanceof Error ? err.message : i18nService.t('export.error'));
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      
      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className={cn(
          "bg-background border border-border rounded-lg shadow-lg w-full max-w-md",
          "animate-in fade-in-0 zoom-in-95 duration-200"
        )}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <span>📤</span>
              {i18nService.t('export.title')}
            </h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
              disabled={isExporting}
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Format Selection */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Export Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                {formats.map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border transition-colors text-left",
                      selectedFormat === format.id
                        ? 'border-primary bg-primary/5 text-foreground'
                        : 'border-border bg-background hover:bg-accent text-muted-foreground'
                    )}
                    disabled={isExporting}
                  >
                    <span className="text-lg">{format.icon}</span>
                    <div>
                      <div className="font-medium">{format.name}</div>
                      <div className="text-xs opacity-75">{format.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Export Options
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSystemMessages}
                    onChange={(e) => setIncludeSystemMessages(e.target.checked)}
                    className="rounded border-border"
                    disabled={isExporting}
                  />
                  <div>
                    <div className="text-sm text-foreground">
                      {i18nService.t('export.options.includeSystemMessages')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Include system notifications and status messages
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeAttachments}
                    onChange={(e) => setIncludeAttachments(e.target.checked)}
                    className="rounded border-border"
                    disabled={isExporting}
                  />
                  <div>
                    <div className="text-sm text-foreground">
                      {i18nService.t('export.options.includeAttachments')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Include file attachments and sources
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Preview Info */}
            <div className="bg-muted/30 p-3 rounded-lg">
              <div className="text-sm text-foreground mb-1">Export Preview</div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>• {messages.length} total messages</div>
                <div>• Session ID: {sessionId.slice(0, 8)}...</div>
                <div>• Format: {selectedFormat.toUpperCase()}</div>
                <div>• Size estimate: ~{Math.ceil(messages.length * 0.5)}KB</div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-3 text-red-700 text-sm">
                ❌ {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isExporting}
            >
              {i18nService.t('common.cancel')}
            </Button>
            
            <Button
              onClick={handleExport}
              disabled={isExporting || messages.length === 0}
              loading={isExporting}
            >
              {isExporting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  {i18nService.t('export.downloading')}
                </>
              ) : (
                <>
                  <span className="mr-2">📤</span>
                  Export {selectedFormat.toUpperCase()}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}