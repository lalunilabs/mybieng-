'use client';

import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, ArrowLeft, ArrowRight, X, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Keyboard Shortcuts System
 * Power-user features with visual feedback
 */

interface ShortcutAction {
  keys: string[];
  description: string;
  action: () => void;
  enabled?: boolean;
}

interface UseKeyboardShortcutsOptions {
  shortcuts: ShortcutAction[];
  enabled?: boolean;
}

export function useKeyboardShortcuts({ shortcuts, enabled = true }: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach(({ keys, action, enabled: shortcutEnabled = true }) => {
        if (!shortcutEnabled) return;

        const modifiers = {
          ctrl: event.ctrlKey || event.metaKey,
          shift: event.shiftKey,
          alt: event.altKey
        };

        const matches = keys.every((key) => {
          if (key === 'ctrl' || key === 'cmd') return modifiers.ctrl;
          if (key === 'shift') return modifiers.shift;
          if (key === 'alt') return modifiers.alt;
          return event.key.toLowerCase() === key.toLowerCase();
        });

        if (matches) {
          event.preventDefault();
          action();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}

// Keyboard shortcut tooltip component
interface ShortcutBadgeProps {
  keys: string[];
  className?: string;
}

export function ShortcutBadge({ keys, className }: ShortcutBadgeProps) {
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  const formatKey = (key: string) => {
    if (key === 'ctrl' || key === 'cmd') return isMac ? '⌘' : 'Ctrl';
    if (key === 'shift') return '⇧';
    if (key === 'alt') return isMac ? '⌥' : 'Alt';
    if (key === 'enter') return '↵';
    if (key === 'escape') return 'Esc';
    if (key === 'arrowleft') return '←';
    if (key === 'arrowright') return '→';
    if (key === 'arrowup') return '↑';
    if (key === 'arrowdown') return '↓';
    return key.toUpperCase();
  };

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      {keys.map((key, index) => (
        <span key={index} className="inline-flex items-center">
          <kbd className="px-2 py-1 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded shadow-sm">
            {formatKey(key)}
          </kbd>
          {index < keys.length - 1 && (
            <span className="mx-1 text-xs text-gray-400">+</span>
          )}
        </span>
      ))}
    </div>
  );
}

// Shortcuts help modal
interface ShortcutsHelpProps {
  shortcuts: { keys: string[]; description: string; category?: string }[];
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutsHelp({ shortcuts, isOpen, onClose }: ShortcutsHelpProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Group shortcuts by category
  const grouped = shortcuts.reduce((acc, shortcut) => {
    const category = shortcut.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(shortcut);
    return acc;
  }, {} as Record<string, typeof shortcuts>);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-white rounded-2xl shadow-2xl z-50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Command className="w-6 h-6 text-indigo-500" />
                Keyboard Shortcuts
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {items.map((shortcut, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-sm text-gray-700">
                          {shortcut.description}
                        </span>
                        <ShortcutBadge keys={shortcut.keys} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Press <ShortcutBadge keys={['?']} /> to toggle this help, or{' '}
                <ShortcutBadge keys={['escape']} /> to close
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Quiz-specific keyboard shortcuts hook
interface QuizKeyboardShortcutsOptions {
  onNext?: () => void;
  onPrevious?: () => void;
  onSubmit?: () => void;
  onPause?: () => void;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  enabled?: boolean;
}

export function useQuizKeyboardShortcuts({
  onNext,
  onPrevious,
  onSubmit,
  onPause,
  canGoNext = true,
  canGoPrevious = true,
  enabled = true
}: QuizKeyboardShortcutsOptions) {
  const [showHelper, setShowHelper] = useState(false);

  const shortcuts: ShortcutAction[] = [
    {
      keys: ['arrowright'],
      description: 'Next question',
      action: () => onNext?.(),
      enabled: canGoNext && !!onNext
    },
    {
      keys: ['arrowleft'],
      description: 'Previous question',
      action: () => onPrevious?.(),
      enabled: canGoPrevious && !!onPrevious
    },
    {
      keys: ['ctrl', 'enter'],
      description: 'Submit quiz',
      action: () => onSubmit?.(),
      enabled: !!onSubmit
    },
    {
      keys: ['ctrl', 'p'],
      description: 'Pause quiz',
      action: () => onPause?.(),
      enabled: !!onPause
    },
    {
      keys: ['?'],
      description: 'Show keyboard shortcuts',
      action: () => setShowHelper(prev => !prev),
      enabled: true
    }
  ];

  useKeyboardShortcuts({ shortcuts, enabled });

  return {
    showHelper,
    setShowHelper,
    shortcuts: shortcuts.filter(s => s.enabled).map(({ keys, description }) => ({ 
      keys, 
      description,
      category: 'Quiz Navigation'
    }))
  };
}

// Visual feedback when shortcut is triggered
interface ShortcutFeedbackProps {
  keys: string[];
  description: string;
  show: boolean;
}

export function ShortcutFeedback({ keys, description, show }: ShortcutFeedbackProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">
            <ShortcutBadge keys={keys} className="opacity-75" />
            <span className="text-sm font-medium">{description}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Global keyboard shortcuts (search, navigation, etc.)
export function useGlobalShortcuts({
  onSearch,
  onOpenProfile,
  onOpenHelp,
  enabled = true
}: {
  onSearch?: () => void;
  onOpenProfile?: () => void;
  onOpenHelp?: () => void;
  enabled?: boolean;
}) {
  const shortcuts: ShortcutAction[] = [
    {
      keys: ['ctrl', 'k'],
      description: 'Open search',
      action: () => onSearch?.(),
      enabled: !!onSearch
    },
    {
      keys: ['ctrl', 'p'],
      description: 'Open profile',
      action: () => onOpenProfile?.(),
      enabled: !!onOpenProfile
    },
    {
      keys: ['?'],
      description: 'Show help',
      action: () => onOpenHelp?.(),
      enabled: !!onOpenHelp
    }
  ];

  useKeyboardShortcuts({ shortcuts, enabled });
}
