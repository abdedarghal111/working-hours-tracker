import { app, ipcMain } from 'electron'
import { WindowManager } from './class/WindowManager'
import { DatabaseManager } from './class/DatabaseManager'
import { registerIpcHandlers } from './communications'
import { initializeLogger, logger } from './logger'

const windowManager = new WindowManager()

// 1. Initialize the window. It will show a loading screen.
windowManager
  .initialize()
  .then(() => {
    // 2. Connect the logger. Now we can receive logs from the backend.
    initializeLogger(windowManager.getMainWindow())
  })
  .catch((error) => {
    // Use console.error here because the logger might not be ready.
    console.error('Failed to initialize window:', error)
    app.quit()
  })

// 3. Listen for the frontend's "I'm ready" signal.
ipcMain.handle('frontend-ready', async () => {
  try {
    logger.log('Frontend is ready. Initializing backend components...')

    // 4. NOW, create and initialize the database manager.
    // The constructor log with the path is emitted here and will be captured.
    const dbManager = new DatabaseManager()
    await dbManager.initialize()

    // 5. Register the API handlers that depend on the database.
    registerIpcHandlers(dbManager)

    // 6. Notify the frontend that everything is ready.
    logger.log('Backend is ready. Notifying frontend.')
    windowManager.getMainWindow()?.webContents.send('app-ready')
  } catch (error) {
    logger.error('Failed to initialize backend:', error)
    // The DB manager already shows a dialog and quits if it fails.
    app.quit()
  }
})
