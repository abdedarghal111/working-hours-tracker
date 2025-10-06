import { ipcMain } from 'electron'
import { DatabaseManager } from './class/DatabaseManager'

export function registerIpcHandlers(dbManager: DatabaseManager): void {
  ipcMain.handle('timer:start', async () => {
    const startTime = new Date().toISOString()
    return dbManager.createWorkSession(startTime)
  })

  ipcMain.handle('timer:pause', async (_, sessionId: number) => {
    const pauseTime = new Date().toISOString()
    await dbManager.updateSessionStatus(sessionId, true)
    await dbManager.createPause(sessionId, pauseTime)
  })

  ipcMain.handle('timer:resume', async (_, sessionId: number) => {
    const resumeTime = new Date().toISOString()
    await dbManager.updateSessionStatus(sessionId, false)
    await dbManager.resumePause(sessionId, resumeTime)
  })

  ipcMain.handle('timer:stop', async (_, sessionId: number) => {
    const endTime = new Date().toISOString()
    await dbManager.endWorkSession(sessionId, endTime)
  })

  ipcMain.handle('timer:getState', async () => {
    const session = await dbManager.getActiveWorkSession()
    if (!session) {
      return null
    }
    const pauses = await dbManager.getPauseIntervalsForSession(session.id)
    return { session, pauses }
  })
}