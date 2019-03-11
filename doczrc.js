import {css} from 'docz-plugin-css'

export default {
  title: 'React Slidy 🍃 - a simple and minimal slider component for React',
  description:
    'A carousel component for React with the basics. It just works. For minimal setup and needs. Focused on performance ⚡',
  theme: 'docz-theme-default',
  src: './src',
  themeConfig: {
    colors: {
      primary: 'green'
    }
  },
  plugins: [css({preprocessor: 'sass'})]
}
