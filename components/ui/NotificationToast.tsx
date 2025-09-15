'use client';

import { useState, useEffect, forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

interface NotificationToastProps extends HTMLAttributes<HTMLDivElement> {
  type?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
  onDismiss?: () => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const types = {
  success: {
    icon: CheckCircle,
    classes: 'bg-green-50 border-green-200 text-green-800',
    iconClasses: 'text-green-600'
  },
  warning: {
    icon: AlertTriangle,
    classes: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    iconClasses: 'text-yellow-600'
  },
  error: {
    icon: XCircle,
    classes: 'bg-red-50 border-red-200 text-red-800',
    iconClasses: 'text-red-600'
  },
  info: {
    icon: Info,
    classes: 'bg-blue-50 border-blue-200 text-blue-800',
    iconClasses: 'text-blue-600'
  }
};

const positions = {
  'top-right': 'fixed top-4 right-4 z-50',
  'top-left': 'fixed top-4 left-4 z-50',
  'bottom-right': 'fixed bottom-4 right-4 z-50',
  'bottom-left': 'fixed bottom-4 left-4 z-50',
  'top-center': 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50',
  'bottom-center': 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50'
};

export const NotificationToast = forwardRef<HTMLDivElement, NotificationToastProps>(
  ({ 
    className,
    type = 'info',
    title,
    message,
    duration = 5000,
    dismissible = true,
    onDismiss,
    position = 'top-right',
    ...props 
  }, ref) => {
    const [visible, setVisible] = useState(true);
    const typeConfig = types[type];
    const Icon = typeConfig.icon;

    useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(() => {
          setVisible(false);
          setTimeout(() => onDismiss?.(), 300);
        }, duration);

        return () => clearTimeout(timer);
      }
    }, [duration, onDismiss]);

    const handleDismiss = () => {
      setVisible(false);
      setTimeout(() => onDismiss?.(), 300);
    };

    if (!visible) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'max-w-sm w-full border rounded-lg shadow-lg p-4 transition-all duration-300 animate-slide-in-right',
          typeConfig.classes,
          positions[position],
          !visible && 'animate-slide-out-right',
          className
        )}
        {...props}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={cn('w-5 h-5', typeConfig.iconClasses)} />
          </div>
          <div className="ml-3 flex-1">
            {title && (
              <h4 className="text-sm font-medium mb-1">{title}</h4>
            )}
            <p className="text-sm">{message}</p>
          </div>
          {dismissible && (
            <button
              onClick={handleDismiss}
              className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

NotificationToast.displayName = 'NotificationToast';

// Toast manager hook
export function useToast() {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    type: NotificationToastProps['type'];
    title?: string;
    message: string;
    duration?: number;
  }>>([]);

  const addToast = (toast: Omit<typeof toasts[0], 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <NotificationToast
          key={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onDismiss={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );

  return {
    toast: addToast,
    ToastContainer
  };
}
