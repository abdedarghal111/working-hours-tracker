import { app } from 'electron'
import { WindowManager } from './class/WindowManager'
import { DatabaseManager } from './class/DatabaseManager'
import { registerIpcHandlers } from './communications'

const dbManager = new DatabaseManager()
const windowManager = new WindowManager()

dbManager
  .initialize()
  .then(() => {
    registerIpcHandlers(dbManager)
    return windowManager.initialize()
  })
  .catch((error) => {
    console.error('Failed to initialize application', error)
    app.quit()
  })
