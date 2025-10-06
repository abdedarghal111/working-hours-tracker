import { app, dialog } from 'electron'
import { join } from 'path'
import sqlite3 from 'sqlite3'
import { PauseInterval, WorkSession, SessionData } from '@shared/types'
import { logger } from '../logger'

export class DatabaseManager {
  private db: sqlite3.Database | null = null
  private dbPath: string

  constructor() {
    const dbName = 'workingHoursTrackerDB.sqlite'
    // CORRECT LOCATION: Use the dedicated user data path, which is always writable.
    const appPath = app.getPath('userData')
    this.dbPath = join(appPath, dbName)
    logger.log(`Database path set to: ${this.dbPath}`)
  }

  public initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          // --- ROBUST ERROR HANDLING ---
          const errorMessage = `No se pudo crear o abrir la base de datos en la ruta:\n\n${this.dbPath}\n\nError: ${err.message}\n\nLa aplicación se cerrará.`
          logger.error(errorMessage)
          dialog.showErrorBox('Error Crítico de Base de Datos', errorMessage)
          app.quit()
          return reject(err)
        }

        logger.log('Database connected successfully.')
        this.setupDatabase().then(resolve).catch(reject)
      })
    })
  }

  private setupDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const createSessionsTable = `
        CREATE TABLE IF NOT EXISTS work_sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          start_time DATETIME NOT NULL,
          end_time DATETIME,
          is_paused INTEGER NOT NULL DEFAULT 0
        );`

      const createPausesTable = `
        CREATE TABLE IF NOT EXISTS pause_intervals (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          session_id INTEGER NOT NULL,
          pause_time DATETIME NOT NULL,
          resume_time DATETIME,
          FOREIGN KEY (session_id) REFERENCES work_sessions (id)
        );`

      this.db?.exec(createSessionsTable, (err) => {
        if (err) return reject(err)
        this.db?.exec(createPausesTable, (err) => {
          if (err) return reject(err)
          logger.log('Database tables are set up correctly.')
          resolve()
        })
      })
    })
  }

  // --- Data Access Methods ---

  public createWorkSession(startTime: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db?.run(
        'INSERT INTO work_sessions (start_time, is_paused) VALUES (?, 0)',
        [startTime],
        function (err) {
          if (err) return reject(err)
          resolve(this.lastID)
        }
      )
    })
  }

  public getActiveWorkSession(): Promise<WorkSession | null> {
    return new Promise((resolve, reject) => {
      this.db?.get(
        'SELECT * FROM work_sessions WHERE end_time IS NULL ORDER BY id DESC LIMIT 1',
        (err, row: WorkSession) => {
          if (err) return reject(err)
          resolve(row || null)
        }
      )
    })
  }

  public getPauseIntervalsForSession(sessionId: number): Promise<PauseInterval[]> {
    return new Promise((resolve, reject) => {
      this.db?.all(
        'SELECT * FROM pause_intervals WHERE session_id = ?',
        [sessionId],
        (err, rows: PauseInterval[]) => {
          if (err) return reject(err)
          resolve(rows)
        }
      )
    })
  }

  public updateSessionStatus(sessionId: number, isPaused: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db?.run(
        'UPDATE work_sessions SET is_paused = ? WHERE id = ?',
        [isPaused ? 1 : 0, sessionId],
        (err) => {
          if (err) return reject(err)
          resolve()
        }
      )
    })
  }

  public createPause(sessionId: number, pauseTime: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db?.run(
        'INSERT INTO pause_intervals (session_id, pause_time) VALUES (?, ?)',
        [sessionId, pauseTime],
        (err) => {
          if (err) return reject(err)
          resolve()
        }
      )
    })
  }

  public resumePause(sessionId: number, resumeTime: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db?.run(
        'UPDATE pause_intervals SET resume_time = ? WHERE session_id = ? AND resume_time IS NULL',
        [resumeTime, sessionId],
        (err) => {
          if (err) return reject(err)
          resolve()
        }
      )
    })
  }

  public endWorkSession(sessionId: number, endTime: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db?.run(
        'UPDATE work_sessions SET end_time = ?, is_paused = 0 WHERE id = ?',
        [endTime, sessionId],
        (err) => {
          if (err) return reject(err)
          resolve()
        }
      )
    })
  }

  public async getCompletedWorkSessions(): Promise<SessionData[]> {
    const sessions = await new Promise<WorkSession[]>((resolve, reject) => {
      this.db?.all(
        'SELECT * FROM work_sessions WHERE end_time IS NOT NULL ORDER BY start_time DESC',
        (err, rows: WorkSession[]) => {
          if (err) return reject(err)
          logger.log('Raw history from DB:', rows) // <-- DEBUG LOG
          resolve(rows)
        }
      )
    })

    const fullSessions: SessionData[] = []
    for (const session of sessions) {
      const pauses = await this.getPauseIntervalsForSession(session.id)
      fullSessions.push({ session, pauses })
    }

    return fullSessions
  }
}
