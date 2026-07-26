/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#12141C',
          soft: '#181B27',
          card: '#1E2230',
          line: '#2B2F40',
        },
        paper: {
          DEFAULT: '#F7F3EA',
          dim: '#EDE7D8',
          line: '#D8D0BC',
        },
        amber: {
          DEFAULT: '#E8A33D',
          soft: '#F2C173',
        },
        teal: {
          DEFAULT: '#2DD4BF',
          soft: '#7EEDE0',
        },
        coral: {
          DEFAULT: '#F0685C',
          soft: '#F7A79F',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Manrope"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        perforation:
          'repeating-linear-gradient(90deg, transparent, transparent 6px, #12141C 6px, #12141C 12px)',
      },
    },
  },
  plugins: [],
}
