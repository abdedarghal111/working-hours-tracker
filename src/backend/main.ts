import { app } from 'electron'
import { WindowManager } from './class/WindowManager'

const windowManager = new WindowManager()

windowManager.initialize().catch((error) => {
  console.error('Failed to initialize application window', error)
  app.quit()
})
