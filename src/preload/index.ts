import { contextBridge, ipcRenderer } from 'electron'
import { type IpcApi } from '@shared/types'

const api: IpcApi = {
  startTimer: () => ipcRenderer.invoke('timer:start'),
  pauseTimer: (sessionId: number) => ipcRenderer.invoke('timer:pause', sessionId),
  resumeTimer: (sessionId: number) => ipcRenderer.invoke('timer:resume', sessionId),
  stopTimer: (sessionId: number) => ipcRenderer.invoke('timer:stop', sessionId),
  getState: () => ipcRenderer.invoke('timer:getState'),
  getHistory: () => ipcRenderer.invoke('history:get'),
  onLog: (callback: (level: string, ...args: unknown[]) => void) =>
    ipcRenderer.on('log-message', (_event, level, ...args) => callback(level, ...args)),
  onAppReady: (callback: () => void) => ipcRenderer.on('app-ready', callback),
  frontendReady: () => ipcRenderer.invoke('frontend-ready'),
  toggleDevTools: () => ipcRenderer.invoke('dev:toggle-tools')
}

try {
  contextBridge.exposeInMainWorld('api', api)
} catch (error) {
  console.error('Failed to expose API:', error)
}
