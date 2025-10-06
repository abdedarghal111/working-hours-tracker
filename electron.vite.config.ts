import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import solid from 'vite-plugin-solid'
import { type AliasOptions } from 'vite'

const aliases: AliasOptions = {
  '@shared': resolve('src', 'shared'),
  '@frontend': resolve('src', 'frontend'),
  '@components': resolve('src', 'frontend', 'components'),
  '@assets': resolve('src', '..', 'assets')
}

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: {
        entry: 'src/backend/main.ts'
      }
    },
    resolve: {
      alias: aliases
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: {
        entry: 'src/preload/index.ts'
      }
    },
    resolve: aliases
  },
  renderer: {
    root: resolve('src', 'frontend'),
    build: {
      rollupOptions: {
        input: resolve('src', 'frontend', 'index.html')
      }
    },
    resolve: {
      alias: aliases
    },
    plugins: [solid()]
  }
})
