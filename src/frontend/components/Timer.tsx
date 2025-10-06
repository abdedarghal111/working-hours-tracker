import { createSignal, onCleanup, Component, onMount } from 'solid-js'
import { FontAwesomeIcon } from 'solid-fontawesome'
import { Button } from 'solid-bootstrap'

// Define the structure of our timer state
interface TimerState {
  session: {
    id: number
    start_time: string
    is_paused: number
  }
  pauses: {
    pause_time: string
    resume_time: string | null
  }[]
}

const Timer: Component = () => {
  const [timerState, setTimerState] = createSignal<TimerState | null>(null)
  const [displayTime, setDisplayTime] = createSignal(0)

  let displayInterval: number | undefined

  const calculateElapsedTime = (state: TimerState): number => {
    const startTime = new Date(state.session.start_time).getTime()
    let totalPausedTime = 0

    state.pauses.forEach((p) => {
      if (p.resume_time) {
        totalPausedTime += new Date(p.resume_time).getTime() - new Date(p.pause_time).getTime()
      } else {
        // If it's currently paused, calculate pause time up to now
        totalPausedTime += new Date().getTime() - new Date(p.pause_time).getTime()
      }
    })

    const now = new Date().getTime()
    const elapsed = now - startTime - totalPausedTime
    return Math.floor(elapsed / 1000)
  }

  const updateDisplay = () => {
    const state = timerState()
    if (state && !state.session.is_paused) {
      setDisplayTime(calculateElapsedTime(state))
    }
  }

  const startDisplayUpdates = () => {
    if (displayInterval) clearInterval(displayInterval)
    displayInterval = window.setInterval(updateDisplay, 1000)
  }

  const stopDisplayUpdates = () => {
    if (displayInterval) clearInterval(displayInterval)
  }

  onMount(async () => {
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

  const handleStart = async () => {
    await window.api.startTimer()
    const state = await window.api.getState()
    setTimerState(state)
    startDisplayUpdates()
  }

  const handlePause = async () => {
    const state = timerState()
    if (state) {
      await window.api.pauseTimer(state.session.id)
      const newState = await window.api.getState()
      setTimerState(newState)
      stopDisplayUpdates()
    }
  }

  const handleResume = async () => {
    const state = timerState()
    if (state) {
      await window.api.resumeTimer(state.session.id)
      const newState = await window.api.getState()
      setTimerState(newState)
      startDisplayUpdates()
    }
  }

  const handleStop = async () => {
    const state = timerState()
    if (state) {
      await window.api.stopTimer(state.session.id)
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

  const isRunning = () => timerState() && !timerState()?.session.is_paused
  const isPaused = () => timerState() && timerState()?.session.is_paused

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
