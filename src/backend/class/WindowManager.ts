import { app, BrowserWindow, shell } from 'electron'
import { join } from 'path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import icon from '@assets/icon.png?asset'

export class WindowManager {
  private mainWindow: BrowserWindow | null = null

  public async initialize(): Promise<void> {
    await app.whenReady()

    electronApp.setAppUserModelId('com.electron')

    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    app.on('activate', this.handleActivate)
    app.on('window-all-closed', this.handleAllClosed)

    this.createMainWindow()
  }

  public getMainWindow(): BrowserWindow | null {
    return this.mainWindow
  }

  public toggleDevTools(): void {
    this.mainWindow?.webContents.toggleDevTools()
  }

  private createMainWindow(): void {
    this.mainWindow = new BrowserWindow({
      width: 900,
      height: 670,
      show: false,
      autoHideMenuBar: true,
      title: 'Working Hours Tracker',
      icon: icon,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    })

    this.mainWindow.on('ready-to-show', () => {
      this.mainWindow?.show()
      // this.mainWindow?.webContents.openDevTools()
    })

    this.mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url)
      return { action: 'deny' }
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      this.mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      this.mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }
  }

  private handleActivate = (): void => {
    if (BrowserWindow.getAllWindows().length === 0) {
      this.createMainWindow()
    }
  }

  private handleAllClosed = (): void => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  }
}
