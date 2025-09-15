export type AnalyticsEventPayload = {
  event: string;
  props?: Record<string, any>;
  ts?: string;
  path?: string;
};

export function trackEvent(event: string, props?: Record<string, any>) {
  try {
    const payload: AnalyticsEventPayload = {
      event,
      props: props || {},
      ts: new Date().toISOString(),
      path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    };

    if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      (navigator as any).sendBeacon('/api/events', blob);
    } else if (typeof fetch !== 'undefined') {
      fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // swallow
  }
}
