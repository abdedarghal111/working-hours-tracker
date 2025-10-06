import { Component, createSignal } from 'solid-js'
import { Container, Card, Button } from 'solid-bootstrap'
import { FontAwesomeIcon } from 'solid-fontawesome'
import Timer from './components/Timer'
import History from './components/History'
import './App.css'

const App: Component = () => {
  const [isHistoryOpen, setIsHistoryOpen] = createSignal(false)

  const closeHistory = () => setIsHistoryOpen(false)

  return (
    <div class="app-container">
      <Button
        variant="light"
        class={`history-toggle-btn shadow ${isHistoryOpen() ? 'open' : ''}`}
        onClick={() => setIsHistoryOpen(!isHistoryOpen())}
      >
        <FontAwesomeIcon icon={'chevron-right'} />
      </Button>

      <div class={`history-backdrop ${isHistoryOpen() ? 'show' : ''}`} onClick={closeHistory} />

      <div class={`history-panel shadow-lg ${isHistoryOpen() ? 'open' : ''}`}>
        <History isOpen={isHistoryOpen()} />
      </div>

      <div class="main-content">
        <Container class="d-flex justify-content-center align-items-center vh-100">
          <Card class="shadow-sm text-center" style={{ width: '30rem' }}>
            <Card.Body>
              <Timer />
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  )
}

export default App
