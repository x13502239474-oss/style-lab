import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F7F5F0',
        paper: '#FFFFFF',
        ink: '#252525',
        muted: '#858078',
        olive: '#89917B',
        sand: '#E9E3D9',
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'Songti SC', 'STSong', 'SimSun', 'serif'],
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'sans-serif',
        ],
      },
      letterSpacing: {
        editorial: '0.18em',
        wider2: '0.28em',
      },
      maxWidth: {
        reading: '480px',
      },
    },
  },
  plugins: [],
};

export default config;
