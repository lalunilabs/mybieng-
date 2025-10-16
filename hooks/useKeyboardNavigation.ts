'use client';

import { useEffect } from 'react';

interface KeyboardNavigationOptions {
  enableArrowKeys?: boolean;
  enableTabNavigation?: boolean;
  enableEscapeKey?: boolean;
  onEscape?: () => void;
}

export function useKeyboardNavigation(options: KeyboardNavigationOptions = {}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key, ctrlKey, metaKey } = event;
      
      // Handle Escape key
      if (key === 'Escape' && options.enableEscapeKey && options.onEscape) {
        options.onEscape();
        return;
      }

      // Handle arrow key navigation
      if (options.enableArrowKeys) {
        const focusableElements = document.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const currentIndex = Array.from(focusableElements).indexOf(document.activeElement as Element);

        switch (key) {
          case 'ArrowDown':
            event.preventDefault();
            const nextIndex = (currentIndex + 1) % focusableElements.length;
            (focusableElements[nextIndex] as HTMLElement)?.focus();
            break;
          case 'ArrowUp':
            event.preventDefault();
            const prevIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
            (focusableElements[prevIndex] as HTMLElement)?.focus();
            break;
        }
      }

      // Handle keyboard shortcuts
      if (ctrlKey || metaKey) {
        switch (key) {
          case 'k':
            event.preventDefault();
            // Focus search if available
            const searchInput = document.querySelector('input[type="search"], input[placeholder*="search" i]') as HTMLElement;
            searchInput?.focus();
            break;
          case '/':
            event.preventDefault();
            // Focus search
            const searchInput2 = document.querySelector('input[type="search"], input[placeholder*="search" i]') as HTMLElement;
            searchInput2?.focus();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [options]);

  // Enhanced focus management
  useEffect(() => {
    if (options.enableTabNavigation) {
      const style = document.createElement('style');
      style.textContent = `
        .focus-visible {
          outline: 2px solid #8b5cf6;
          outline-offset: 2px;
          border-radius: 4px;
        }
        
        .focus-visible:not(:focus-visible) {
          outline: none;
        }
      `;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
      };
    }
  }, [options.enableTabNavigation]);
}
