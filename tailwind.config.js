/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0a0a0f',
                    light: '#12121a',
                    dark: '#050508',
                },
                card: {
                    DEFAULT: 'rgba(20, 20, 30, 0.8)',
                    hover: 'rgba(30, 30, 45, 0.9)',
                },
                accent: {
                    cyan: '#00d4ff',
                    purple: '#a855f7',
                    pink: '#ec4899',
                    green: '#22c55e',
                    red: '#ef4444',
                    orange: '#f97316',
                    yellow: '#eab308',
                },
                glass: {
                    border: 'rgba(255, 255, 255, 0.1)',
                    bg: 'rgba(20, 20, 30, 0.7)',
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'gradient-mesh': 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(168, 85, 247, 0.1) 50%, rgba(236, 72, 153, 0.1) 100%)',
            },
            boxShadow: {
                'glow-cyan': '0 0 20px rgba(0, 212, 255, 0.3)',
                'glow-purple': '0 0 20px rgba(168, 85, 247, 0.3)',
                'glow-green': '0 0 20px rgba(34, 197, 94, 0.3)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'shimmer': 'shimmer 2s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(0, 212, 255, 0.5)' },
                    '100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.8)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}
