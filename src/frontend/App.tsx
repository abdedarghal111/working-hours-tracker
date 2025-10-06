import { createSignal, onCleanup, Component } from 'solid-js'
import { FontAwesomeIcon } from 'solid-fontawesome'
import { Container, Button, Card } from 'solid-bootstrap'

const App: Component = () => {
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
    <Container class="d-flex justify-content-center align-items-center vh-100">
      <Card class="shadow-sm text-center" style={{ width: '30rem' }}>
        <Card.Body>
          <div class="display-1 fw-bold mb-4">{formatTime(time())}</div>
          <div>
            <Button variant="success" class="me-2" onClick={startTimer} disabled={isActive()}>
              <FontAwesomeIcon icon={'play'} />
            </Button>
            <Button variant="warning" onClick={pauseTimer} disabled={!isActive()}>
              <FontAwesomeIcon icon={'pause'} />
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default App
