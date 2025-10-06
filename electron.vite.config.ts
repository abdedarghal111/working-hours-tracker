import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@shared': resolve('src', 'shared'),
        '@frontend': resolve('src', 'frontend'),
        '@components': resolve('src', 'frontend', 'components'),
        '@assets': resolve('src', '..', 'assets')
      }
    },
    plugins: [solid()]
  }
})