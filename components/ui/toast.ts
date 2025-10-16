'use client';

import { useToast as useToastHook } from './Toast';

export function useToast() {
  return useToastHook();
}

export const toast = {
  success: (title: string, description?: string) => {
    if (typeof window !== 'undefined') {
      const { success } = require('./Toast').useToast();
      success(title, description);
    }
  },
  error: (title: string, description?: string) => {
    if (typeof window !== 'undefined') {
      const { error } = require('./Toast').useToast();
      error(title, description);
    }
  },
  info: (title: string, description?: string) => {
    if (typeof window !== 'undefined') {
      const { info } = require('./Toast').useToast();
      info(title, description);
    }
  },
  warning: (title: string, description?: string) => {
    if (typeof window !== 'undefined') {
      const { warning } = require('./Toast').useToast();
      warning(title, description);
    }
  },
};
