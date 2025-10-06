// src/backend/logger.ts
import { BrowserWindow } from 'electron'

let mainWindow: BrowserWindow | null = null
let logBuffer: { level: 'log' | 'error' | 'warn' | 'info'; args: unknown[] }[] = []

/**
 * Initializes the logger with the main browser window.
 * It sends any buffered logs and sets up forwarding for future logs.
 */
export function initializeLogger(win: BrowserWindow | null): void {
  if (!win) {
    console.error('Logger could not be initialized: No main window provided.')
    return
  }
  mainWindow = win

  // Send any buffered logs
  if (logBuffer.length > 0) {
    logBuffer.forEach(({ level, args }) => {
      mainWindow?.webContents.send('log-message', level, ...args)
    })
    logBuffer = [] // Clear the buffer
  }
  console.log('Logger initialized and connected to frontend.')
}

function sendLog(level: 'log' | 'error' | 'warn' | 'info', ...args: unknown[]): void {
  // Always log to the backend console
  console[level](...args)

  // If the window is ready, send the log immediately. Otherwise, buffer it.
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('log-message', level, ...args)
  } else {
    logBuffer.push({ level, args })
  }
}

export const logger = {
  log: (...args: unknown[]) => sendLog('log', ...args),
  error: (...args: unknown[]) => sendLog('error', ...args),
  warn: (...args: unknown[]) => sendLog('warn', ...args),
  info: (...args: unknown[]) => sendLog('info', ...args)
}
