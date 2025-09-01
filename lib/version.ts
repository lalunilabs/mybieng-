/**
 * MyBeing Platform Version Management
 * Centralized version tracking for the entire application and components
 */

export const APP_VERSION = '1.0.0';
export const BUILD_DATE = '2025-08-27';

// Component versions for tracking individual component updates
export const COMPONENT_VERSIONS = {
  // UI Components
  Button: '1.0.0',
  Card: '1.0.0',
  Utils: '1.0.0',
  
  // Dashboard Components
  UserProfile: '1.0.0',
  DashboardStats: '1.0.0',
  ProgressCircle: '1.0.0',
  QuizHistory: '1.0.0',
  AIChat: '1.0.0',
  
  // Platform Components
  SocialConnect: '1.0.0',
  LandingPage: '1.0.0',
  DashboardPage: '1.0.0',
  AdminPanel: '1.0.0',
} as const;

// Feature flags and version-specific configurations
export const FEATURE_FLAGS = {
  aiChatEnabled: true,
  socialIntegrationEnabled: true,
  adminPanelEnabled: true,
  progressTrackingEnabled: true,
  quizHistoryEnabled: true,
} as const;

// Version history for major releases
export const VERSION_HISTORY = [
  {
    version: '1.0.0',
    date: '2025-08-27',
    title: 'Initial Release - Professional Self-Discovery Platform',
    features: [
      'Complete dashboard system with modern UI components',
      'Professional landing page with senior product design principles',
      'Comprehensive admin panel with analytics and management',
      'Social integration system for Spotify and Instagram',
      'Brand color system with purple-based identity',
      'Research-backed quiz system with AI chat integration',
      'Accessibility-compliant UI component library',
      'Physics-based animations and interaction design'
    ],
    breaking: [],
    fixes: [],
    notes: 'First stable release of the MyBeing platform with complete feature set'
  }
] as const;

// Get current version info
export function getVersionInfo() {
  return {
    version: APP_VERSION,
    buildDate: BUILD_DATE,
    components: COMPONENT_VERSIONS,
    features: FEATURE_FLAGS,
  };
}

// Get component version
export function getComponentVersion(componentName: keyof typeof COMPONENT_VERSIONS): string {
  return COMPONENT_VERSIONS[componentName] || 'unknown';
}

// Check if feature is enabled
export function isFeatureEnabled(feature: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[feature];
}

// Get latest version from history
export function getLatestVersion() {
  return VERSION_HISTORY[0];
}

// Format version for display
export function formatVersion(version: string = APP_VERSION): string {
  return `v${version}`;
}

// Get full version string with build date
export function getFullVersionString(): string {
  return `${formatVersion()} (${BUILD_DATE})`;
}
