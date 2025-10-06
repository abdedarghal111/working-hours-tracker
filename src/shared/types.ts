// This file contains types shared between the backend, preload, and frontend.

// --- Database & API Data Structures ---

export interface WorkSession {
  id: number
  start_time: string
  end_time: string | null
  is_paused: number // SQLite doesn't have a boolean type, so 0 or 1
}

export interface PauseInterval {
  id: number
  session_id: number
  pause_time: string
  resume_time: string | null
}

export interface SessionData {
  session: WorkSession
  pauses: PauseInterval[]
}

// --- IPC API Definition ---

export interface IpcApi {
  startTimer: () => Promise<number>
  pauseTimer: (sessionId: number) => Promise<void>
  resumeTimer: (sessionId: number) => Promise<void>
  stopTimer: (sessionId: number) => Promise<void>
  getState: () => Promise<SessionData | null>
  getHistory: () => Promise<SessionData[]>
  onLog: (callback: (level: string, ...args: unknown[]) => void) => void
  onAppReady: (callback: () => void) => void
  frontendReady: () => Promise<void>
}
