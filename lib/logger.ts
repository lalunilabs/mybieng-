type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  private formatMessage(entry: LogEntry): string {
    const { level, message, timestamp, context, error } = entry;
    let formatted = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    if (context && Object.keys(context).length > 0) {
      formatted += ` | Context: ${JSON.stringify(context)}`;
    }
    
    if (error) {
      formatted += ` | Error: ${error.message}`;
      if (this.isDevelopment && error.stack) {
        formatted += `\nStack: ${error.stack}`;
      }
    }
    
    return formatted;
  }

  private createLogEntry(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.isProduction) {
      return level === 'warn' || level === 'error';
    }
    return true; // Log everything in development
  }

  debug(message: string, context?: Record<string, any>) {
    if (!this.shouldLog('debug')) return;
    
    const entry = this.createLogEntry('debug', message, context);
    console.debug(this.formatMessage(entry));
  }

  info(message: string, context?: Record<string, any>) {
    if (!this.shouldLog('info')) return;
    
    const entry = this.createLogEntry('info', message, context);
    console.info(this.formatMessage(entry));
  }

  warn(message: string, context?: Record<string, any>, error?: Error) {
    if (!this.shouldLog('warn')) return;
    
    const entry = this.createLogEntry('warn', message, context, error);
    console.warn(this.formatMessage(entry));
    
    // In production, you might want to send warnings to monitoring service
    if (this.isProduction) {
      this.sendToMonitoringService(entry);
    }
  }

  error(message: string, context?: Record<string, any>, error?: Error) {
    if (!this.shouldLog('error')) return;
    
    const entry = this.createLogEntry('error', message, context, error);
    console.error(this.formatMessage(entry));
    
    // Always send errors to monitoring service in production
    if (this.isProduction) {
      this.sendToMonitoringService(entry);
    }
  }

  private sendToMonitoringService(entry: LogEntry) {
    // Placeholder for monitoring service integration
    // TODO: Integrate with Sentry, LogRocket, or similar service
    try {
      // Example: Send to external logging service
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry)
      // });
    } catch (err) {
      console.error('Failed to send log to monitoring service:', err);
    }
  }
}

export const logger = new Logger();
export default logger;
