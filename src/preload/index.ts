import { contextBridge, ipcRenderer } from 'electron'

const api = {
  startTimer: (): Promise<number> => ipcRenderer.invoke('timer:start'),
  pauseTimer: (sessionId: number): Promise<void> => ipcRenderer.invoke('timer:pause', sessionId),
  resumeTimer: (sessionId: number): Promise<void> => ipcRenderer.invoke('timer:resume', sessionId),
  stopTimer: (sessionId: number): Promise<void> => ipcRenderer.invoke('timer:stop', sessionId),
  getState: (): Promise<any> => ipcRenderer.invoke('timer:getState'),
  getHistory: (): Promise<any[]> => ipcRenderer.invoke('history:get')
}

try {
  contextBridge.exposeInMainWorld('api', api)
} catch (error) {
  console.error('Failed to expose API:', error)
}
