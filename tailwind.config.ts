import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', 'class'],
  theme: {
  	extend: {
  		colors: {
  			brand: {
  				'50': '#eef2ff',
  				'100': '#e0e7ff',
  				'200': '#c7d2fe',
  				'300': '#a5b4fc',
  				'400': '#818cf8',
  				'500': '#6366f1',
  				'600': '#4f46e5',
  				'700': '#4338ca',
  				'800': '#3730a3',
  				'900': '#312e81',
  				'950': '#1e1b4b',
  				DEFAULT: '#6366f1',
  				foreground: '#ffffff'
  			},
  			primary: {
  				'50': '#eef2ff',
  				'100': '#e0e7ff',
  				'200': '#c7d2fe',
  				'300': '#a5b4fc',
  				'400': '#818cf8',
  				'500': '#6366f1',
  				'600': '#4f46e5',
  				'700': '#4338ca',
  				'800': '#3730a3',
  				'900': '#312e81',
  				DEFAULT: 'rgb(var(--primary))',
  				foreground: 'rgb(var(--primary-foreground))'
  			},
  			secondary: {
  				'50': '#f8fafc',
  				'100': '#f1f5f9',
  				'200': '#e2e8f0',
  				'300': '#cbd5e1',
  				'400': '#94a3b8',
  				'500': '#64748b',
  				'600': '#475569',
  				'700': '#334155',
  				'800': '#1e293b',
  				'900': '#0f172a',
  				DEFAULT: 'rgb(var(--secondary))',
  				foreground: 'rgb(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'rgb(var(--muted))',
  				foreground: 'rgb(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'rgb(var(--accent))',
  				foreground: 'rgb(var(--accent-foreground))'
  			},
  			paper: 'rgb(var(--paper))',
  			destructive: {
  				DEFAULT: 'rgb(var(--error))',
  				foreground: '#ffffff'
  			},
  			border: 'rgb(var(--border))',
  			input: 'rgb(var(--input))',
  			ring: 'rgb(var(--ring))',
  			background: 'rgb(var(--background))',
  			foreground: 'rgb(var(--foreground))'
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'ui-sans-serif',
  				'system-ui',
  				'sans-serif'
  			],
  			mono: [
  				'ui-monospace',
  				'SF Mono',
  				'Cascadia Code',
  				'Roboto Mono',
  				'monospace'
  			]
  		},
  		fontSize: {
  			xs: [
  				'0.75rem',
  				{
  					lineHeight: '1rem'
  				}
  			],
  			sm: [
  				'0.875rem',
  				{
  					lineHeight: '1.25rem'
  				}
  			],
  			base: [
  				'1rem',
  				{
  					lineHeight: '1.5rem'
  				}
  			],
  			lg: [
  				'1.125rem',
  				{
  					lineHeight: '1.75rem'
  				}
  			],
  			xl: [
  				'1.25rem',
  				{
  					lineHeight: '1.75rem'
  				}
  			],
  			'2xl': [
  				'1.5rem',
  				{
  					lineHeight: '2rem'
  				}
  			],
  			'3xl': [
  				'1.875rem',
  				{
  					lineHeight: '2.25rem'
  				}
  			],
  			'4xl': [
  				'2.25rem',
  				{
  					lineHeight: '2.5rem'
  				}
  			],
  			'5xl': [
  				'3rem',
  				{
  					lineHeight: '1'
  				}
  			],
  			'6xl': [
  				'3.75rem',
  				{
  					lineHeight: '1'
  				}
  			],
  			'7xl': [
  				'4.5rem',
  				{
  					lineHeight: '1'
  				}
  			],
  			'8xl': [
  				'6rem',
  				{
  					lineHeight: '1'
  				}
  			],
  			'9xl': [
  				'8rem',
  				{
  					lineHeight: '1'
  				}
  			]
  		},
  		screens: {
  			xs: '475px',
  			sm: '640px',
  			md: '768px',
  			lg: '1024px',
  			xl: '1280px',
  			'2xl': '1536px',
  			'3xl': '1920px'
  		},
  		spacing: {
  			'18': '4.5rem',
  			'88': '22rem',
  			'128': '32rem',
  			'144': '36rem'
  		},
  		borderRadius: {
  			xl: '1rem',
  			'2xl': '1.5rem',
  			'3xl': '2rem'
  		},
  		boxShadow: {
  			soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
  			medium: '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  			large: '0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 2px 10px -2px rgba(0, 0, 0, 0.04)',
  			glow: '0 0 20px rgba(99, 102, 241, 0.3)',
  			'glow-lg': '0 0 40px rgba(99, 102, 241, 0.4)',
  			brutal: '4px 4px 0 0 rgba(15, 23, 42, 0.9)',
  			'brutal-lg': '6px 6px 0 0 rgba(15, 23, 42, 0.95)'
  		},
  		animation: {
			'fade-in': 'fade-in 0.5s ease-out',
			'fade-in-up': 'fade-in-up 0.6s ease-out',
			'fade-in-down': 'fade-in-down 0.6s ease-out',
			'slide-in': 'slide-in 0.3s ease-out',
			'slide-in-left': 'slide-in-left 0.4s ease-out',
			'slide-in-right': 'slide-in-right 0.4s ease-out',
			'scale-in': 'scale-in 0.2s ease-out',
			'bounce-in': 'bounce-in 0.6s ease-out',
			'zoom-in': 'zoom-in 0.3s ease-out',
			shimmer: 'shimmer 2s linear infinite',
			float: 'float 3s ease-in-out infinite',
			'float-delayed': 'float 3s ease-in-out infinite 1s',
			'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
			'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
			'accordion-down': 'accordion-down 0.2s ease-out',
			'accordion-up': 'accordion-up 0.2s ease-out',
			'gradient-x': 'gradient-x 15s ease infinite',
			'gradient-y': 'gradient-y 15s ease infinite',
			'gradient-xy': 'gradient-xy 15s ease infinite',
			'spin-slow': 'spin 3s linear infinite',
			'wiggle': 'wiggle 1s ease-in-out infinite',
			'text-shimmer': 'text-shimmer 2.5s ease-in-out infinite',
			'morph': 'morph 8s ease-in-out infinite',
			'slide-up': 'slide-up 0.4s ease-out',
			'slide-down': 'slide-down 0.4s ease-out'
		},
  		keyframes: {
			'fade-in': {
				'0%': {
					opacity: '0',
					transform: 'translateY(10px)'
				},
				'100%': {
					opacity: '1',
					transform: 'translateY(0)'
				}
			},
			'fade-in-up': {
				'0%': {
					opacity: '0',
					transform: 'translateY(30px)'
				},
				'100%': {
					opacity: '1',
					transform: 'translateY(0)'
				}
			},
			'fade-in-down': {
				'0%': {
					opacity: '0',
					transform: 'translateY(-30px)'
				},
				'100%': {
					opacity: '1',
					transform: 'translateY(0)'
				}
			},
			'slide-in': {
				'0%': {
					opacity: '0',
					transform: 'translateX(-10px)'
				},
				'100%': {
					opacity: '1',
					transform: 'translateX(0)'
				}
			},
			'slide-in-left': {
				'0%': {
					opacity: '0',
					transform: 'translateX(-50px)'
				},
				'100%': {
					opacity: '1',
					transform: 'translateX(0)'
				}
			},
			'slide-in-right': {
				'0%': {
					opacity: '0',
					transform: 'translateX(50px)'
				},
				'100%': {
					opacity: '1',
					transform: 'translateX(0)'
				}
			},
			'slide-up': {
				'0%': {
					transform: 'translateY(100%)'
				},
				'100%': {
					transform: 'translateY(0)'
				}
			},
			'slide-down': {
				'0%': {
					transform: 'translateY(-100%)'
				},
				'100%': {
					transform: 'translateY(0)'
				}
			},
			'scale-in': {
				'0%': {
					opacity: '0',
					transform: 'scale(0.95)'
				},
				'100%': {
					opacity: '1',
					transform: 'scale(1)'
				}
			},
			'zoom-in': {
				'0%': {
					opacity: '0',
					transform: 'scale(0.8)'
				},
				'100%': {
					opacity: '1',
					transform: 'scale(1)'
				}
			},
			'bounce-in': {
				'0%': {
					opacity: '0',
					transform: 'scale(0.3)'
				},
				'50%': {
					opacity: '1',
					transform: 'scale(1.05)'
				},
				'70%': {
					transform: 'scale(0.9)'
				},
				'100%': {
					opacity: '1',
					transform: 'scale(1)'
				}
			},
			float: {
				'0%, 100%': {
					transform: 'translateY(0px)'
				},
				'50%': {
					transform: 'translateY(-10px)'
				}
			},
			shimmer: {
				'0%': {
					backgroundPosition: '-200px 0'
				},
				'100%': {
					backgroundPosition: 'calc(200px + 100%) 0'
				}
			},
			'text-shimmer': {
				'0%': {
					backgroundPosition: '0% 50%'
				},
				'50%': {
					backgroundPosition: '100% 50%'
				},
				'100%': {
					backgroundPosition: '0% 50%'
				}
			},
			'pulse-glow': {
				'0%, 100%': {
					boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)'
				},
				'50%': {
					boxShadow: '0 0 40px rgba(99, 102, 241, 0.6)'
				}
			},
			'gradient-x': {
				'0%, 100%': {
					backgroundPosition: '0% 50%'
				},
				'50%': {
					backgroundPosition: '100% 50%'
				}
			},
			'gradient-y': {
				'0%, 100%': {
					backgroundPosition: '50% 0%'
				},
				'50%': {
					backgroundPosition: '50% 100%'
				}
			},
			'gradient-xy': {
				'0%, 100%': {
					backgroundPosition: '0% 50%'
				},
				'25%': {
					backgroundPosition: '100% 50%'
				},
				'50%': {
					backgroundPosition: '100% 100%'
				},
				'75%': {
					backgroundPosition: '0% 100%'
				}
			},
			wiggle: {
				'0%, 100%': {
					transform: 'rotate(-3deg)'
				},
				'50%': {
					transform: 'rotate(3deg)'
				}
			},
			morph: {
				'0%, 100%': {
					borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%'
				},
				'50%': {
					borderRadius: '30% 60% 70% 40%/50% 60% 30% 60%'
				}
			},
			'accordion-down': {
				from: {
					height: '0'
				},
				to: {
					height: 'var(--radix-accordion-content-height)'
				}
			},
			'accordion-up': {
				from: {
					height: 'var(--radix-accordion-content-height)'
				},
				to: {
					height: '0'
				}
			}
		},
  		backdropBlur: {
  			xs: '2px'
  		},
  		transitionTimingFunction: {
  			bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  			smooth: 'cubic-bezier(0.4, 0, 0.2, 1)'
  		}
  	}
  },
  plugins: [animate],
}
export default config
