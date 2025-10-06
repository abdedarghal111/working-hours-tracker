/// <reference types="vite/client" />

import { IpcApi } from '../shared/types'

declare global {
  interface Window {
    api: IpcApi
  }
}

import type { RendererApi } from '../shared/ipc'
import type { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: RendererApi
  }
}
