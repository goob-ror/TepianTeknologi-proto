/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.tsx",
    "./resources/**/*.ts",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0B46F9',
        secondary: '#FFFFFF',
        tertiary: '#7D7D7D',
        'light-text': '#FFFFFF',
        'dark-text': '#000000',
        'grey-text': '#53535B',
      },
      fontFamily: {
        'main': ['Montserrat', 'sans-serif'],
        'secondary': ['Istok Web', 'sans-serif'],
      },
      fontSize: {
        'small': '12px',
        'medium': '16px',
        'large': '20px',
        'xlarge': '24px',
        'xxlarge': '32px',
      },
      fontWeight: {
        'light': '300',
        'regular': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}
