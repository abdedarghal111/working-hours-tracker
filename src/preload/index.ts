import { contextBridge, ipcRenderer } from 'electron'
import { type IpcApi } from '@shared/types'

const api: IpcApi = {
  startTimer: () => ipcRenderer.invoke('timer:start'),
  pauseTimer: (sessionId: number) => ipcRenderer.invoke('timer:pause', sessionId),
  resumeTimer: (sessionId: number) => ipcRenderer.invoke('timer:resume', sessionId),
  stopTimer: (sessionId: number) => ipcRenderer.invoke('timer:stop', sessionId),
  getState: () => ipcRenderer.invoke('timer:getState'),
  getHistory: () => ipcRenderer.invoke('history:get')
}

try {
  contextBridge.exposeInMainWorld('api', api)
} catch (error) {
  console.error('Failed to expose API:', error)
}
