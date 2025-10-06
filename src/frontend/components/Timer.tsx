import { createSignal, onCleanup, Component } from 'solid-js'
import { FontAwesomeIcon } from 'solid-fontawesome'
import { Button } from 'solid-bootstrap'

const Timer: Component = () => {
  const [time, setTime] = createSignal(0)
  const [isActive, setIsActive] = createSignal(false)

  let interval: number | undefined

  const startTimer = (): void => {
    setIsActive(true)
    interval = window.setInterval(() => {
      setTime((prevTime) => prevTime + 1)
    }, 1000)
  }

  const pauseTimer = (): void => {
    setIsActive(false)
    if (interval) {
      window.clearInterval(interval)
    }
  }

  const resetTimer = (): void => {
    setIsActive(false)
    setTime(0)
    if (interval) {
      window.clearInterval(interval)
    }
  }

  onCleanup(() => {
    if (interval) {
      window.clearInterval(interval)
    }
  })

  const formatTime = (timeInSeconds: number): string => {
    const hours = Math.floor(timeInSeconds / 3600)
    const minutes = Math.floor((timeInSeconds % 3600) / 60)
    const seconds = timeInSeconds % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
      seconds
    ).padStart(2, '0')}`
  }

  return (
    <>
      <div class="display-1 fw-bold mb-4">{formatTime(time())}</div>
      <hr class="my-4" />
      <div>
        <Button
          variant="success"
          class="me-2 px-4 py-2"
          size="lg"
          onClick={startTimer}
          disabled={isActive()}
        >
          <FontAwesomeIcon icon={'play'} />
        </Button>
        <Button
          variant="warning"
          class="mx-2 px-4 py-2"
          size="lg"
          onClick={pauseTimer}
          disabled={!isActive()}
        >
          <FontAwesomeIcon icon={'pause'} />
        </Button>
        <Button variant="danger" class="ms-2 px-4 py-2" size="lg" onClick={resetTimer}>
          <FontAwesomeIcon icon={'stop'} />
        </Button>
      </div>
    </>
  )
}

export default Timer
