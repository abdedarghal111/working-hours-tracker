import { createSignal, onCleanup, Component, onMount } from 'solid-js'
import { FontAwesomeIcon } from 'solid-fontawesome'
import { Button } from 'solid-bootstrap'
import { SessionData } from '@shared/types'

import startSound from '@assets/sounds/startTimer.mp3'
import pauseSound from '@assets/sounds/pauseTimer.mp3'
import resumeSound from '@assets/sounds/resumeTimer.mp3'
import stopSound from '@assets/sounds/stopTimer.mp3'

const playSound = (soundFile: string): void => {
  new Audio(soundFile).play().catch((e) => console.error('Error playing sound:', e))
}

const Timer: Component = () => {
  const [timerState, setTimerState] = createSignal<SessionData | null>(null)
  const [displayTime, setDisplayTime] = createSignal(0)

  let displayInterval: number | undefined

  const calculateElapsedTime = (state: SessionData): number => {
    const startTime = new Date(state.session.start_time).getTime()
    let totalPausedTime = 0

    state.pauses.forEach((p) => {
      if (p.resume_time) {
        totalPausedTime += new Date(p.resume_time).getTime() - new Date(p.pause_time).getTime()
      } else {
        totalPausedTime += new Date().getTime() - new Date(p.pause_time).getTime()
      }
    })

    const now = new Date().getTime()
    const elapsed = now - startTime - totalPausedTime
    return Math.floor(elapsed / 1000)
  }

  const updateDisplay = (): void => {
    const state = timerState()
    if (state && !state.session.is_paused) {
      setDisplayTime(calculateElapsedTime(state))
    }
  }

  const startDisplayUpdates = (): void => {
    if (displayInterval) clearInterval(displayInterval)
    displayInterval = window.setInterval(updateDisplay, 1000)
  }

  const stopDisplayUpdates = (): void => {
    if (displayInterval) clearInterval(displayInterval)
  }

  onMount(async (): Promise<void> => {
    const state = await window.api.getState()
    if (state) {
      setTimerState(state)
      setDisplayTime(calculateElapsedTime(state))
      if (!state.session.is_paused) {
        startDisplayUpdates()
      }
    }
  })

  onCleanup(stopDisplayUpdates)

  const handleStart = async (): Promise<void> => {
    await window.api.startTimer()
    playSound(startSound)
    const state = await window.api.getState()
    setTimerState(state)
    startDisplayUpdates()
  }

  const handlePause = async (): Promise<void> => {
    const state = timerState()
    if (state) {
      await window.api.pauseTimer(state.session.id)
      playSound(pauseSound)
      const newState = await window.api.getState()
      setTimerState(newState)
      stopDisplayUpdates()
    }
  }

  const handleResume = async (): Promise<void> => {
    const state = timerState()
    if (state) {
      await window.api.resumeTimer(state.session.id)
      playSound(resumeSound)
      const newState = await window.api.getState()
      setTimerState(newState)
      startDisplayUpdates()
    }
  }

  const handleStop = async (): Promise<void> => {
    const state = timerState()
    if (state) {
      await window.api.stopTimer(state.session.id)
      playSound(stopSound)
      setTimerState(null)
      setDisplayTime(0)
      stopDisplayUpdates()
    }
  }

  const formatTime = (timeInSeconds: number): string => {
    const hours = Math.floor(timeInSeconds / 3600)
    const minutes = Math.floor((timeInSeconds % 3600) / 60)
    const seconds = timeInSeconds % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
      seconds
    ).padStart(2, '0')}`
  }

  const isRunning = (): boolean => !!(timerState() && timerState()?.session.is_paused === 0)
  const isPaused = (): boolean => !!(timerState() && timerState()?.session.is_paused === 1)

  return (
    <>
      <div class="display-1 fw-bold mb-4">{formatTime(displayTime())}</div>
      <hr class="my-4" />
      <div>
        {!timerState() && (
          <Button variant="success" class="px-4 py-2" size="lg" onClick={handleStart}>
            <FontAwesomeIcon icon={'play'} />
          </Button>
        )}

        {isRunning() && (
          <Button variant="warning" class="px-4 py-2" size="lg" onClick={handlePause}>
            <FontAwesomeIcon icon={'pause'} />
          </Button>
        )}

        {isPaused() && (
          <Button variant="success" class="px-4 py-2" size="lg" onClick={handleResume}>
            <FontAwesomeIcon icon={'play'} />
          </Button>
        )}

        {(isRunning() || isPaused()) && (
          <Button variant="danger" class="ms-2 px-4 py-2" size="lg" onClick={handleStop}>
            <FontAwesomeIcon icon={'stop'} />
          </Button>
        )}
      </div>
    </>
  )
}

export default Timer
