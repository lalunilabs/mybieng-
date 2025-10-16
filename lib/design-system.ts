// Unified Design System for MyBeing
// Consistent colors, animations, and components across all pages

export const designSystem = {
  // Color Palette - Consistent across all pages
  colors: {
    slate: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    violet: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    }
  },

  // Typography Scale - Consistent sizing
  typography: {
    display: 'text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight',
    h1: 'text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight',
    h2: 'text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight',
    h3: 'text-xl sm:text-2xl lg:text-3xl font-semibold',
    h4: 'text-lg sm:text-xl lg:text-2xl font-semibold',
    body: 'text-base sm:text-lg leading-relaxed',
    small: 'text-sm leading-normal',
    caption: 'text-xs leading-snug',
  },

  // Spacing Scale - Consistent margins and padding
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
    '3xl': '6rem',
    '4xl': '8rem',
  },

  // Animation Presets - Consistent across all components
  animations: {
    // Page transitions
    pageEnter: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6, ease: "easeOut" }
    },
    
    // Staggered children
    staggerContainer: {
      animate: { transition: { staggerChildren: 0.1 } }
    },
    
    staggerChild: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4 }
    },

    // Hover effects
    hoverScale: {
      whileHover: { scale: 1.02 },
      transition: { duration: 0.2 }
    },

    // Button interactions
    buttonPress: {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
      transition: { duration: 0.2 }
    },

    // Fade in from sides
    slideInLeft: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.5 }
    },

    slideInRight: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.5 }
    }
  },

  // Component Styles - Reusable across pages
  components: {
    card: {
      base: 'rounded-3xl border border-slate-200/50 bg-white/80 backdrop-blur-sm shadow-xl shadow-slate-500/10',
      hover: 'hover:shadow-2xl hover:shadow-slate-500/20 transition-all duration-300',
      padding: 'p-6 sm:p-8'
    },

    button: {
      primary: 'bg-gradient-to-r from-violet-600 to-violet-700 text-white hover:from-violet-700 hover:to-violet-800 shadow-lg shadow-violet-500/25',
      secondary: 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 hover:from-slate-200 hover:to-slate-300',
      outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50',
      base: 'rounded-2xl px-6 py-3 font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50'
    },

    input: {
      base: 'w-full rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200 transition-all duration-300'
    },

    badge: {
      primary: 'inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-100 to-violet-200 px-4 py-2 text-xs font-bold uppercase tracking-wider text-violet-700 shadow-sm',
      secondary: 'inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-slate-100 to-slate-200 px-3 py-1 text-xs font-semibold text-slate-700'
    }
  },

  // Gradients - Consistent background patterns
  gradients: {
    page: 'bg-gradient-to-br from-slate-50 via-white to-purple-50/30',
    card: {
      violet: 'bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50',
      amber: 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50',
      emerald: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50',
      indigo: 'bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50',
      slate: 'bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50'
    }
  }
};

// Helper functions for consistent styling
export const getCardClasses = (variant: 'violet' | 'amber' | 'emerald' | 'indigo' | 'slate' = 'violet') => {
  return `${designSystem.components.card.base} ${designSystem.components.card.hover} ${designSystem.components.card.padding} ${designSystem.gradients.card[variant]}`;
};

export const getButtonClasses = (variant: 'primary' | 'secondary' | 'outline' = 'primary') => {
  return `${designSystem.components.button.base} ${designSystem.components.button[variant]}`;
};

export const getBadgeClasses = (variant: 'primary' | 'secondary' = 'primary') => {
  return designSystem.components.badge[variant];
};

// Animation variants for consistent motion
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerChild = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 }
};
