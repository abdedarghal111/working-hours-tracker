import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: {
        entry: 'src/backend/main.ts'
      }
    },
    resolve: {
      alias: {
        '@shared': resolve('src', 'shared'),
        '@frontend': resolve('src', 'frontend'),
        '@components': resolve('src', 'frontend', 'components'),
        '@assets': resolve('src', '..', 'assets')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: {
        entry: 'src/backend/communications.ts'
      }
    },
    resolve: {
      alias: {
        '@shared': resolve('src', 'shared'),
        '@frontend': resolve('src', 'frontend'),
        '@components': resolve('src', 'frontend', 'components'),
        '@assets': resolve('src', '..', 'assets')
      }
    }
  },
  renderer: {
    root: resolve('src', 'frontend'),
    build: {
      rollupOptions: {
        input: resolve('src', 'frontend', 'index.html')
      }
    },
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