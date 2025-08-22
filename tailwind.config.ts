
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				'ai-accent': {
					DEFAULT: 'hsl(var(--ai-accent))',
					foreground: 'hsl(var(--ai-accent-foreground))',
					muted: 'hsl(var(--ai-accent-muted))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))',
					muted: 'hsl(var(--success-muted))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))',
					muted: 'hsl(var(--warning-muted))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'pulse-glow': {
					'0%, 100%': { boxShadow: '0 0 0 0 hsl(var(--ai-accent) / 0.4)' },
					'50%': { boxShadow: '0 0 0 8px hsl(var(--ai-accent) / 0)' }
				},
				'flow': {
					'0%': { strokeDashoffset: '20' },
					'100%': { strokeDashoffset: '0' }
				}
			},
			animation: {
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'flow': 'flow 1s linear infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
