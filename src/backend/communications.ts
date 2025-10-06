import { contextBridge, ipcMain, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { RendererApi } from '@shared/ipc'

export const registerMainHandlers = (): void => {
  ipcMain.on('ping', () => {
    console.log('pong')
  })
}

const exposeRendererApi = (): void => {
  const api: RendererApi = {
    ping: () => ipcRenderer.send('ping')
  }

  if (process.contextIsolated) {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } else {
    const target = globalThis as typeof globalThis & {
      electron?: typeof electronAPI
      api?: RendererApi
    }

    target.electron = electronAPI
    target.api = api
  }
}

const isRendererProcess = process.type === 'renderer' || process.type === 'worker'

if (isRendererProcess) {
  exposeRendererApi()
}
